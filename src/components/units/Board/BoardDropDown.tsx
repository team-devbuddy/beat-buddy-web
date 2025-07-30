'use client';

import { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { deletePost } from '@/lib/actions/post-controller/deletePost';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getPostDetail } from '@/lib/actions/detail-controller/board/boardWriteUtils';
import { deleteComment } from '@/lib/actions/comment-controller/deleteComment';

interface PostProps {
  nickname: string;
  memberId?: number; // 게시글 작성자 ID 추가
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
  type?: 'event' | 'board' | 'comment';
  commentAuthorName?: string; // 댓글 작성자명 추가
  onCommentDelete?: () => void; // 댓글 삭제 후 콜백 추가
  writerId?: number; // 댓글 작성자의 writerId 추가
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
}: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [modalType, setModalType] = useState<'block' | 'report' | null>(null);
  const [reportReason, setReportReason] = useState('');
  const [post, setPost] = useState<PostProps>({ nickname: '' });

  const handleDeleteComment = useCallback(async () => {
    if (!commentId) return alert('댓글 ID가 없습니다.');
    try {
      await deleteComment(postId, commentId, accessToken);
      onClose();
      // 댓글 삭제 후 UI에서 제거
      onCommentDelete?.();
    } catch (e) {
      console.error('댓글 삭제 실패', e);
      alert('댓글 삭제에 실패했습니다.');
    }
  }, [commentId, postId, accessToken, onClose, onCommentDelete]);

  const items: DropdownItem[] = useMemo(() => {
    if (isAuthor) {
      if (type === 'comment') {
        return [
          {
            label: '공유',
            icon: '/icons/material-symbols_share-outline.svg',
            onClick: () => navigator.share({ title: '게시글', url: window.location.href }),
          },
          {
            label: '삭제',
            icon: '/icons/trashcan.svg',
            onClick: handleDeleteComment,
          },
        ];
      } else {
        return [
          {
            label: '공유',
            icon: '/icons/material-symbols_share-outline.svg',
            onClick: () => navigator.share({ title: '게시글', url: window.location.href }),
          },
          {
            label: '수정',
            icon: '/icons/edit.svg',
            onClick: () => router.push(`/board/write?postId=${postId}`),
          },
          {
            label: '삭제',
            icon: '/icons/trashcan.svg',
            onClick: async () => {
              await deletePost(accessToken, postId);
              router.push('/board');
            },
          },
        ];
      }
    }

    if (type === 'event') {
      return [
        {
          label: '공유',
          icon: '/icons/material-symbols_share-outline.svg',
          onClick: () => navigator.share({ title: '이벤트', url: window.location.href }),
        },
        {
          label: '신고',
          icon: '/icons/material-symbols_siren-outline.svg',
          modalType: 'report',
        },
      ];
    }

    return [
      {
        label: '공유',
        icon: '/icons/material-symbols_share-outline.svg',
        onClick: () => navigator.share({ title: '게시글', url: window.location.href }),
      },
      { label: '차단', icon: '/icons/block.svg', modalType: 'block' },
      { label: '신고', icon: '/icons/material-symbols_siren-outline.svg', modalType: 'report' },
    ];
  }, [isAuthor, type]);

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
      if (type === 'comment' && commentAuthorName) {
        // 댓글인 경우 전달받은 댓글 작성자명 사용
        setPost({ nickname: commentAuthorName });
      } else {
        // 게시글인 경우 기존 로직 사용
        const fetchPost = async () => {
          try {
            const postDetail = await getPostDetail('free', postId, accessToken);
            setPost(postDetail);
          } catch (error) {
            console.error('게시물 정보 가져오기 실패:', error);
          }
        };
        fetchPost();
      }
    }
  }, [modalType, postId, accessToken, type, commentAuthorName]);

  const handleBlock = async () => {
    console.log('writerId', writerId);
    console.log('postId', postId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/members/block`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Access: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          blockedMemberId: type === 'comment' ? writerId : post.memberId || postId, // 게시글 작성자 ID 사용
        }),
      });

      if (!response.ok) {
        throw new Error('차단 요청에 실패했습니다.');
      }

      console.log(`${post.nickname}님 차단 완료`);
      setModalType(null);
      onClose();
    } catch (error) {
      console.error('차단 처리 실패:', error);
      alert('차단 처리에 실패했습니다. 다시 시도해주세요.');
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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="pointer-events-auto fixed z-50 min-w-[100px] space-y-2 rounded-[0.75rem] bg-gray700 px-4 py-3 shadow-lg"
            style={{ top: position.top, left: position.left }}
            onClick={(e) => e.stopPropagation()}>
            {items.map((item) => (
              <button
                key={item.label}
                className="flex w-full items-center justify-between rounded-md text-body3-12-medium text-white"
                // 🔥 수정된 클릭 핸들러
                onClick={async () => {
                  if (item.modalType) {
                    setModalType(item.modalType);
                    return;
                  }
                  if (item.onClick) {
                    try {
                      await item.onClick();
                    } catch (e) {
                      console.error('실행 중 오류 발생:', e);
                    }
                    onClose();
                  }
                }}>
                <span>{item.label}</span>
                <Image src={item.icon} alt={item.label} width={16} height={16} />
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
            <div className="rounded-lg bg-BG-black px-5 pb-6 pt-6 text-center" onClick={(e) => e.stopPropagation()}>
              <p className="mb-2 w-[18rem] text-[1.25rem] font-bold text-white">{post.nickname}님을 차단하시겠어요?</p>
              <p className="mb-4 text-center text-[0.875rem] text-gray300">
                해당 작성자의 게시글과 댓글이
                <br />
                더 이상 표시되지 않습니다.
                <br />
                차단은 해제할 수 없으며, 되돌릴 수 없습니다.
                <br />
                신중히 결정해주세요.
              </p>
              <div className="flex justify-between gap-3">
                <button
                  onClick={() => setModalType(null)}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.62rem] text-gray200">
                  취소
                </button>
                <button
                  onClick={handleBlock}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.62rem] text-main">
                  차단하기
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
            <div className="rounded-lg bg-BG-black px-5 pb-6 pt-6 text-center" onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-4 text-[1.25rem] font-bold text-white">게시물 신고</h3>
              <textarea
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                placeholder="신고 사유를 작성해 주세요 (예: 부적절한 콘텐츠, 스팸, 욕설 등)"
                className="mb-4 min-h-[7.5rem] w-full min-w-[18rem] resize-none rounded-[0.5rem] bg-gray700 p-2 text-sm text-gray200 placeholder:text-gray300 focus:outline-none"
              />
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setModalType(null)}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.62rem] font-bold text-gray200">
                  취소
                </button>
                <button
                  onClick={() => {
                    // 신고 처리 로직
                    console.log('신고 내용:', reportReason);
                    setModalType(null);
                  }}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.62rem] font-bold text-main">
                  신고하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
};
export default BoardDropdown;
