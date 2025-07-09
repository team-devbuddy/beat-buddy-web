'use client';

import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { createComment } from '@/lib/actions/comment-controller/postComment';
import Image from 'next/image';
interface Props {
  postId: number;
  onCommentAdded: () => void; // 작성 후 새로고침용
}

export default function BoardCommentInput({ postId, onCommentAdded }: Props) {
  const [content, setContent] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const accessToken = useRecoilValue(accessTokenState) || '';

  const handleSubmit = async () => {
    try {
      await createComment(postId, content, isAnonymous, accessToken);
      setContent('');
      onCommentAdded(); // 성공 후 콜백
    } catch (err) {
      alert('댓글 작성 실패');
      console.error(err);
    }
  };

  return (
    <div className="space-y-2 px-[1.25rem]">
      <div className="flex items-center justify-between rounded-[0.75rem] bg-gray500 px-[0.75rem] py-[0.5rem]">
        <label
          className={`flex items-center gap-[0.12rem] text-[0.75rem] ${isAnonymous ? 'text-gray300' : 'text-main'}`}>
          <Image
            src={isAnonymous ? '/icons/check_box_outline_blank.svg' : '/icons/check_box.svg'}
            alt="check"
            width={18}
            height={18}
            onClick={() => setIsAnonymous(!isAnonymous)}
          />
          익명
        </label>

        <input
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="댓글을 입력해주세요."
          className="mx-3 flex-1 border-none bg-transparent text-[0.875rem] text-gray300 placeholder:text-gray300 focus:outline-none"
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
