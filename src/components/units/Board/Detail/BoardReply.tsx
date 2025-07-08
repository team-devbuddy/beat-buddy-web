'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { formatRelativeTime } from '../BoardThread';
import { getAllComments } from '@/lib/actions/comment-controller/getAllComments';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { BoardProfileInfoProps } from '../Profile/BoardProfileInfo';
import { getUserProfileInfo } from '@/lib/actions/boardprofile-controller/getUserProfileInfo';



interface ReplyType {
  id: number;
  content: string;
  isAnonymous: boolean;
  replyId: number | null;
  memberName: string;
  likes: number;
  createdAt: string;
  isAuthor: boolean;
  userId: number;
}

interface Props {
  reply: ReplyType;
  isNested?: boolean;
}

export default function BoardReply({ reply, isNested = false }: Props) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [childReplies, setChildReplies] = useState<ReplyType[]>([]);
  const [replyContent, setReplyContent] = useState('');
  const [userProfile, setUserProfile] = useState<BoardProfileInfoProps | null>(null);
  const fetchChildReplies = async () => {
    const res = await getAllComments(reply.replyId ?? reply.id, 0, 100, accessToken);
    const children = res.content.filter((r: ReplyType) => r.replyId === reply.id);
    setChildReplies(children);
  };

  const fetchUserProfile = async () => {
    const res = await getUserProfileInfo(reply.userId.toString(), accessToken);
    setUserProfile(res);
  };

  useEffect(() => {
    fetchChildReplies();
    fetchUserProfile();
  }, [reply.id, accessToken]);

  const handleSubmitReply = () => {
    // ✅ 대댓글 등록 API 구현 필요
    console.log('대댓글 등록:', replyContent);
    setReplyContent('');
    setShowReplyInput(false);
  };

  const formattedTime = formatRelativeTime(reply.createdAt);

  return (
    <div className={`${isNested ? 'ml-10' : ''} p-[1.25rem] flex flex-col `}>
      <div className="bg-gray800 flex flex-col gap-[0.5rem]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-[0.37rem] text-white text-[0.75rem] font-bold">
            <Image src={userProfile?.profileImageUrl || '/icons/Mask group.svg'} alt="profile" width={24} height={24} />
            {reply.isAnonymous ? '익명' : reply.memberName}
            <span className="text-body3-12-medium text-gray200 ">· {formattedTime}</span>
          </div>
          <Image src="/icons/dot-vertical.svg" alt="menu" width={20} height={20} />
        </div>
        <p className="text-[#BFBFBF] text-[0.75rem] whitespace-pre-wrap">{reply.content}</p>
        <div className="flex items-center gap-4 text-[0.75rem] text-gray300">
          <span className='flex items-center gap-[0.19rem]'><Image src="/icons/favorite.svg" alt="heart" width={16} height={16} />{reply.likes}</span>
          <button onClick={() => setShowReplyInput((prev) => !prev)} className='text-gray300'>답글 달기</button>
        </div>
      </div>

      {showReplyInput && (
        <div className="ml-8 mt-1">
          <textarea
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            placeholder="답글을 입력하세요"
            className="w-full p-2 text-sm bg-gray800 rounded resize-none text-white"
            rows={2}
          />
          <button
            onClick={handleSubmitReply}
            className="mt-1 px-3 py-1 text-sm bg-pink text-white rounded"
          >
            등록
          </button>
        </div>
      )}

      {/* ✅ 대댓글 렌더링 */}
      {childReplies.map((child) => (
        <BoardReply key={child.id} reply={child} isNested />
      ))}
    </div>
  );
}
