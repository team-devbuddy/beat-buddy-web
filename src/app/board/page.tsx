'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { getAllPosts } from '@/lib/actions/post-controller/getAllPosts';
import { postHashtagSearch } from '@/lib/actions/post-controller/postHashtagSearch';
import BoardThread from '@/components/units/Board/BoardThread';
import BoardHeader from '@/components/units/Board/BoardHeader';
import BoardHashtag from '@/components/units/Board/BoardHashtag';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { motion, AnimatePresence } from 'framer-motion';

interface PostType {
  id: number;
  title: string;
  content: string;
  nickname: string;
  createAt: string;
  likes: number;
  scraps: number;
  comments: number;
  hashtags: string[];
  followingId: number;
}

const PAGE_SIZE = 10;

export default function BoardPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);

  const accessToken = useRecoilValue(accessTokenState) || '';
  const pathname = usePathname();

  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (window.scrollY === 0) {
      touchStartY.current = e.touches[0].clientY;
    }
  };

  const MAX_PULL_DISTANCE = 120; // 원하는 최대 당김 거리

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY.current === null) return;
    const currentY = e.touches[0].clientY;
    const distance = currentY - touchStartY.current;
    if (distance > 0) {
      touchEndY.current = currentY;
      setPullDistance(Math.min(distance, MAX_PULL_DISTANCE)); // 🔥 최대 제한 적용
    }
  };

  const handleTouchEnd = () => {
    if (
      touchStartY.current !== null &&
      touchEndY.current !== null &&
      touchEndY.current - touchStartY.current > 50
    ) {
      setIsRefreshing(true);
      setPosts([]);
      setPage(1);
      setHasMore(true);
      fetchPosts(1).finally(() => {
        setTimeout(() => {
          setIsRefreshing(false);
        }, 500);
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

  const fetchPosts = useCallback(
    async (targetPage: number = page) => {
      setLoading(true);
      try {
        if (selectedTags.length === 0) {
          const newPosts = await getAllPosts(accessToken, targetPage, PAGE_SIZE);
          if (newPosts.length < PAGE_SIZE) setHasMore(false);
          setPosts(prev => [...(targetPage === 1 ? [] : prev), ...newPosts]);
        } else {
          const postLists = await Promise.all(
            selectedTags.map(tag => postHashtagSearch(tag, accessToken, targetPage, PAGE_SIZE))
          );
          const merged = postLists.flat();
          const unique = [
            ...new Map(
              [...(targetPage === 1 ? [] : posts), ...merged].map(post => [post.id, post])
            ).values(),
          ];
          if (merged.length < PAGE_SIZE * selectedTags.length) setHasMore(false);
          setPosts(unique);
        }
      } catch (err) {
        console.error('게시글 로드 실패:', err);
      }
      setLoading(false);
    },
    [accessToken, selectedTags, posts, page]
  );

  useEffect(() => {
    if (!isInitialized || !pathname) return;
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('selectedTags_path', pathname);
    fetchPosts(page);
  }, [selectedTags, pathname, isInitialized, page]);

  useEffect(() => {
    if (!pathname) return;
    const stored = localStorage.getItem('selectedTags');
    const storedPath = localStorage.getItem('selectedTags_path');

    if (stored && storedPath === pathname) {
      try {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setSelectedTags(parsed);
        }
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
    setPosts([]);
    setPage(1);
    setHasMore(true);
  };

  return (
    <main
      className="min-h-screen bg-BG-black text-white"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      <BoardHeader />

      <BoardHashtag
        selectedTags={selectedTags}
        setSelectedTags={setSelectedTags}
        onUpdatePosts={handleUpdatePosts}
      />

      {/* 🔽 여기서 해시태그 아래 여백 */}
      <div
        style={{
          height: `${pullDistance}px`,
          transition: isRefreshing ? 'height 0.3s ease' : 'none',
        }}
      />

      <AnimatePresence>
        {isRefreshing && (
          <motion.div
            key="refresh-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-gray300"
          >
          </motion.div>
        )}
      </AnimatePresence>

      {posts.map((post, i) => {
        if (i === posts.length - 1) {
          return (
            <div ref={lastPostRef} key={post.id}>
              <BoardThread postId={post.id} post={post} />
            </div>
          );
        } else {
          return <BoardThread key={post.id} postId={post.id} post={post} />;
        }
      })}

    </main>
  );
}
