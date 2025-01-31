'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import PieChart from '../Detail/Board/PieChart';
import Link from 'next/link';
import Image from 'next/image';
interface PostContentProps {
  post: {
    id: string;
    author: string;
    timestamp: string;
    venue?: string;
    status?: string;
    meetingDate?: string;
    participants?: string;
    cost?: string;
    likes: number;
    comments: number;
    boardType: string;
    title?: string;
    description: string;
    currentParticipants?: number;
    totalParticipants?: number;
    isAuthor: boolean;
    venueId?: number;
    englishName?: string;
    koreanName?: string;
  };
  onStatusClick?: () => void;
}

const PostContent = ({ post, onStatusClick }: PostContentProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="p-4">
      {/* 헤더 */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <img src="/icons/profile.svg" alt="Profile" className="h-10 w-10 rounded-full" />
          <div>
            <div className="text-body2-15-medium">{post.author}</div>
            <div className="text-body3-12-medium text-gray300">{post.timestamp}</div>
          </div>
        </div>
        {post.status && (
          <motion.button 
            onClick={onStatusClick}
            className={`relative flex rounded-xs px-2 py-1 items-center text-body3-12-bold cursor-pointer active:scale-95 ${
              post.status === '조각 모집 중' ? 'bg-gray700 text-white' : 'border border-gray300 text-gray300'
            }`}
          >
            {post.status === '조각 모집 중' && (
              <>
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="transparent" />
                      <stop offset="50%" stopColor="white" />
                      <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                  </defs>
                  <motion.rect
                    x="0"
                    y="0"
                    width="100%"
                    height="100%"
                    fill="none"
                    stroke="url(#gradient)"
                    strokeWidth="1"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{ 
                      pathLength: 1,
                      pathOffset: [0, 1]
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    rx="4"
                    ry="4"
                  />
                </svg>
                <div className="mr-2 inline-block relative z-[1]">
                  <PieChart total={post.totalParticipants || 1} filled={post.currentParticipants || 0} />
                </div>
                {post.status}
              </>
            )}
            {post.status !== '조각 모집 중' && post.status}
          </motion.button>
        )}
      </div>

      {/* 클럽명 */}
      {post.boardType === '조각 게시판' && post.venueId && (
        <Link 
          href={`/detail/${post.venueId}`}
          className="mb-3 inline-block text-subtitle-20-bold text-white hover:brightness-75 cursor-pointer"
        >
          <div className="flex items-center">
          {post.englishName} 
            <Image src="/icons/chevron-down-white.svg" alt="arrow-right" width={24} height={24} />
            </div>
        </Link>
      )}

      {/* 조각 게시판 정보 */}
      {post.boardType === '조각 게시판' && (
        <div className="mb-3 space-y-[0.25rem]">
          <div className="text-body3-12-medium text-gray100">
            <span className="mr-3">모집 일자</span>
            {post.meetingDate}
          </div>
          <div className="text-body3-12-medium text-gray100">
            <span className="mr-3">모집 인원</span>
            {post.participants}
          </div>
          <div className="text-body3-12-medium text-gray100">
            <span className="mr-3">1/N 비용</span>
            {post.cost}
          </div>
        </div>
      )}

      {/* 게시글 내용 */}
      {post.boardType === '자유 게시판' ? (
        <>
          <h1 className="mb-4 text-h3-18-bold">{post.title}</h1>
          <p className="whitespace-pre-wrap text-body2-15-medium text-gray100">{post.description}</p>
        </>
      ) : (
        <p className="whitespace-pre-wrap text-body2-15-medium text-gray100">{post.description}</p>
      )}

      {/* 하단 버튼 */}
      <div className="mt-6 flex items-end justify-end">
        <div className="flex space-x-1">
          <button className="flex items-center px-2 py-1 rounded-[1.88rem] bg-gray500 space-x-1 text-main text-body3-12-medium">
            <img src="/icons/thumb-up.svg" alt="Like" className="h-11px w-11px" />
            <span>{post.likes}</span>
          </button>
          <button className="flex items-center px-2 py-1 rounded-[1.88rem] bg-gray500 space-x-1 text-gray300 text-body3-12-medium">
            <img src="/icons/message-square.svg" alt="Comments" className="h-11px w-11px" />
            <span>{post.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PostContent; 