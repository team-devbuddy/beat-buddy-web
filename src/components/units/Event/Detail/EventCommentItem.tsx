'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { formatRelativeTime } from '../../Board/BoardThread';
import { postComment } from '@/lib/actions/event-controller/postComment';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import BoardDropDown from '../../Board/BoardDropDown';

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
  refreshComments: (scrollToReplyId?: number) => void; // ✅ scroll target 전달 가능하도록 수정
}) {
  const [replyContent, setReplyContent] = useState('');
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
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

      // ✅ 대댓글 등록 후 해당 아이디로 스크롤 이동 요청
      refreshComments(newReplyId);
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
    }
  };

  return (
    <div className="border-b border-gray500 pb-4">
      <div className="px-1 py-4">
        <div className="flex items-center justify-between gap-[0.63rem] text-[0.75rem] font-bold text-white">
          <div className="flex items-center gap-[0.63rem]">
            <span>{comment.isStaff ? '담당자' : comment.authorNickname}</span>
            <span className="text-[0.75rem] font-normal text-gray300">{formatRelativeTime(comment.createdAt)}</span>
          </div>
          <Image
            src="/icons/dot-vertical-white.svg"
            alt="메뉴"
            width={9}
            height={20}
            className="cursor-pointer"
            ref={buttonRef}
            onClick={() => setShowDropdown((prev) => !prev)}
          />
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
        <div
          key={reply.commentId}
          id={`reply-${reply.commentId}`} // ✅ scroll target
          className="flex scroll-mt-24 items-start gap-4">
          <div>
            <Image src="/icons/arrow-curve-left-right-gray.svg" alt="arrow" width={18} height={18} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-[0.63rem] text-[0.75rem]">
              <span className="font-bold text-main">
                {reply.isStaff || reply.isAuthor ? '담당자' : reply.authorNickname}
              </span>
              <span className="text-gray300">{formatRelativeTime(reply.createdAt)}</span>
            </div>
            <p className="pb-4 text-[0.75rem] text-[#BFBFBF]">{reply.content}</p>
          </div>
        </div>
      ))}

      {(comment.isAuthor || comment.isStaff) && (
        <div className="relative">
          <input
            type="text"
            className="w-full rounded-md bg-gray700 px-4 py-3 pr-10 text-[0.75rem] text-gray100 placeholder-gray300 outline-none"
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
    </div>
  );
}
