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
  const [loading, setLoading] = useState(false);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isReady, setIsReady] = useState(false);
  const isInitializedRef = useRef(false);
  const isRequestingRef = useRef(false);
  const prevActiveTabRef = useRef(activeTab);

  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // 스와이프 감지 함수들
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && activeTab === 'my') {
      setActiveTab('scrap');
    } else if (isRightSwipe && activeTab === 'scrap') {
      setActiveTab('my');
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  const lastPostElementRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore && !loading && !isRequestingRef.current) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [hasMore, loading],
  );

  // 통합된 useEffect - 탭 변경과 페이지 변경을 모두 처리
  useEffect(() => {
    const fetchPosts = async () => {
      if (loading || !accessToken || isRequestingRef.current) return;

      // 탭이 변경되었을 때만 초기화
      if (prevActiveTabRef.current !== activeTab) {
        console.log('🔄 탭 변경 감지:', { prev: prevActiveTabRef.current, current: activeTab });
        setIsReady(false);
        setPosts([]);
        setPage(1);
        setHasMore(true);
        setLoading(false);
        isInitializedRef.current = false;
        isRequestingRef.current = false;
        prevActiveTabRef.current = activeTab;

        // 탭 변경 시 즉시 첫 페이지 요청
        console.log('📄 탭 변경으로 인한 첫 페이지 요청');
        isRequestingRef.current = true;
        setLoading(true);

        try {
          const res = activeTab === 'my' ? await getMyPosts(accessToken, 1, 10) : await getMyScraps(accessToken, 1, 10);

          if (res.length < 10) setHasMore(false);
          setPosts(res);
          setIsReady(true);
          isInitializedRef.current = true;
        } catch (error) {
          console.error('게시글 로드 실패:', error);
        } finally {
          setLoading(false);
          isRequestingRef.current = false;
        }
        return; // 탭 변경 시에는 여기서 종료
      }

      // 첫 번째 요청이 이미 진행 중이면 중복 방지
      if (page === 1 && isInitializedRef.current) return;

      isRequestingRef.current = true;
      setLoading(true);

      try {
        const res =
          activeTab === 'my' ? await getMyPosts(accessToken, page, 10) : await getMyScraps(accessToken, page, 10);

        if (res.length < 10) setHasMore(false);
        setPosts((prev) => [...prev, ...res]);
        setIsReady(true);
        isInitializedRef.current = true;
      } catch (error) {
        console.error('게시글 로드 실패:', error);
      } finally {
        setLoading(false);
        isRequestingRef.current = false;
      }
    };

    fetchPosts();
  }, [activeTab, page, accessToken]);

  return (
    <div>
      {/* 탭 바 */}
      <div
        className="relative flex justify-around border-b border-gray700 text-[0.9375rem] text-gray300"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: isSwiping ? 'none' : 'auto' }}>
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
      <div
        className="relative mt-2 min-h-[300px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: isSwiping ? 'none' : 'auto' }}>
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
