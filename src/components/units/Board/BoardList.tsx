'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

interface Post {
  id: number;
  title: string;
  likes: number;
  comments: number;
  createAt: string;
  nickname: string | null;
  images?: string[];
}

interface PostsResponse {
  content: Post[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

interface BoardListProps {
  boardType: 'piece' | 'free';
  venueId: string;
}

const BoardList = ({ boardType, venueId }: BoardListProps) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const accessToken = useRecoilValue(accessTokenState);
  const router = useRouter();

  // 게시글 목록 가져오기
  const fetchPosts = async (pageNum: number, reset: boolean = false) => {
    setLoading(true);
    try {
      const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/post/${boardType}?page=${pageNum}&size=10${venueId ? `&venueId=${venueId}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken && { 'Access': `Bearer ${accessToken}` })
        }
      });

      if (!response.ok) {
        throw new Error(`게시글 목록 불러오기 실패: ${response.status}`);
      }

      const data: PostsResponse = await response.json();
      
      if (reset) {
        setPosts(data.content);
      } else {
        setPosts(prev => [...prev, ...data.content]);
      }

      setHasMore(pageNum < data.totalPages - 1);
      setPage(pageNum + 1);
    } catch (error) {
      console.error('게시글 목록 불러오기 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  // 초기 로딩
  useEffect(() => {
    setPage(0);
    fetchPosts(0, true);
  }, [boardType, venueId]);

  // 게시글 상세 페이지로 이동
  const handlePostClick = (postId: number) => {
    if (boardType === 'piece') {
      router.push(`/board/piece/${postId}`);
    } else {
      router.push(`/board/free/${postId}`);
    }
  };

  // 글쓰기 페이지로 이동
  const handleWriteClick = () => {
    const queryParams = `?type=${boardType}${venueId ? `&venueId=${venueId}` : ''}`;
    router.push(`/board/write${queryParams}`);
  };

  // 뒤로가기
  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-BG-black text-white">
      <div className="py-[0.5rem]">
        {/* 상단 헤더 */}
        <div className="flex items-center">
          <h1 className="text-title-24-bold px-4">
            {boardType === 'piece' ? '조각 게시판' : '자유 게시판'}
          </h1>
        </div>

        {/* 게시글 목록 */}
        {(loading && page === 0) ? (
          <div className="text-center py-8">게시글을 불러오는 중...</div>
        ) : posts.length === 0 ? (
          <div className="text-center py-8 text-gray300">게시글이 없습니다.</div>
        ) : (
          <div className='pb-12'>
            {posts.map((post) => (
              <div
                key={post.id}
                onClick={() => handlePostClick(post.id)}
                className="border-b border-gray600 cursor-pointer hover:bg-gray600 transition-colors "
              >
                <div className="px-4 py-[1.25rem] flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-body2-15-bold text-white mb-1">{post.title}</h3>
                    <div className="flex items-center text-gray300 text-body3-12-medium gap-2">
                      <div className="flex items-center">
                        <img src="/icons/thumb-up.svg" alt="likes" className="w-3 h-3 mr-1" />
                        <span className="text-main">{post.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <img src="/icons/message-square.svg" alt="comments" className="w-3 h-3 mr-1" />
                        <span>{post.comments}</span>
                      </div>
                      <span>|</span>
                      <span>{post.nickname || '익명'}</span>
                      <span>|</span>
                      <span>
                        {(() => {
                          const postDate = new Date(post.createAt);
                          const now = new Date();
                          const diffMs = now.getTime() - postDate.getTime();
                          const diffSec = Math.floor(diffMs / 1000);
                          const diffMin = Math.floor(diffSec / 60);
                          const diffHours = Math.floor(diffMin / 60);
                          const diffDays = Math.floor(diffHours / 24);

                          if (diffSec < 60) {
                            return `${diffSec}초 전`;
                          } else if (diffMin < 60) {
                            return `${diffMin}분 전`;
                          } else if (diffHours < 24) {
                            return `${diffHours}시간 전`;
                          } else {
                            return postDate.toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            });
                          }
                        })()}
                      </span>
                      <span>|</span>
                      <span>{boardType === 'piece' ? '조각 게시판' : '자유 게시판'}</span>
                    </div>
                  </div>
                  {post.images && post.images.length > 0 && (
                    <div className="ml-4 flex-shrink-0">
                      <div className="w-[4.5rem] h-[4.5rem] rounded overflow-hidden">
                        <img 
                          src={post.images[0]} 
                          alt="게시글 이미지" 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 더보기 버튼 */}
        {hasMore && (
          <div className="flex justify-center pb-16">
            <button
              onClick={() => fetchPosts(page, false)}
              disabled={loading}
              className="px-4 py-2 bg-gray500 text-gray100 rounded-md hover:bg-gray600 transition-colors disabled:opacity-50"
            >
              {loading ? '불러오는 중...' : '더보기'}
            </button>
          </div>
        )}
      </div>

      {/* 글쓰기 버튼 */}
      <button 
        onClick={handleWriteClick}
        className="fixed bottom-0 left-0 right-0 w-full py-4 bg-main text-white text-body2-15-bold z-50"
      >
        글쓰기
      </button>
    </div>
  );
};

export default BoardList; 