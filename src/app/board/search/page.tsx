'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { postSearch } from '@/lib/actions/post-interaction-controller/postSearch';
import BoardHashtag from '@/components/units/Board/BoardHashtag';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { motion, AnimatePresence } from 'framer-motion';
import BoardSearchHeader from '@/components/units/Board/Search/BoardSearchHeader';
import BoardSearchResult from '@/components/units/Board/Search/BoardSearchResult';
import BoardRecentTerm from '@/components/units/Board/Search/BoardRecentTerm';
import NoResults from '@/components/units/Search/NoResult';
import Link from 'next/link';

interface PostType {
  id: number;
  title?: string;
  content: string;
  nickname: string;
  createAt: string;
  likes: number;
  scraps: number;
  comments: number;
  hashtags: string[];
  followingId: number;
  liked: boolean;
  hasCommented: boolean;
  scrapped: boolean;
  isAuthor: boolean;
}

const PAGE_SIZE = 10;

// postSearch가 PostType[]을 직접 반환한다고 가정합니다.
// 실제 API 응답이 { data: { ... } } 형태라면 반환값을 적절히 처리해주세요.
export default function BoardSearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') ?? '';
  const pathname = usePathname();
  const router = useRouter();

  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const accessToken = useRecoilValue(accessTokenState) || '';

  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const MAX_PULL_DISTANCE = 120;

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;
    if (distance > 0) {
      touchEndY.current = currentY;
      setPullDistance(Math.min(distance, MAX_PULL_DISTANCE));
    }
  };

  const handleTouchEnd = () => {
    if (touchStartY.current !== null && touchEndY.current !== null && touchEndY.current - touchStartY.current > 50) {
      setIsRefreshing(true);
      setPosts([]);
      setPage(1);
      setHasMore(true);
      fetchSearchPosts(1).finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
    }
    setPullDistance(0);
    touchStartY.current = null;
    touchEndY.current = null;
  };

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore],
  );

  const fetchSearchPosts = useCallback(
    async (targetPage: number) => {
      if (loading) return; // 중복 요청 방지
      setLoading(true);

      try {
        if (selectedTags.length === 0) {
          const newPosts = await postSearch(keyword, accessToken, targetPage, PAGE_SIZE);
          if (newPosts.length < PAGE_SIZE) setHasMore(false);
          setPosts((prevPosts) => (targetPage === 1 ? newPosts : [...prevPosts, ...newPosts]));
        } else {
          const postLists = await Promise.all(
            selectedTags.map((tag) => postSearch(tag, accessToken, targetPage, PAGE_SIZE)),
          );
          const merged = postLists.flat();
          if (merged.length < PAGE_SIZE * selectedTags.length) setHasMore(false);

          setPosts((prevPosts) => {
            const combined = targetPage === 1 ? merged : [...prevPosts, ...merged];
            const unique = [...new Map(combined.map((post) => [post.id, post])).values()];
            return unique;
          });
        }
      } catch (err) {
        console.error('게시글 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    },
    // 🔥 최종 수정된 의존성 배열: loading을 제거하여 무한 루프를 방지합니다.
    [keyword, accessToken, selectedTags],
  );

  // 검색어나 태그 변경 시, 상태를 초기화하고 첫 페이지 로드
  useEffect(() => {
    if (!isInitialized || !pathname) return;
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('selectedTags_path', pathname);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchSearchPosts(1);
  }, [keyword, selectedTags, pathname, isInitialized, fetchSearchPosts]);

  // 페이지 번호 변경 시 (무한 스크롤), 다음 페이지 로드
  useEffect(() => {
    if (!isInitialized || page === 1) return;
    fetchSearchPosts(page);
  }, [page, isInitialized, fetchSearchPosts]);

  // 마운트 시 로컬 스토리지에서 태그 로드
  useEffect(() => {
    if (!pathname) return;
    const stored = localStorage.getItem('selectedTags');
    const storedPath = localStorage.getItem('selectedTags_path');

    if (stored && storedPath === pathname) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) setSelectedTags(parsed);
      } catch (e) {
        console.error('로컬스토리지 파싱 실패:', e);
        setSelectedTags([]);
      }
    } else {
      localStorage.removeItem('selectedTags');
      localStorage.setItem('selectedTags_path', pathname);
      setSelectedTags([]);
    }
    setIsInitialized(true);
  }, [pathname]);

  const handleUpdatePosts = (tags: string[]) => {
    setSelectedTags(tags);
  };

  const handleSearchSubmit = () => {
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchSearchPosts(1);
  };

  return (
    <main
      className="bg-BG-black text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}>
      <BoardSearchHeader placeholder="궁금한 소식을 검색해주세요." onSearchSubmit={handleSearchSubmit} />
      {keyword === '' && <BoardRecentTerm />}

      <div style={{ height: `${pullDistance}px`, transition: isRefreshing ? 'height 0.3s ease' : 'none' }} />
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            key="refresh-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-gray300"></motion.div>
        )}
      </AnimatePresence>

      {posts.map((post, i) => {
        if (i === posts.length - 1) {
          return (
            <div ref={lastPostRef} key={post.id}>
              <BoardSearchResult postId={post.id} post={post} />
            </div>
          );
        } else {
          return <BoardSearchResult key={post.id} postId={post.id} post={post} />;
        }
      })}

      {!loading && posts.length === 0 && keyword !== '' && <NoResults />}
      <div className="fixed inset-x-0 bottom-[80px] z-50 flex justify-center">
        <div className="w-full max-w-[600px] px-4">
          <Link
            href="/board/write"
            className="ml-auto flex h-14 w-14 items-center justify-center rounded-full border border-main2 bg-sub2 text-white shadow-lg transition-transform duration-150 ease-in-out active:scale-90">
            <img src="/icons/ic_baseline-plus.svg" alt="글쓰기" className="h-7 w-7" />
          </Link>
        </div>
      </div>
    </main>
  );
}
