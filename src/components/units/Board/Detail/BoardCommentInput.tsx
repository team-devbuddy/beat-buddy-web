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
    <div className="px-[1.25rem] space-y-2">
       <div className="bg-gray500 py-[0.5rem] px-[0.75rem] rounded-[0.75rem] flex items-center justify-between">
      <label className={`flex items-center text-[0.75rem] gap-[0.12rem] ${isAnonymous ? "text-gray300" : "text-main"}`}  >
        <Image
          src={isAnonymous ? "/icons/check_box_outline_blank.svg" : "/icons/check_box.svg"}
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
        className="flex-1 mx-3 bg-transparent border-none text-gray300 placeholder:text-gray300 text-[0.875rem] focus:outline-none"
      />

      <button
        onClick={handleSubmit}
        disabled={!content.trim()}
        className="bg-gray700 text-main text-[0.75rem] font-bold px-3 py-[0.38rem] rounded-[0.5rem] disabled:text-gray300"
      >
        등록
      </button>
    </div>
    </div>
  );
}
