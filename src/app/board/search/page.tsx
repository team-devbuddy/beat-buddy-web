'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { postSearch } from '@/lib/actions/post-interaction-controller/postSearch';
import BoardHashtag from '@/components/units/Board/BoardHashtag';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import { accessTokenState, followMapState } from '@/context/recoil-context';
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
  writerId: number;
}

const PAGE_SIZE = 10;

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

  const accessToken = useRecoilValue(accessTokenState) || '';
  const resetFollowMap = useResetRecoilState(followMapState);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading || !hasMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          console.log('무한스크롤 트리거: 다음 페이지 로드', page + 1);
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore, page],
  );

  const fetchSearchPosts = useCallback(
    async (targetPage: number) => {
      console.log('fetchSearchPosts 호출:', { targetPage, keyword, selectedTags, hasMore });
      setLoading(true);
      try {
        if (selectedTags.length === 0) {
          const newPosts = await postSearch(keyword, accessToken, targetPage, PAGE_SIZE);
          console.log('API 응답:', newPosts.length, '개 게시글');
          if (newPosts.length < PAGE_SIZE) setHasMore(false);
          setPosts((prev) => [...(targetPage === 1 ? [] : prev), ...newPosts]);
        } else {
          const postLists = await Promise.all(
            selectedTags.map((tag) => postSearch(tag, accessToken, targetPage, PAGE_SIZE)),
          );
          const merged = postLists.flat();
          setPosts((prevPosts) => {
            const existing = targetPage === 1 ? [] : prevPosts;
            const combined = [...existing, ...merged];
            const unique = [...new Map(combined.map((post) => [post.id, post])).values()];
            return unique;
          });
          if (merged.length < PAGE_SIZE * selectedTags.length) setHasMore(false);
        }
      } catch (err) {
        console.error('게시글 로드 실패:', err);
      }
      setLoading(false);
    },
    [accessToken, selectedTags, keyword],
  );

  // keyword나 selectedTags 변경 시 초기화 후 첫 페이지 로드
  useEffect(() => {
    if (!isInitialized) return;

    console.log('keyword 또는 태그 변경:', { keyword, selectedTags });

    if (!keyword && selectedTags.length === 0) {
      setPosts([]);
      setHasMore(false);
      return;
    }

    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('selectedTags_path', pathname);

    setPosts([]);
    setPage(1);
    setHasMore(true);

    // 직접 fetchSearchPosts(1) 호출
    const loadFirstPage = async () => {
      setLoading(true);
      try {
        if (selectedTags.length === 0) {
          const newPosts = await postSearch(keyword, accessToken, 1, PAGE_SIZE);
          console.log('첫 페이지 API 응답:', newPosts.length, '개 게시글');
          if (newPosts.length < PAGE_SIZE) setHasMore(false);
          setPosts(newPosts);
        } else {
          const postLists = await Promise.all(selectedTags.map((tag) => postSearch(tag, accessToken, 1, PAGE_SIZE)));
          const merged = postLists.flat();
          const unique = [...new Map(merged.map((post) => [post.id, post])).values()];
          if (merged.length < PAGE_SIZE * selectedTags.length) setHasMore(false);
          setPosts(unique);
        }
      } catch (err) {
        console.error('첫 페이지 로드 실패:', err);
      }
      setLoading(false);
    };

    loadFirstPage();
  }, [keyword, selectedTags, isInitialized, pathname, accessToken]);

  // page 변경 시 해당 페이지 로드 (무한스크롤)
  useEffect(() => {
    if (!isInitialized || page === 1) return;

    console.log('페이지 변경으로 인한 로드:', { page, keyword, selectedTags });

    // 검색어나 태그가 없을 경우 리턴
    if (!keyword && selectedTags.length === 0) {
      return;
    }

    // 직접 API 호출로 무한루프 방지
    const loadPage = async () => {
      setLoading(true);
      try {
        if (selectedTags.length === 0) {
          const newPosts = await postSearch(keyword, accessToken, page, PAGE_SIZE);
          console.log(`${page}페이지 API 응답:`, newPosts.length, '개 게시글');
          if (newPosts.length < PAGE_SIZE) setHasMore(false);
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          const postLists = await Promise.all(selectedTags.map((tag) => postSearch(tag, accessToken, page, PAGE_SIZE)));
          const merged = postLists.flat();
          setPosts((prevPosts) => {
            const combined = [...prevPosts, ...merged];
            const unique = [...new Map(combined.map((post) => [post.id, post])).values()];
            return unique;
          });
          if (merged.length < PAGE_SIZE * selectedTags.length) setHasMore(false);
        }
      } catch (err) {
        console.error(`${page}페이지 로드 실패:`, err);
      }
      setLoading(false);
    };

    loadPage();
  }, [page, isInitialized, keyword, selectedTags, accessToken]);

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

  const handleSearchSubmit = async () => {
    if (!keyword && selectedTags.length === 0) {
      setPosts([]);
      setHasMore(false);
      return;
    }

    setPosts([]);
    setPage(1);
    setHasMore(true);

    // 직접 API 호출
    setLoading(true);
    try {
      if (selectedTags.length === 0) {
        const newPosts = await postSearch(keyword, accessToken, 1, PAGE_SIZE);
        console.log('검색 제출 API 응답:', newPosts.length, '개 게시글');
        if (newPosts.length < PAGE_SIZE) setHasMore(false);
        setPosts(newPosts);
      } else {
        const postLists = await Promise.all(selectedTags.map((tag) => postSearch(tag, accessToken, 1, PAGE_SIZE)));
        const merged = postLists.flat();
        const unique = [...new Map(merged.map((post) => [post.id, post])).values()];
        if (merged.length < PAGE_SIZE * selectedTags.length) setHasMore(false);
        setPosts(unique);
      }
    } catch (err) {
      console.error('검색 실패:', err);
    }
    setLoading(false);
  };

  return (
    <main className="bg-BG-black text-white">
      <BoardSearchHeader placeholder="궁금한 소식을 검색해주세요." onSearchSubmit={handleSearchSubmit} />
      {keyword === '' && <BoardRecentTerm />}

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

      {!loading && posts.length === 0 && keyword !== '' && <NoResults text="조건에 맞는 검색 결과가 없어요." />}
      <div className="fixed inset-x-0 bottom-[80px] z-50 flex justify-center">
        <div className="w-full max-w-[600px] px-4"></div>
      </div>
    </main>
  );
}
