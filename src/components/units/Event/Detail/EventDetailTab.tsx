'use client';

import EventInfo from './EventDetailInfo';
import EventQnA from './EventDetailQnA';
import { EventDetail } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState, useRecoilValue } from 'recoil';
import { eventDetailTabState, accessTokenState } from '@/context/recoil-context';
import { postComment } from '@/lib/actions/event-controller/postComment';
import Image from 'next/image';
import { useState, useRef, useEffect } from 'react';

export default function EventDetailTab({ eventDetail }: { eventDetail: EventDetail }) {
  const [tab, setTab] = useRecoilState(eventDetailTabState);
  const [showModal, setShowModal] = useState(false);
  const [qnaContent, setQnaContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const accessToken = useRecoilValue(accessTokenState) || '';

  // 스와이프 관련 상태
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [isSwiping, setIsSwiping] = useState(false);

  // 스크롤 관련 상태
  const [showButton, setShowButton] = useState(true);
  const lastScrollYRef = useRef(0);

  const tabs = [
    { key: 'info', label: '행사 소개' },
    { key: 'qna', label: '행사 문의' },
  ] as const;

  const activeIndex = tab === 'info' ? 0 : 1;

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement;
      const scrollTop = scrollContainer ? scrollContainer.scrollTop : window.pageYOffset;
      const currentScrollY = scrollTop;
      const lastScrollY = lastScrollYRef.current;

      // 스크롤 방향 감지
      const isScrollingUp = currentScrollY < lastScrollY;
      const isScrollingDown = currentScrollY > lastScrollY;

      if (isScrollingUp) {
        setShowButton(true);
      } else if (isScrollingDown) {
        setShowButton(false);
      }

      lastScrollYRef.current = currentScrollY;
    };

    const scrollContainer = document.querySelector('.overflow-y-auto') as HTMLElement;
    const target = scrollContainer || window;
    target.addEventListener('scroll', handleScroll);

    return () => {
      target.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 스와이프 감지 함수
  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
    setIsSwiping(false);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    setIsSwiping(true);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;

    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe && tab === 'info') {
      // 왼쪽으로 스와이프하고 info 탭에 있을 때 -> qna로 이동
      setTab('qna');
    } else if (isRightSwipe && tab === 'qna') {
      // 오른쪽으로 스와이프하고 qna 탭에 있을 때 -> info로 이동
      setTab('info');
    }

    setTouchStart(null);
    setTouchEnd(null);
    setIsSwiping(false);
  };

  const handleSubmit = async () => {
    if (!qnaContent.trim()) return;
    setIsSubmitting(true);
    try {
      await postComment(
        eventDetail.eventId,
        {
          content: qnaContent,
          anonymous: true,
          parentCommentId: '',
        },
        accessToken,
      );

      setQnaContent('');
      setShowModal(false);
      setRefreshKey((prev) => prev + 1); // 키 변경으로 EventQnA 컴포넌트 강제 리렌더링

      // 스크롤 이동
      setTimeout(() => {
        observerRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } catch (err) {
      console.error('댓글 작성 실패:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative">
      {/* 탭 버튼 + 밑줄 */}
      <div className="relative flex border-b border-gray700">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 text-center text-[0.875rem] ${
              tab === key ? 'font-bold text-main' : 'text-gray100'
            }`}>
            {label}
          </button>
        ))}

        {/* 밑줄 애니메이션 */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-0 h-[1.5px] w-1/2 bg-main"
          style={{
            left: `${activeIndex * 50}%`, // 2개 탭 → 50%
          }}
        />
      </div>

      {/* 탭 콘텐츠 영역 애니메이션 */}
      <div
        className="relative min-h-[150px]"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        style={{ touchAction: isSwiping ? 'none' : 'auto' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full">
            {tab === 'info' ? (
              <EventInfo eventDetail={eventDetail} />
            ) : (
              <EventQnA key={refreshKey} eventDetail={eventDetail} observerRef={observerRef} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* QnA 탭일 때만 플로팅 버튼 표시 - 애니메이션 영역 밖에 위치 */}
      {tab === 'qna' && (
        <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-[600px] -translate-x-1/2 px-6">
          <div className="flex justify-end">
            <motion.button
              title="문의하기"
              onClick={() => setShowModal(true)}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-main text-white shadow-lg transition-all duration-300 ease-in-out active:scale-90"
              animate={{
                opacity: showButton ? 1 : 0.3,
              }}
              transition={{ duration: 0.3 }}>
              <Image src="/icons/ic_baseline-plus.svg" alt="글쓰기" width={28} height={28} />
            </motion.button>
          </div>
        </div>
      )}

      {/* QnA 작성 모달 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 px-6"
            onClick={() => setShowModal(false)}>
            <div className="rounded-lg bg-BG-black px-5 pb-6 pt-6 text-center" onClick={(e) => e.stopPropagation()}>
              <textarea
                value={qnaContent}
                onChange={(e) => setQnaContent(e.target.value)}
                placeholder="문의 내용을 작성해 주세요"
                className="mb-4 min-h-[7.5rem] w-full min-w-[18rem] resize-none rounded-[0.5rem] bg-gray700 px-4 py-3 text-sm text-gray200 placeholder:text-gray300 focus:outline-none"
              />
              <div className="flex justify-between gap-2">
                <button
                  onClick={() => setShowModal(false)}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.62rem] font-bold text-gray200">
                  취소
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-[0.62rem] font-bold text-main">
                  문의 등록하기
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
