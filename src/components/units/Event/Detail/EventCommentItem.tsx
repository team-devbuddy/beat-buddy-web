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
  eventId: number;
}

export default function EventCommentItem({ comment, eventId }: { comment: CommentType; eventId: number }) {
  const [replyContent, setReplyContent] = useState('');
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [replies, setReplies] = useState<CommentType[]>(comment.replies || []);

  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLImageElement>(null);

  // 드롭다운 위치 설정
  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      setPosition({
        top: rect.bottom + scrollY + 4, // 버튼 바로 아래
        left: rect.left + scrollX - 80, // 오른쪽 정렬 (100px 중 80px 이동)
      });
    }
  }, [showDropdown]);

  // 바깥 클릭 시 드롭다운 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!buttonRef.current?.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleReply = async () => {
    if (!replyContent.trim()) return;

    try {
      const res = await postComment(
        eventId,
        {
          content: replyContent,
          anonymous: false,
          parentCommentId: comment.commentId,
        },
        accessToken,
      );

      const newReply = res.data;
      setReplies((prev) => [...prev, newReply]);
      setReplyContent('');
    } catch (error) {
      console.error('대댓글 작성 실패:', error);
    }
  };

  return (
    <div className="border-b border-gray500 pb-4">
      <div className="px-1 py-4">
        {/* 상단 줄: 작성자 + 시간 + 메뉴 */}
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

        {/* 드롭다운 메뉴 */}
        {showDropdown && (
          <BoardDropDown
            isAuthor={comment.isAuthor}
            onClose={() => setShowDropdown(false)}
            position={position}
            postId={comment.commentId}
            type="board"
          />
        )}

        {/* 내용 */}
        <p className="mt-1 text-[0.75rem] text-[#BFBFBF]">{comment.content}</p>
      </div>

      {/* 대댓글 */}
      {replies.map((reply) => (
        <div key={`${reply.commentId}-${reply.commentLevel}`} className="flex items-start gap-4">
          <div>
            <Image src="/icons/arrow-curve-left-right-gray.svg" alt="arrow" width={18} height={18} />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-[0.63rem] text-[0.75rem]">
              <span className="font-bold text-main">{reply.isStaff ? '담당자' : reply.authorNickname}</span>
              <span className="text-gray300">{formatRelativeTime(reply.createdAt)}</span>
            </div>
            <p className="pb-4 text-[0.75rem] text-[#BFBFBF]">{reply.content}</p>
          </div>
        </div>
      ))}

      {/* 대댓글 입력창 */}
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
