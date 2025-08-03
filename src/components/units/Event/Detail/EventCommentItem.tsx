'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { formatRelativeTime } from '../../Board/BoardThread';
import { postComment } from '@/lib/actions/event-controller/postComment';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import BoardDropDown from '../../Board/BoardDropDown';
import { deleteComment } from '@/lib/actions/comment-controller/deleteComment';
import { motion, AnimatePresence } from 'framer-motion';

interface CommentType {
  commentId: number;
  commentLevel: number;
  content: string;
  authorNickname: string;
  anonymous: boolean;
  createdAt: string;
  isAuthor: boolean;
  isFollowing: boolean;
  writerId: number;
  isStaff: boolean;
  replies?: CommentType[];
}

export default function EventCommentItem({
  comment,
  eventId,
  refreshComments,
}: {
  comment: CommentType;
  eventId: number;
  refreshComments: (scrollToReplyId?: number) => void;
}) {
  const [replyContent, setReplyContent] = useState('');
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ commentId: number; isReply: boolean } | null>(null);
  const buttonRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      setPosition({
        top: rect.bottom + scrollY + 4,
        left: rect.left + scrollX - 80,
      });
    }
  }, [showDropdown]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!buttonRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const response = await postComment(
        eventId,
        {
          content: replyContent,
          anonymous: false,
          parentCommentId: comment.commentId,
        },
        accessToken,
      );

      const newReplyId = response?.data?.commentId;
      setReplyContent('');

      refreshComments(newReplyId);
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteComment(eventId, deleteTarget.commentId, accessToken);
      refreshComments();
      setShowDeleteModal(false);
      setDeleteTarget(null);
    } catch (error) {
      console.error('댓글 삭제 실패:', error);
    }
  };

  const openDeleteModal = (commentId: number, isReply: boolean = false) => {
    setDeleteTarget({ commentId, isReply });
    setShowDeleteModal(true);
  };

  return (
    <div className="border-b border-gray500 pb-4">
      <div className="py-[0.88rem]">
        <div className="flex items-center justify-between gap-[0.63rem] text-[0.75rem] font-bold text-white">
          <div className="flex items-center gap-1">
            <span>{comment.authorNickname}</span>
            <span className="text-[0.75rem] font-normal text-gray300">·</span>
            <span className="text-[0.75rem] font-normal text-gray300">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          {comment.isAuthor ? (
            <button
              onClick={() => openDeleteModal(comment.commentId)}
              className="text-[0.75rem] font-normal text-gray300">
              삭제
            </button>
          ) : (
            <Image
              src="/icons/dot-vertical-white.svg"
              alt="메뉴"
              width={9}
              height={20}
              className="cursor-pointer"
              ref={buttonRef}
              onClick={() => setShowDropdown((prev) => !prev)}
            />
          )}
        </div>

        {showDropdown && (
          <BoardDropDown
            isAuthor={comment.isAuthor}
            onClose={() => setShowDropdown(false)}
            position={position}
            postId={comment.commentId}
            type="board"
          />
        )}

        <p className="mt-1 text-[0.75rem] text-[#BFBFBF]">{comment.content}</p>
      </div>

      {/* 대댓글 목록 */}
      {comment.replies?.map((reply) => (
        <div key={reply.commentId} id={`reply-${reply.commentId}`} className="flex scroll-mt-24 items-start gap-4">
          <div>
            <Image src="/icons/arrow-curve-left-right-gray.svg" alt="arrow" width={18} height={18} />
          </div>
          <div className="flex flex-1 flex-col">
            <div className="flex items-center justify-between gap-1 text-[0.75rem]">
              <div className="flex items-center gap-1">
                <span className="font-bold text-main">
                  { reply.authorNickname}
                </span>
                <span className="text-[0.75rem] font-normal text-gray300">·</span>
                <span className="text-[0.75rem] font-normal text-gray300">{formatRelativeTime(reply.createdAt)}</span>
              </div>
              {reply.isAuthor ? (
                <button onClick={() => openDeleteModal(reply.commentId, true)} className="text-[0.75rem] text-gray300">
                  삭제
                </button>
              ) : null}
            </div>
            <p className="pb-[0.88rem] text-[0.75rem] text-[#BFBFBF]">{reply.content}</p>
          </div>
        </div>
      ))}

      {(comment.isAuthor || comment.isStaff) && (
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-lg bg-gray700 px-4 py-3 pr-10 text-[0.75rem] text-gray100 placeholder-gray300 outline-none focus:outline-none"
            placeholder="대댓글을 입력해주세요"
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
          />
          <button
            className="text-pink500 absolute right-3 top-1/2 -translate-y-1/2"
            title="대댓글 작성"
            type="button"
            onClick={handleReply}>
            <Image src="/icons/send-01-pink.svg" alt="send" width={22} height={22} />
          </button>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-6"
            onClick={() => setShowDeleteModal(false)}>
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="rounded-lg bg-BG-black px-5 pb-4 pt-6 text-center"
              onClick={(e) => e.stopPropagation()}>
              <h3 className="mb-4 text-[1rem] font-bold text-white">문의내용을 삭제하시겠습니까?</h3>
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-2 text-[0.75rem] font-bold text-gray200">
                  취소
                </button>
                <button
                  onClick={handleDelete}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-2 text-[0.75rem] font-bold text-main">
                  삭제
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
