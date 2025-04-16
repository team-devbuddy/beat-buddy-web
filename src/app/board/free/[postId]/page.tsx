'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getPostDetail } from '@/lib/actions/detail-controller/board/boardWriteUtils';

interface PostDetail {
  id: number;
  title: string;
  content: string;
  likes: number;
  comments: number;
  createAt: string;
  nickname: string | null;
  images?: string[];
  isAnonymous: boolean;
}

export default function FreePostDetailPage() {
  const [post, setPost] = useState<PostDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams();
  const accessToken = useRecoilValue(accessTokenState);
  const postId = params.postId as string;

  useEffect(() => {
    const fetchPostDetail = async () => {
      if (!accessToken) {
        console.log('액세스 토큰이 없습니다.');
        window.location.href = '/login';  // 로그인 페이지로 리다이렉트
        return;
      }

      try {
        const data = await getPostDetail('free', parseInt(postId), accessToken);
        setPost(data);
      } catch (error: any) {
        console.error('게시글 불러오기 오류:', error);
        
        // 401 에러 처리
        if (error.message.includes('401')) {
          window.location.href = '/login';
        }
      } finally {
        setLoading(false);
      }
    };

    if (postId) {
      fetchPostDetail();
    }
  }, [postId, accessToken]);

  if (loading) {
    return <div className="min-h-screen bg-BG-black text-white flex items-center justify-center">
      게시글을 불러오는 중...
    </div>;
  }

  if (!post) {
    return <div className="min-h-screen bg-BG-black text-white flex items-center justify-center">
      게시글을 찾을 수 없습니다.
    </div>;
  }

  return (
    <div className="min-h-screen bg-BG-black text-white p-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-title-24-bold mb-4">{post.title}</h1>
        
        <div className="flex items-center text-gray300 text-body3-12-medium gap-2 mb-6">
          <span>{post.isAnonymous ? '익명' : post.nickname}</span>
          <span>|</span>
          <span>{new Date(post.createAt).toLocaleDateString('ko-KR')}</span>
          <span>|</span>
          <div className="flex items-center">
            <img src="/icons/thumb-up.svg" alt="likes" className="w-3 h-3 mr-1" />
            <span className="text-main">{post.likes}</span>
          </div>
          <div className="flex items-center ml-2">
            <img src="/icons/message-square.svg" alt="comments" className="w-3 h-3 mr-1" />
            <span>{post.comments}</span>
          </div>
        </div>

        {post.images && post.images.length > 0 && (
          <div className="mb-6">
            {post.images.map((image, index) => (
              <img 
                key={index}
                src={image}
                alt={`게시글 이미지 ${index + 1}`}
                className="max-w-full rounded-lg mb-4"
              />
            ))}
          </div>
        )}

        <div className="text-body1-16-medium whitespace-pre-wrap">
          {post.content}
        </div>
      </div>
    </div>
  );
}
