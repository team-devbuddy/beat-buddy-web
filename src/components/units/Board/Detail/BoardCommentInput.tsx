'use client';

import { useState, useRef, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { createComment } from '@/lib/actions/comment-controller/postComment';
import Image from 'next/image';
import { replyingToState } from '@/context/recoil-context';
import { createReply } from '@/lib/actions/comment-controller/postReply';
import { commentInputFocusState, scrollToCommentState } from '@/context/recoil-context';

interface CommentType {
  id: number;
  content: string;
  isAnonymous: boolean;
  replyId: number | null;
  memberName: string;
  likes: number;
  createdAt: string;
  isAuthor: boolean;
  userId: string;
  writerId: number; // writerId 필드 추가
  isDeleted?: boolean; // 삭제된 댓글인지 여부
}

interface Props {
  postId: number;
  onCommentAdded: (newComment: CommentType) => void; // ✅ 작성 후 새로고침 말고 바로 추가
}

export default function BoardCommentInput({ postId, onCommentAdded }: Props) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [replyingTo, setReplyingTo] = useRecoilState(replyingToState);
  const [commentInputFocus, setCommentInputFocus] = useRecoilState(commentInputFocusState);
  const inputRef = useRef<HTMLInputElement>(null);
  const focusTrigger = useRecoilValue(commentInputFocusState);
  const setScrollTo = useSetRecoilState(scrollToCommentState); // ✅ 스크롤 명령을 내릴 setter
  useEffect(() => {
    if (focusTrigger > 0) {
      // 초기값 0일 때는 실행 안 함
      inputRef.current?.focus();
    }
  }, [focusTrigger]);

  // 익명 상태 변경 시 포커스 유지
  useEffect(() => {
    if (inputRef.current && isAnonymous !== undefined) {
      // 익명 상태가 변경되었을 때만 포커스 유지
      const timer = setTimeout(() => {
        if (inputRef.current && document.activeElement !== inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [isAnonymous]);

  const handleSubmit = async () => {
    if (!content.trim() || !accessToken) return;
    try {
      let newComment;
      if (replyingTo) {
        const replyResponse = await createReply(postId, replyingTo.parentId, content, isAnonymous, accessToken);
        // API 응답을 CommentType으로 변환
        newComment = {
          id: replyResponse.id,
          content: replyResponse.content,
          isAnonymous: replyResponse.isAnonymous,
          replyId: replyResponse.replyId,
          memberName: replyResponse.memberName,
          likes: replyResponse.likes,
          createdAt: replyResponse.createdAt,
          isAuthor: replyResponse.isAuthor,
          writerId: replyResponse.writerId, // writerId 필드 사용
          userId: replyResponse.member?.memberId?.toString() || '',
          isDeleted: false,
        };
        // ✅ 답글 작성 성공 시, 부모 댓글 ID로 스크롤 명령
        setScrollTo(replyingTo.parentId);
      } else {
        const commentResponse = await createComment(postId, content, isAnonymous, accessToken);
        // API 응답을 CommentType으로 변환
        newComment = {
          id: commentResponse.id,
          content: commentResponse.content,
          isAnonymous: commentResponse.isAnonymous,
          replyId: commentResponse.replyId,
          memberName: commentResponse.memberName,
          likes: commentResponse.likes,
          createdAt: commentResponse.createdAt,
          isAuthor: commentResponse.isAuthor,
          writerId: commentResponse.writerId, // writerId 필드 사용
          userId: commentResponse.member?.memberId?.toString() || '',
          isDeleted: false,
        };
        // ✅ 새 댓글 작성 성공 시, 맨 아래로 스크롤 명령
        setScrollTo('bottom');
      }

      console.log('새 댓글 데이터:', newComment);

      setContent('');
      onCommentAdded(newComment);
      setReplyingTo(null);
    } catch (err) {
      alert('댓글/답글 작성에 실패했습니다.');
      console.error(err);
    }
  };
  return (
    <div className="space-y-2 whitespace-nowrap px-[0.63rem]">
      <div className="flex items-center justify-between rounded-[0.75rem] bg-gray500 px-[0.75rem] py-[0.5rem]">
        <label
          className={`flex items-center gap-[0.12rem] text-[0.75rem] ${isAnonymous ? 'text-main' : 'text-gray300'}`}>
          <Image
            src={isAnonymous ? '/icons/check_box.svg' : '/icons/check_box_outline_blank.svg'}
            alt="check"
            width={18}
            height={18}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsAnonymous(!isAnonymous);
            }}
            onTouchEnd={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsAnonymous(!isAnonymous);
            }}
          />
          익명
        </label>

        <input
          ref={inputRef}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력해주세요."
          className="flex-1 border-none bg-transparent pl-5 text-[0.875rem] text-white placeholder:text-gray300 focus:outline-none"
        />

        <button
          onClick={handleSubmit}
          disabled={!content.trim()}
          className="rounded-[0.5rem] bg-gray700 px-3 py-[0.38rem] text-[0.75rem] font-bold text-main disabled:text-gray300">
          등록
        </button>
      </div>
    </div>
  );
}
