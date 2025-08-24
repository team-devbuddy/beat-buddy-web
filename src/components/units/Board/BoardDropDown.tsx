'use client';

import { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState, eventFormState, isEventEditModeState, eventState } from '@/context/recoil-context';
import { deletePost } from '@/lib/actions/post-controller/deletePost';
import { getPostDetail } from '@/lib/actions/detail-controller/board/boardWriteUtils';
import { deleteComment } from '@/lib/actions/comment-controller/deleteComment';
import { submitReport } from '@/lib/actions/report-controller/submitReport';
import { deleteEvent } from '@/lib/actions/event-controller/deleteEvent';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';

interface PostProps {
  nickname: string;
  isAnonymous: boolean;
  memberId?: number; // 게시글 작성자 ID 추가
  writerId?: number; // 게시글 작성자 ID 추가
  postProfileNickname?: string;
  postProfileImageUrl?: string;
  isPostProfileCreated?: boolean;
  businessName?: string;
  role: string;
}

interface DropdownItem {
  label: string;
  icon: string;
  onClick?: () => void;
  modalType?: 'block' | 'report';
}

interface DropdownProps {
  isAuthor: boolean;
  onClose: () => void;
  position: { top: number; left: number };
  postId: number;
  commentId?: number | null;
  eventId?: number;
  type?: 'event' | 'board' | 'comment' | 'profile';
  commentAuthorName?: string; // 댓글 작성자명 추가
  onCommentDelete?: () => void; // 댓글 삭제 후 콜백 추가
  writerId?: number; // 댓글 작성자의 writerId 추가
  onPostDelete?: () => void; // 게시글 삭제 후 콜백 추가
  isAnonymous?: boolean; // 익명 여부 추가
}

