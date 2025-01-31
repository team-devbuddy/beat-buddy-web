'use client';

import { useEffect, useState } from 'react';
import PostContent from '@/components/units/Board/PostContent';
import Reply from '@/components/units/Board/Reply';
import JoinPieceBar from '@/components/units/Board/JoinPieceBar';
import { mockBoardData } from '@/lib/dummyData';
import HeaderBack from '@/components/common/HeaderBack';
import { useAuth } from '@/hooks/useAuth';  // 인증 관련 커스텀 훅

interface PageParams {
  venueId: string;
  postId: string;
}

const BoardDetailPage = ({ params }: { params: PageParams }) => {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinBar, setShowJoinBar] = useState(false);
  
  const { user } = useAuth();  // 현재 로그인한 사용자 정보 가져오기

  useEffect(() => {
    console.log('베뉴 ID:', params.venueId);
    console.log('게시글 ID:', params.postId);
    console.log('전체 게시글:', mockBoardData);
    
    // 해당 베뉴의 게시글 중에서 찾기
    const foundPost = mockBoardData.find(
      post => post.id === params.postId && 
      (post.boardType === '자유 게시판' || post.venueId === Number(params.venueId))
    );
    
    console.log('찾은 게시글:', foundPost);
    setPost(foundPost);
    setLoading(false);
  }, [params.venueId, params.postId]);

  const handleStatusClick = () => {
    setShowJoinBar(prev => !prev);
  };

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="flex min-h-screen flex-col bg-BG-black text-white">
      <HeaderBack url={`/board/${params.venueId}`} />
      <div className="mx-auto flex w-full max-w-[600px] flex-1 flex-col">
        <PostContent 
          post={post} 
          onStatusClick={handleStatusClick}
        />
        <div className="flex flex-1 flex-col">
          <Reply 
            postId={params.postId} 
            showPieceBar={post.boardType === '조각 게시판'}
            onScroll={setShowJoinBar}
            currentUserId={user?.id}  // 토큰에서 가져온 사용자 ID 전달
          />
        </div>
      </div>
      {post.boardType === '조각 게시판' && (
        <JoinPieceBar status={post.status} isVisible={showJoinBar} />
      )}
    </div>
  );
};

export default BoardDetailPage; 