'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getUserPosts } from '@/lib/actions/boardprofile-controller/getUserPosts';
import PostContentOnly from './PostContentOnly';
import NoResults from '@/components/units/Search/NoResult';

interface PostType {
  id: number;
  title?: string;
  content: string;
  createAt: string;
  likes: number;
  scraps: number;
  comments: number;
  hashtags: string[];
  imageUrls?: string[];
  liked: boolean;
  hasCommented: boolean;
  scrapped: boolean;
  isAuthor: boolean;
  // API 응답에 포함된 작성자 정보
  nickname: string;
  role: string;
  profileImageUrl: string;
  writerId: number;
  isFollowing: boolean;
  isAnonymous: boolean;
  thumbImage: string;
}

interface OtherUserPostsProps {
  userId: string;
}

export default function OtherUserPosts({ userId }: OtherUserPostsProps) {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const observerRef = useRef<IntersectionObserver | null>(null);

  console.log('👤 OtherUserPosts - userId:', userId);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, hasMore],
  );

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId) {
        return;
      }

      console.log(`🔍 사용자 ${userId}의 게시글 로드 - 페이지 ${page}`);
      setLoading(true);
      try {
        const res = await getUserPosts(userId, accessToken, page, 10);

        if (res.length < 10) setHasMore(false);
        setPosts((prev) => [...prev, ...res]);
      } catch (error) {
        console.error('다른 유저 게시글 로드 실패:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userId, accessToken, page]);

  if (posts.length === 0 && !loading) {
    return <NoResults />;
  }

  return (
    <div className="bg-BG-black">
      {posts.map((post, index) => {
        const isLastElement = index === posts.length - 1;

        // API 응답 데이터를 PostContentOnly 형태로 변환
        const transformedPost = {
          ...post,
          imageUrls: post.thumbImage ? [post.thumbImage] : [], // thumbImage를 배열로 변환
        };

        return (
          <div key={post.id} ref={isLastElement ? lastPostElementRef : null}>
            <PostContentOnly postId={post.id} post={transformedPost} />
          </div>
        );
      })}
    </div>
  );
}
