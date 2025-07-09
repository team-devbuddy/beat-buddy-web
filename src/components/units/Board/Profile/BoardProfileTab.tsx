'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import classNames from 'classnames';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import MyPosts from './BoardProfilePosts';
import ScrapPosts from './BoardProfileScrapPosts';
import { getMyPosts } from '@/lib/actions/boardprofile-controller/getMyPosts';
import { getMyScraps } from '@/lib/actions/boardprofile-controller/getMyScraps';

export default function BoardProfileTab({ isAuthor }: { isAuthor: boolean }) {
  const [activeTab, setActiveTab] = useState<'my' | 'scrap'>('my');
  const [posts, setPosts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isReady, setIsReady] = useState(false);

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore],
  );

  // 탭이 바뀌면 초기화 후 요청 준비
  useEffect(() => {
    setIsReady(false);
    setPosts([]);
    setPage(1);
    setHasMore(true);
  }, [activeTab]);

  // 실제 fetch는 페이지 변경이나 탭 변경 직후 실행
  useEffect(() => {
    const fetchPosts = async () => {
      const res =
        activeTab === 'my' ? await getMyPosts(accessToken, page, 10) : await getMyScraps(accessToken, page, 10);

      if (res.length < 10) setHasMore(false);
      setPosts((prev) => [...prev, ...res]);
      setIsReady(true);
    };

    fetchPosts();
  }, [activeTab, page]);

  return (
    <div>
      {/* 탭 바 */}
      <div className="relative flex justify-around border-b border-gray700 text-[0.9375rem] text-gray300">
        <button
          onClick={() => setActiveTab('my')}
          className={classNames('z-10 w-1/2 py-[0.75rem]', activeTab === 'my' ? 'font-bold text-main' : '')}>
          내가 쓴 글
        </button>
        <button
          onClick={() => setActiveTab('scrap')}
          className={classNames('z-10 w-1/2 py-[0.75rem]', activeTab === 'scrap' ? 'font-bold text-main' : '')}>
          스크랩
        </button>

        {/* 밑줄 애니메이션 */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-0 h-[2px] w-1/2 bg-main"
          style={{
            left: activeTab === 'my' ? '0%' : '50%',
          }}
        />
      </div>

      {/* 게시글 렌더링 애니메이션 */}
      <div className="relative mt-2 min-h-[300px]">
        <AnimatePresence mode="wait">
          {isReady && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="absolute left-0 top-0 w-full">
              {activeTab === 'my' ? (
                <MyPosts posts={posts} lastPostRef={lastPostElementRef} />
              ) : (
                <ScrapPosts posts={posts} lastPostRef={lastPostElementRef} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
