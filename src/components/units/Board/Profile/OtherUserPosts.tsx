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
  thumbImage?: string[];
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
  const isInitializedRef = useRef(false);
  const isRequestingRef = useRef(false);

  console.log('👤 OtherUserPosts - userId:', userId);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      console.log('🔍 lastPostElementRef 호출됨:', { node, hasMore, loading });

      if (observerRef.current) observerRef.current.disconnect();

      if (node && hasMore && !loading && !isRequestingRef.current) {
        observerRef.current = new IntersectionObserver((entries) => {
          console.log('👁️ Intersection Observer 트리거:', entries[0].isIntersecting);
          if (entries[0].isIntersecting && hasMore && !loading && !isRequestingRef.current) {
            console.log('📄 페이지 증가:', page + 1);
            setPage((prev) => prev + 1);
          }
        });
        observerRef.current.observe(node);
        console.log('✅ Observer 설정 완료');
      }
    },
    [hasMore, loading, page],
  );

  useEffect(() => {
    const fetchPosts = async () => {
      if (!userId || loading || isRequestingRef.current) {
        console.log('🚫 fetchPosts 차단됨:', { userId, loading, isRequesting: isRequestingRef.current });
        return;
      }

      // 첫 번째 요청이 이미 진행 중이면 중복 방지
      if (page === 1 && isInitializedRef.current) return;

      console.log(`🔍 사용자 ${userId}의 게시글 로드 - 페이지 ${page}`);
      isRequestingRef.current = true;
      setLoading(true);

      try {
        const res = await getUserPosts(userId, accessToken, page, 10);
        console.log(`📦 API 응답:`, { page, resultLength: res.length, hasMore: res.length === 10 });

        if (res.length < 10) {
          setHasMore(false);
          console.log('🏁 더 이상 데이터 없음');
        }

        if (page === 1) {
          setPosts(res);
          console.log('🔄 첫 페이지 데이터 설정');
        } else {
          setPosts((prev) => [...prev, ...res]);
          console.log('➕ 추가 페이지 데이터 병합');
        }

        isInitializedRef.current = true;
      } catch (error) {
        console.error('다른 유저 게시글 로드 실패:', error);
      } finally {
        setLoading(false);
        isRequestingRef.current = false;
        console.log('✅ 로딩 완료');
      }
    };

    fetchPosts();
  }, [userId, accessToken, page]);

  if (posts.length === 0 && !loading) {
    return <NoResults text="아직 게시글이 없어요." />;
  }

  return (
    <div className="bg-BG-black">
      {posts.map((post, index) => {
        const isLastElement = index === posts.length - 1;

        console.log(`📝 게시글 렌더링:`, { index, isLastElement, totalPosts: posts.length });

        // API 응답 데이터를 PostContentOnly 형태로 변환
        const transformedPost = {
          ...post,
          imageUrls: post.thumbImage || [], // thumbImage를 imageUrls로 변환
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
