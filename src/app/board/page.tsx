'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { getAllPosts } from '@/lib/actions/post-controller/getAllPosts';
import { postHashtagSearch } from '@/lib/actions/post-controller/postHashtagSearch';
import BoardThread from '@/components/units/Board/BoardThread';
import BoardHeader from '@/components/units/Board/BoardHeader';
import BoardHashtag from '@/components/units/Board/BoardHashtag';
import { useRecoilValue } from 'recoil';
import { accessTokenState, userProfileState } from '@/context/recoil-context';
import { motion, AnimatePresence } from 'framer-motion';
import NoResults from '@/components/units/Search/NoResult';
import Link from 'next/link';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';
import { createPortal } from 'react-dom';
import ProfileModal from '@/components/units/Common/ProfileModal';

interface PostType {
  profileImageUrl: string;
  role: string;
  id: number;
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
  isFollowing: boolean;
  isAnonymous: boolean;
  thumbImage: string[];
}

const PAGE_SIZE = 10;

export default function BoardPage() {
  const [posts, setPosts] = useState<PostType[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isScrapped, setIsScrapped] = useState(false);
  const [showButton, setShowButton] = useState(true);
  const lastScrollYRef = useRef(0);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const accessToken = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const pathname = usePathname();
  const router = useRouter();

  // 게시판 프로필 존재 여부 확인
  const checkBoardProfile = async () => {
    try {
      const profileInfo = await getProfileinfo(accessToken);
      // 프로필 정보가 있고 닉네임이 있으면 게시판 프로필이 존재하는 것으로 간주
      return profileInfo.isPostProfileCreated;
    } catch (error) {
      console.error('게시판 프로필 확인 실패:', error);
      return false;
    }
  };
  // 상호작용 전 프로필 체크
  const handleInteractionWithProfileCheck = async (action: () => void) => {
    const hasProfile = await checkBoardProfile();
    if (!hasProfile) {
      setShowProfileModal(true);
      return;
    }
    action();
  };

  // 직접 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.overflow-y-auto');
      let scrollTop = 0;

      if (scrollContainer) {
        scrollTop = scrollContainer.scrollTop;
      } else {
        scrollTop = window.scrollY || window.pageYOffset || 0;
      }

      const currentScrollY = scrollTop;
      const previousScrollY = lastScrollYRef.current;

      console.log(
        '🔍 Board Button direct scroll - currentScrollY:',
        currentScrollY,
        'previousScrollY:',
        previousScrollY,
      );

      // 스크롤 방향 감지
      const isScrollingDown = currentScrollY > previousScrollY;
      const isScrollingUp = currentScrollY < previousScrollY;

      // 아래로 스크롤하면 숨김
      if (isScrollingDown) {
        console.log('🔍 Board Button: Hiding button (direct)');
        setShowButton(false);
      }
      // 위로 스크롤하면 보임
      else if (isScrollingUp) {
        console.log('🔍 Board Button: Showing button (direct)');
        setShowButton(true);
      }

      lastScrollYRef.current = currentScrollY;
    };

    // 스크롤 컨테이너를 찾아서 이벤트 리스너 추가
    const scrollContainer = document.querySelector('.overflow-y-auto');
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      console.log('🔍 Board Button: Added direct scroll listener');
    }

    // window 스크롤도 추가
    window.addEventListener('scroll', handleScroll, { passive: true });

    // 초기 스크롤 위치 설정
    setTimeout(handleScroll, 100);

    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // showButton 상태 변경 확인
  useEffect(() => {
    console.log('🔍 Board Button state changed - showButton:', showButton);
  }, [showButton]);

  // 스크롤에 따른 투명도 계산
  const getOpacity = () => {
    const maxOpacity = 1;
    const minOpacity = 0.3;

    if (showButton) {
      return maxOpacity;
    } else {
      return minOpacity;
    }
  };

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

  const fetchPosts = useCallback(
    async (targetPage: number) => {
      console.log('fetchPosts 호출:', { targetPage, selectedTags, hasMore });
      setLoading(true);
      try {
        if (selectedTags.length === 0) {
          const newPosts = await getAllPosts(accessToken, targetPage, PAGE_SIZE);
          console.log('API 응답:', newPosts.length, '개 게시글');
          if (newPosts.length < PAGE_SIZE) setHasMore(false);
          setPosts((prev) => [...(targetPage === 1 ? [] : prev), ...newPosts]);
        } else {
          const postLists = await Promise.all(
            selectedTags.map((tag) => postHashtagSearch(tag, accessToken, targetPage, PAGE_SIZE)),
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
    [accessToken, selectedTags],
  );

  // selectedTags 변경 시 초기화 후 첫 페이지 로드
  useEffect(() => {
    if (!isInitialized || !pathname) return;
    localStorage.setItem('selectedTags', JSON.stringify(selectedTags));
    localStorage.setItem('selectedTags_path', pathname);
    setPosts([]);
    setPage(1);
    setHasMore(true);
    fetchPosts(1);
  }, [selectedTags, pathname, isInitialized, fetchPosts]);

  // page 변경 시 해당 페이지 로드 (무한스크롤)
  useEffect(() => {
    if (!isInitialized || page === 1) return;

    console.log('페이지 변경으로 인한 로드:', { page, selectedTags });

    // 직접 API 호출로 무한루프 방지
    const loadPage = async () => {
      setLoading(true);
      try {
        if (selectedTags.length === 0) {
          const newPosts = await getAllPosts(accessToken, page, PAGE_SIZE);
          console.log(`${page}페이지 API 응답:`, newPosts.length, '개 게시글');
          if (newPosts.length < PAGE_SIZE) setHasMore(false);
          setPosts((prev) => [...prev, ...newPosts]);
        } else {
          const postLists = await Promise.all(
            selectedTags.map((tag) => postHashtagSearch(tag, accessToken, page, PAGE_SIZE)),
          );
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
  }, [page, isInitialized, selectedTags, accessToken]);

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
  };

  // 게시글 삭제 이벤트 리스너
  useEffect(() => {
    const handlePostDeleted = (event: CustomEvent) => {
      const { postId, type } = event.detail;
      // 게시글 삭제인 경우에만 처리
      if (type === 'post') {
        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
      }
    };

    window.addEventListener('postDeleted', handlePostDeleted as EventListener);

    return () => {
      window.removeEventListener('postDeleted', handlePostDeleted as EventListener);
    };
  }, []);

  return (
    <main
      className="flex min-h-full flex-col bg-BG-black text-white"
      onTouchStart={() => {}}
      onTouchMove={() => {}}
      onTouchEnd={() => {}}>
      <BoardHeader profileImageUrl={userProfile?.profileImageUrl} />

      <BoardHashtag selectedTags={selectedTags} setSelectedTags={setSelectedTags} onUpdatePosts={handleUpdatePosts} />

      {/* 🔽 여기서 해시태그 아래 여백 */}
      <div
        style={{
          height: '0px',
          transition: 'none',
        }}
      />

      <AnimatePresence>
        {false && (
          <motion.div
            key="refresh-indicator"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-center text-sm text-gray300"></motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1">
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

        {!loading && posts.length === 0 && (
          <NoResults text="아직 게시글이 없어요.\n첫 게시글을 작성해보세요." fullHeight />
        )}
      </div>

      <div className="pointer-events-none fixed inset-x-0 bottom-[60px] z-50 flex justify-center">
        <div className="w-full max-w-[600px] px-4">
          <button
            onClick={() => handleInteractionWithProfileCheck(() => router.push('/board/write'))}
            className="pointer-events-auto ml-auto flex h-14 w-14 items-center justify-center rounded-full bg-main text-sub2 shadow-lg transition-all duration-300 active:scale-90"
            style={{
              opacity: getOpacity(),
              transform: showButton ? 'translateY(0)' : 'translateY(40px)',
            }}>
            <img src="/icons/ic_baseline-plus.svg" alt="글쓰기" className="h-7 w-7" />
          </button>
        </div>
      </div>

      {/* 게시판 프로필 생성 모달 */}
      <ProfileModal isOpen={showProfileModal} onClose={() => setShowProfileModal(false)} />
    </main>
  );
}