const BoardDropdown = ({
  isAuthor,
  onClose,
  position,
  postId,
  commentId,
  eventId,
  type,
  commentAuthorName,
  onCommentDelete,
  writerId,
  onPostDelete,
  isAnonymous,
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [modalType, setModalType] = useState<'block' | 'report' | 'delete' | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [post, setPost] = useState<PostProps>({ nickname: '', isAnonymous: false, role: '' });
  const [showReportCompleteModal, setShowReportCompleteModal] = useState(false);
  const [showBlockCompleteModal, setShowBlockCompleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: 'post' | 'comment' | 'event'; id: number } | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // 드롭다운/모달이 열려있을 때 body 스크롤 방지
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  useEffect(() => {
    // 모달을 열 때만 닉네임 정보를 가져오도록 최적화
    if (modalType === 'block') {
      const fetchPost = async () => {
        try {
          const profileInfo = await getProfileinfo(accessToken, postId.toString());
          setPost(profileInfo);
        } catch (error) {
          console.error('게시물 정보 가져오기 실패:', error);
        }
      };
      fetchPost();
    }
  }, [modalType, postId, accessToken]);

  const items: DropdownItem[] = useMemo(() => {
    if (isAuthor) {
      // 내가 쓴 글
      if (type === 'comment') {
        // 댓글인 경우 삭제하기만
        return [
          {
            label: '삭제하기',
            icon: '/icons/trashcan.svg',
            onClick: () => showDeleteConfirmModal('comment', commentId!),
          },
        ];
      } else if (type === 'event') {
        // 이벤트인 경우 수정하기, 삭제하기
        return [
          {
            label: '수정하기',
            icon: '/icons/edit.svg',
            onClick: () => router.push(`/event/write?eventId=${eventId}`),
          },
          {
            label: '삭제하기',
            icon: '/icons/trashcan.svg',
            onClick: () => showDeleteConfirmModal('event', eventId!),
          },
        ];
      } else {
        // 게시글인 경우 수정하기, 삭제하기
        return [
          {
            label: '수정하기',
            icon: '/icons/edit.svg',
            onClick: () => router.push(`/board/write?postId=${postId}`),
          },
          {
            label: '삭제하기',
            icon: '/icons/trashcan.svg',
            onClick: () => showDeleteConfirmModal('post', postId),
          },
        ];
      }
    }

    // 남이 쓴 글~~~
    if (type === 'comment') {
      return [
        { label: '차단하기', icon: '/icons/block.svg', modalType: 'block' },
        { label: '신고하기', icon: '/icons/material-symbols_siren-outline.svg', modalType: 'report' },
      ];
    }
    // 6) 남이 쓴 게시글(보드)
    return [
      { label: '신고하기', icon: '/icons/material-symbols_siren-outline.svg', modalType: 'report' },
      { label: '차단하기', icon: '/icons/block.svg', modalType: 'block' },
    ];
  }, [isAuthor, type, postId, eventId, accessToken, router, onPostDelete, commentId, onCommentDelete]);

  const handleBlock = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Access: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          blockedMemberId: type === 'comment' ? writerId : post.memberId || writerId || post.writerId,
        }),
      });

      if (!response.ok) {
        throw new Error('차단 요청에 실패했습니다.');
      }

      console.log(`${post.nickname}님 차단 완료`);
      setModalType(null);
      setShowBlockCompleteModal(true);
    } catch (error) {
      console.error('차단 처리 실패:', error);
    }
  };

  const handleReport = async () => {
    if (!reportReason.trim()) {
      return;
    }

    try {
      let targetType: 'FREE_POST' | 'FREE_POST_COMMENT';
      let targetId: number;

      if (type === 'comment') {
        targetType = 'FREE_POST_COMMENT';
        targetId = commentId!;
      } else {
        targetType = 'FREE_POST';
        targetId = postId;
      }

      const reportData = {
        targetType,
        targetId,
        reason: reportReason.trim(),
      };

      const success = await submitReport(reportData, accessToken);

      if (success) {
        setModalType(null);
        setReportReason('');
        setShowReportCompleteModal(true);
      } else {
        alert('신고 접수에 실패했습니다.');
      }
    } catch (error) {
      console.error('신고 처리 실패:', error);
      alert('신고 처리에 실패했습니다. 다시 시도해주세요');
    }
  };

  // 삭제 확인 모달을 표시하는 함수
  const showDeleteConfirmModal = (deleteType: 'post' | 'comment' | 'event', id: number) => {
    setDeleteTarget({ type: deleteType, id });
    setModalType('delete');
  };

  // 실제 삭제를 수행하는 함수
  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      if (deleteTarget.type === 'comment') {
        await deleteComment(postId, deleteTarget.id, accessToken);
        onCommentDelete?.();
      } else if (deleteTarget.type === 'event') {
        await deleteEvent(deleteTarget.id, accessToken);
        onPostDelete?.();
        router.push('/event');
      } else {
        await deletePost(accessToken, deleteTarget.id);
        onPostDelete?.();
      }

      setModalType(null);
      setDeleteTarget(null);
      onClose();
    } catch (error) {
      console.error('삭제 처리 실패:', error);
      alert('삭제에 실패했습니다. 다시 시도해주세요');
    }
  };

  return createPortal(
    <>
      {/* ✅ 배경 오버레이 - 클릭을 차단하여 뒤의 요소가 클릭되지 않도록 함 */}
      <div
        className="fixed inset-0 z-30 bg-black/50"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          modalType ? setModalType(null) : onClose();
        }}
      />

      {/* ✅ 드롭다운 메뉴 */}
      <AnimatePresence>
        {!modalType && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed z-50 flex w-[5.5625rem] flex-col whitespace-nowrap rounded-[0.5rem] bg-gray700 px-[1.12rem] shadow-lg"
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()}>
            {items.map((item, index) => (
              <button
                key={item.label}
                className={`w-full text-center text-[0.8125rem] text-gray200 ${
                  index === 0 ? 'rounded-t-[0.5rem]' : ''
                } ${index === items.length - 1 ? 'rounded-b-[0.5rem]' : ''} ${
                  index !== items.length - 1 ? '' : ''
                } py-[0.56rem]`}
                // 🔥 수정된 클릭 핸들러
                onClick={() => {
                  if (item.modalType) {
                    setModalType(item.modalType);
                    // onClose() 제거 - 모달이 열리도록 유지
                    return;
                  }
                  if (item.onClick) {
                    try {
                      item.onClick();
                    } catch (e) {
                      console.error('실행 중 오류 발생:', e);
                    }
                    // 삭제 확인 모달의 경우 onClose() 호출하지 않음
                    if (!item.label.includes('삭제하기')) {
                      onClose();
                    }
                  }
                }}>
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ 차단 모달 */}
      <AnimatePresence>
        {modalType === 'block' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="mx-5 w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
              onClick={(e) => e.stopPropagation()}>
              <p className="mb-[0.38rem] text-subtitle-20-bold text-white">
                {type === 'comment' && `${commentAuthorName}님을 차단하시겠어요?`}
                {type === 'board' && `${post.isAnonymous ? '익명' : post.nickname}님을 차단하시겠어요?`}
                {type === 'profile' && `${post.postProfileNickname}님을 차단하시겠어요?`}
              </p>
              <p className="mb-5 text-center text-body-14-medium text-gray300">
                해당 작성자의 게시글과 댓글이
                <br />
                더 이상 표시되지 않습니다
                <br />
                <p className="mt-[0.38rem] text-body-12-medium text-gray500">
                  차단은 해제할 수 없으니 신중히 결정해주세요
                </p>
              </p>
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => {
                    setModalType(null);
                    onClose();
                  }}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-gray200">
                  취소
                </button>
                <button
                  onClick={handleBlock}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-main">
                  차단하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ 삭제 확인 모달 */}
      <AnimatePresence>
        {modalType === 'delete' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="mx-5 w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
              onClick={(e) => e.stopPropagation()}>
              <p className="mb-5 text-subtitle-20-bold text-white">삭제하시겠습니까?</p>
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => {
                    setModalType(null);
                    setDeleteTarget(null);
                    onClose();
                  }}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-gray200">
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-main">
                  확인
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ 신고 모달 */}
      <AnimatePresence>
        {modalType === 'report' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="mx-5 w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-5 text-center"
              onClick={(e) => e.stopPropagation()}>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="신고 사유를 작성해 주세요"
                className="mb-4 min-h-[7.5rem] w-full resize-none rounded-[0.5rem] bg-gray700 px-4 py-3 text-body-14-medium text-gray200 placeholder:text-gray200 focus:outline-none"
                style={{
                  marginBottom: '1rem',
                  display: 'block',
                  verticalAlign: 'top',
                }}
              />
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => {
                    setModalType(null);
                    onClose();
                  }}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-gray200">
                  취소
                </button>
                <button
                  onClick={handleReport}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-main">
                  신고하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ 신고 완료 모달 */}
      <AnimatePresence>
        {showReportCompleteModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="mx-5 w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-[0.38rem] text-subtitle-20-bold text-white">신고가 완료되었어요</h3>
              <p className="text-body-14-medium text-gray300">신고해주신 내용은 담당자가 검토할 예정이에요</p>
              <p className="mb-5 text-body-14-medium text-gray300">허위 신고 시 제재가 있을 수 있습니다.</p>
              <button
                onClick={() => {
                  setShowReportCompleteModal(false);
                  onClose();
                }}
                className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-gray200">
                닫기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ 차단 완료 모달 */}
      <AnimatePresence>
        {showBlockCompleteModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="mx-5 w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-[0.38rem] text-subtitle-20-bold text-white">차단이 완료되었어요</h3>
              <p className="text-body-14-medium text-gray300">해당 사용자의 게시글과 댓글이</p>
              <p className="mb-5 text-body-14-medium text-gray300">더 이상 표시되지 않습니다</p>
              <button
                onClick={() => {
                  setShowBlockCompleteModal(false);
                  onClose();
                }}
                className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-gray200">
                닫기
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
};
export default BoardDropdown;
