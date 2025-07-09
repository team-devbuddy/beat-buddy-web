'use client';

import { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getPostDetail } from '@/lib/actions/detail-controller/board/boardWriteUtils';
import BoardDetail from '@/components/units/Board/Detail/BoardDetail';
import NoResults from '@/components/units/Search/NoResult';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BoardComments from './BoardComments';
import BoardCommentInput from './BoardCommentInput';

interface PostType {
  id: number;
  profileImageUrl: string;
  role: string;
  title: string;
  content: string;
  nickname: string;
  createAt: string;
  likes: number;
  scraps: number;
  comments: number;
  hashtags: string[];
  writerId: number;
  liked: boolean;
  hasCommented: boolean;
  scrapped: boolean;
  isAuthor: boolean;
  views: number;
  imageUrls?: string[];
}

export default function BoardDetailPage({ postId, category }: { postId: number; category: string }) {
  const [post, setPost] = useState<PostType | null>(null);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const router = useRouter();

  useEffect(() => {
    const fetchPost = async () => {
      if (!postId || isNaN(postId)) {
        console.error('Invalid postId:', postId);
        setPost(null);
        return;
      }

      try {
        const fetchedPost = await getPostDetail(category, postId, accessToken);
        setPost(fetchedPost);
      } catch (err) {
        console.error('게시글 로드 실패:', err);
        setPost(null);
      }
    };

    fetchPost();
  }, [postId, category]);

  return (
    <main className="relative min-h-screen bg-BG-black pb-[5.5rem] text-white">
      <div className="flex items-center justify-between py-4 pl-[0.62rem] pr-4">
        <Image
          onClick={() => router.back()}
          src="/icons/line-md_chevron-left.svg"
          alt="뒤로가기"
          width={35}
          height={35}
          className="cursor-pointer"
        />
      </div>

      {post ? <BoardDetail postId={post.id} post={post} /> : <NoResults />}
      {post && <BoardComments postId={post.id} />}

      {/* 입력창 고정 */}
      {post && (
        <div className="fixed bottom-5 left-0 right-0 z-50">
          <BoardCommentInput postId={post.id} onCommentAdded={() => {}} />
        </div>
      )}
    </main>
  );
}
