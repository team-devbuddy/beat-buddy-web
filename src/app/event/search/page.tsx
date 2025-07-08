'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { eventSearch } from '@/lib/actions/event-controller/eventSearch';
import BoardHashtag from '@/components/units/Board/BoardHashtag';
import { accessTokenState } from '@/context/recoil-context';
import { motion, AnimatePresence } from 'framer-motion';
import BoardSearchHeader from '@/components/units/Board/Search/BoardSearchHeader';
import EventSearchResult from '@/components/units/Event/EventSearchResult';
import BoardRecentTerm from '@/components/units/Board/Search/BoardRecentTerm';
import NoResults from '@/components/units/Search/NoResult';
import Link from 'next/link';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userProfileState } from '@/context/recoil-context';

interface PostType {
  eventId: number;
  title: string;
  content: string;
  images: string[];
  liked: boolean;
  likes: number;
  views: number;
  startDate: string;
  endDate: string;
  receiveInfo: boolean;
  receiveName: boolean;
  receiveGender: boolean;
  receivePhoneNumber: boolean;
  receiveSNSId: boolean;
  receiveMoney: boolean;
  depositAccount: string;
  depositAmount: number;
  isAuthor: boolean;
}

const PAGE_SIZE = 10;

export default function EventSearchPage() {
  const searchParams = useSearchParams();
  const keyword = searchParams.get('q') ?? '';
  const pathname = usePathname();
  const router = useRouter();
  const userProfile = useRecoilValue(userProfileState);
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
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const fetchSearchPosts = useCallback(
    async (targetPage: number) => {
      if (loading) return;
      setLoading(true);

      try {
        if (selectedTags.length === 0) {
          const newPosts = await eventSearch(keyword, accessToken, targetPage, PAGE_SIZE); // ✅ 수정
          if (newPosts.length < PAGE_SIZE) setHasMore(false);
          setPosts(prevPosts => (targetPage === 1 ? newPosts : [...prevPosts, ...newPosts]));
        } else {
          const postLists = await Promise.all(
            selectedTags.map(tag => eventSearch(tag, accessToken, targetPage, PAGE_SIZE)) // ✅ 수정
          );
          const merged = postLists.flat();
          if (merged.length < PAGE_SIZE * selectedTags.length) setHasMore(false);
          
          setPosts(prevPosts => {
            const combined = targetPage === 1 ? merged : [...prevPosts, ...merged];
            const unique = [...new Map(combined.map(post => [post.eventId, post])).values()];
            return unique;
          });
        }
      } catch (err) {
        console.error('이벤트 게시글 로드 실패:', err);
      } finally {
        setLoading(false);
      }
    },
    [keyword, accessToken, selectedTags]
  );

  useEffect(() => {
    if (!isInitialized || !pathname) return;
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('selectedTags_path', pathname);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchSearchPosts(1);
  }, [keyword, selectedTags, pathname, isInitialized, fetchSearchPosts]);

  useEffect(() => {
    if (!isInitialized || page === 1) return;
    fetchSearchPosts(page);
  }, [page, isInitialized, fetchSearchPosts]);

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
      onTouchEnd={handleTouchEnd}
    >
      <BoardSearchHeader placeholder="이벤트를 입력해주세요." onSearchSubmit={handleSearchSubmit} isEvent={true} />
      {keyword === '' && <BoardRecentTerm isEvent={true} />}

      <div style={{ height: `${pullDistance}px`, transition: isRefreshing ? 'height 0.3s ease' : 'none' }} />
      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            key="refresh-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-gray300"
          />
        )}
      </AnimatePresence>

      {posts.map((post, i) => {
        if (i === posts.length - 1) {
          return (
            <div ref={lastPostRef} key={post.eventId}>
              <EventSearchResult eventId={post.eventId} event={post} />
            </div>
          );
        } else {
          return <EventSearchResult key={post.eventId} eventId={post.eventId} event={post} />;
        }
      })}

      {!loading && posts.length === 0 && keyword !== '' && <NoResults />}

      {userProfile?.role === 'BUSINESS' && (
      <div className="fixed inset-x-0 bottom-[80px] z-50 flex justify-center">
        <div className="w-full max-w-[600px] px-4">
          <Link
            href="/board/write"
            className="ml-auto flex h-14 w-14 items-center justify-center border border-main2 rounded-full bg-sub2 text-white shadow-lg transition-transform duration-150 ease-in-out active:scale-90"
          >
            <img src="/icons/ic_baseline-plus.svg" alt="글쓰기" className="h-7 w-7" />
          </Link>
          </div>
        </div>
      )}
    </main>
  );
}
