'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import Link from 'next/link';

interface Post {
  id: number;
  title: string;
  content: string;
  createdAt: string;
  memberName: string;
  likes: number;
  views: number;
  commentCount: number;
  isAnonymous: boolean;
  type: string;
}

interface PostsResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

const BoardHome = ({ venueId }: { venueId: string }) => {
  const [activeBoard, setActiveBoard] = useState<'piece' | 'free'>('piece');

  const accessToken = useRecoilValue(accessTokenState);
  const router = useRouter();

  // 게시글 목록 가져오기
 
  return (
    <div className="min-h-screen bg-BG-black text-white">
      <div className="px-4 py-[0.5rem]">
        <h1 className="text-title-24-bold  mb-[1.75rem]">게시판</h1>
        
       
          {/* 자유 게시판 카드 */}
          <Link href={`/board/${venueId}/free`}>
            <div className="bg-main mb-[0.62rem] text-white p-4 rounded-xs cursor-pointer">
              <h2 className="text-body2-15-bold mb-[0.37rem]">자유게시판</h2>
              <p className="text-body3-12-medium">
                버디들과 나누고 싶은 이야기가 있나요?<br />
                자유게시판에 모두 적어보세요!
              </p>
            </div>
          </Link>
          
          {/* 조각 게시판 카드 */}
          <Link href={`/board/${venueId}/piece`}>
            <div className="bg-gray700 text-gray100 hover:bg-gray600 p-4 rounded-xs cursor-pointer">
              <h2 className="text-body2-15-bold mb-[0.37rem]">조각게시판</h2>
              <p className="text-body3-12-medium">
                버디들과 나누고 싶은 이야기가 있나요?<br />
                조각게시판에 모두 적어보세요!
              </p>
            </div>
          </Link>
        </div>
      </div>
  );
};

export default BoardHome; 