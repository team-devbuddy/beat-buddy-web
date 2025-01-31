'use client';

import { useEffect, useState } from 'react';
import PostContent from '@/components/units/Board/PostContent';
import Reply from '@/components/units/Board/Reply';
import { mockBoardData } from '@/lib/dummyData';

const BoardDetailPage = ({ params }: { params: { id: string } }) => {
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showJoinBar, setShowJoinBar] = useState(false);

  useEffect(() => {
    // 임시로 mockData에서 게시글 찾기
    console.log('현재 게시글 ID:', params.id);
    console.log('전체 게시글:', mockBoardData);
    
    const foundPost = mockBoardData.find(post => post.id === params.id);
    console.log('찾은 게시글:', foundPost);
    
    setPost(foundPost);
    setLoading(false);
  }, [params.id]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>게시글을 찾을 수 없습니다.</div>;

  return (
    <div className="min-h-screen bg-BG-black text-white">
      <PostContent post={post} />
      <Reply 
        postId={params.id} 
        onScroll={setShowJoinBar}
      />
    </div>
  );
};

export default BoardDetailPage;
