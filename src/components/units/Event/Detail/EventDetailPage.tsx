'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import EventDetailHeader from './EventDetailHeader';
import EventDetailSummary from './EventDetailSummary';
import EventDetailTab from './EventDetailTab';
import BoardDropDown from '../../Board/BoardDropDown';
import { accessTokenState, userProfileState, eventState, eventDetailTabState } from '@/context/recoil-context';
import { getEventDetail } from '@/lib/actions/event-controller/getEventDetail';
import { postLikeEvent } from '@/lib/actions/event-controller/postLikeEvent';
import { deleteLikeEvent } from '@/lib/actions/event-controller/deleteLikeEvent';
import { EventDetail } from '@/lib/types';

export default function EventDetailPage({ eventId }: { eventId: string }) {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const eventDetailTab = useRecoilValue(eventDetailTabState);

  const setEventState = useSetRecoilState(eventState);
  const setEventDetailTab = useSetRecoilState(eventDetailTabState);

  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const [showButton, setShowButton] = useState(false);
  const [showSummaryHeader, setShowSummaryHeader] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const dropdownButtonRef = useRef<HTMLImageElement>(null);

  const fallbackShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('링크가 복사되었습니다.');
        // 사용자에게 알림을 주는 것이 좋습니다
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
        // 클립보드 복사가 실패한 경우 URL을 직접 보여줌
      });
  };

  const handleShareClick = () => {
    const url = window.location.href;
    const title = eventDetail?.title || 'BeatBuddy';
    const text = `${eventDetail?.title} - BeatBuddy에서 확인해보세요!`;

    console.log('Share Debug:', {
      navigatorShare: !!navigator.share,
      url,
      title,
      text,
      userAgent: navigator.userAgent,
      isSecure: window.location.protocol === 'https:',
    });

    // 네이티브 공유 API 지원 확인
    if (navigator.share) {
      const shareData = {
        title: title,
        text: text,
        url: url,
      };

      console.log('Attempting native share with data:', shareData);

      navigator
        .share(shareData)
        .then(() => {
          console.log('공유 성공');
        })
        .catch((error) => {
          console.log('공유 취소 또는 오류:', error);
          // 공유가 취소되거나 실패하면 클립보드 복사로 폴백
          fallbackShare();
        });
    } else {
      console.log('네이티브 공유 API를 지원하지 않습니다. 클립보드 복사로 폴백합니다.');
      // 네이티브 공유 API를 지원하지 않는 경우 클립보드 복사
      fallbackShare();
    }
  };

  const handleLike = async () => {
    if (!eventDetail || isLiking) return;

    setIsLiking(true);
    try {
      if (eventDetail.liked) {
        await deleteLikeEvent(eventDetail.eventId, accessToken);
        setEventDetail((prev) => (prev ? { ...prev, liked: false, likes: Math.max(0, prev.likes - 1) } : null));
        setEventState((prev) => (prev ? { ...prev, liked: false, likes: Math.max(0, prev.likes - 1) } : null));
      } else {
        await postLikeEvent(eventDetail.eventId, accessToken);
        setEventDetail((prev) => (prev ? { ...prev, liked: true, likes: prev.likes + 1 } : null));
        setEventState((prev) => (prev ? { ...prev, liked: true, likes: prev.likes + 1 } : null));
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    } finally {
      setIsLiking(false);
    }
  };

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        const data = await getEventDetail(accessToken, eventId);
        setEventDetail(data);
        setEventState(data);
        setEventDetailTab('info');
      } catch (error) {
        console.error('Failed to fetch event details:', error);
      }
    };
    fetchDetail();
  }, [accessToken, eventId, setEventState, setEventDetailTab]);

  // ❗ 수정된 스크롤 감지 로직
  useEffect(() => {
    const handleScroll = () => {
      // 스크롤 컨테이너를 더 정확하게 찾기
      const scrollContainer =
        document.querySelector('[ref="scrollContainerRef"]') || document.querySelector('.overflow-y-auto') || window;
      const scrollTop = (scrollContainer as HTMLElement).scrollTop ?? window.pageYOffset;

      const summaryElement = document.querySelector('[data-summary]') as HTMLElement;

      // Summary 높이만 고려 (탭은 고정되므로 제외)
      const summaryHeight = summaryElement ? summaryElement.offsetHeight : 0;

      console.log('Scroll Debug:', {
        scrollTop,
        summaryHeight,
        shouldShowHeader: scrollTop > summaryHeight,
        scrollContainer: scrollContainer,
      });

      // 스크롤 위치가 Summary 높이를 넘어가면 고정 헤더를 보여주고, 아니면 숨김
      if (scrollTop > summaryHeight) {
        setShowSummaryHeader(true);
      } else {
        setShowSummaryHeader(false);
      }

      // 스크롤이 맨 아래에 가까우면 버튼 표시
      const scrollHeight = (scrollContainer as HTMLElement).scrollHeight || document.documentElement.scrollHeight;
      const clientHeight = (scrollContainer as HTMLElement).clientHeight || window.innerHeight;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      setShowButton(isAtBottom);
    };

    // 여러 스크롤 컨테이너에 이벤트 리스너 추가
    const containers = [
      document.querySelector('[ref="scrollContainerRef"]'),
      document.querySelector('.overflow-y-auto'),
      window,
    ].filter(Boolean);

    containers.forEach((container) => {
      container?.addEventListener('scroll', handleScroll, { passive: true });
    });

    // 초기 상태 설정을 위해 한 번 호출 (버튼은 숨김 상태로 시작)
    setTimeout(() => {
      const scrollContainer =
        document.querySelector('[ref="scrollContainerRef"]') || document.querySelector('.overflow-y-auto') || window;
      const scrollTop = (scrollContainer as HTMLElement).scrollTop ?? window.pageYOffset;

      const summaryElement = document.querySelector('[data-summary]') as HTMLElement;
      const summaryHeight = summaryElement ? summaryElement.offsetHeight : 0;

      // Summary 헤더만 초기 설정, 버튼은 스크롤할 때만 표시
      if (scrollTop > summaryHeight) {
        setShowSummaryHeader(true);
      } else {
        setShowSummaryHeader(false);
      }
      // showButton은 초기에 false로 유지
    }, 100);

    return () => {
      containers.forEach((container) => {
        container?.removeEventListener('scroll', handleScroll);
      });
    };
  }, []); // 최초 렌더링 시 한 번만 실행

  // 드롭다운 위치 계산
  useEffect(() => {
    if (showDropdown && dropdownButtonRef.current) {
      const rect = dropdownButtonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;

      const DROPDOWN_WIDTH = 100;
      let left = rect.right + scrollX - DROPDOWN_WIDTH;
      if (left < 8) left = 8;

      setDropdownPosition({
        top: rect.bottom + scrollY + 8,
        left,
      });
    }
  }, [showDropdown]);

  return (
    <div className="relative min-h-screen bg-BG-black">
      {/* 기본 헤더 */}
      <div className="absolute left-0 top-0 z-30 w-full">
        <EventDetailHeader handleBackClick={() => router.back()} />
      </div>

      {/* 스크롤 시 나타나는 요약 헤더 */}
      <AnimatePresence>
        {showSummaryHeader && eventDetail && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-0 z-40 w-full bg-BG-black">
            <div className="relative mx-auto flex max-w-[600px] items-center justify-between px-5 pb-[0.88rem] pt-[0.62rem]">
              {/* 왼쪽: 백버튼과 제목 */}
              <div className="flex items-center">
                <Image
                  src="/icons/arrow_back_ios.svg"
                  alt="뒤로가기"
                  width={24}
                  height={24}
                  onClick={() => router.back()}
                  className="cursor-pointer"
                />
                <div className="flex flex-col">
                  <h1 className="max-w-[200px] text-button-bold text-white">{eventDetail.title}</h1>
                </div>
              </div>

              {/* 오른쪽: 좋아요와 메뉴 버튼 */}
              <div className="flex items-center gap-3">
                <Image
                  src="/icons/upload.svg"
                  alt="공유"
                  width={24}
                  height={24}
                  className="cursor-pointer"
                  onClick={handleShareClick}
                />
                {/* 좋아요 버튼 */}
                <Image
                  src={eventDetail.liked ? '/icons/FilledHeart.svg' : '/icons/eventHeart.svg'}
                  alt="좋아요"
                  width={21}
                  height={21}
                  className="cursor-pointer"
                  onClick={handleLike}
                />

                {/* 드롭다운 메뉴 */}
                {eventDetail.isAuthor && (
                  <Image
                    src="/icons/dot-vertical-white.svg"
                    alt="메뉴"
                    width={9}
                    height={20}
                    className="cursor-pointer"
                    onClick={() => setShowDropdown((prev) => !prev)}
                    ref={dropdownButtonRef}
                  />
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 요약 헤더 드롭다운 */}
      {showDropdown && eventDetail && (
        <BoardDropDown
          isAuthor={eventDetail.isAuthor}
          onClose={() => setShowDropdown(false)}
          position={dropdownPosition}
          postId={eventDetail.eventId}
          eventId={eventDetail.eventId}
          type="event"
        />
      )}

      {/* 기본 정보 Summary */}
      <AnimatePresence>
        {eventDetail && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: showSummaryHeader ? 0 : 1 }}
            transition={{ duration: 0.3 }}
            data-summary // ❗ 높이 측정을 위한 속성 추가
            className={showSummaryHeader ? 'invisible' : ''}>
            <EventDetailSummary eventDetail={eventDetail} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 탭 & 탭 콘텐츠 */}
      {eventDetail && <EventDetailTab eventDetail={eventDetail} />}

      {/* 참석하기 버튼 - receiveInfo가 true인 경우에만 표시 */}
      {eventDetailTab === 'info' && showButton && eventDetail?.receiveInfo && (
        <>
          {!eventDetail?.isAuthor && !eventDetail?.isAttending && (
            <div className="fixed bottom-0 left-0 z-50 w-full max-w-[600px] border-none px-[1.25rem] pb-[1.25rem] pt-2">
              <button
                type="button"
                onClick={() => router.push(`/event/${eventId}/participate`)}
                className="w-full rounded-md border-none bg-main py-[0.81rem] text-[1rem] font-bold text-sub2">
                참석하기
              </button>
            </div>
          )}
          {!eventDetail?.isAuthor && eventDetail?.isAttending && (
            <div className="fixed bottom-0 left-0 z-50 w-full max-w-[600px] border-none px-[1.25rem] pb-[1.25rem] pt-2">
              <button
                type="button"
                onClick={() => router.push(`/event/${eventId}/participate?mode=edit`)}
                className="w-full rounded-md border-[0.8px] border-main bg-BG-black py-4 text-[1rem] font-bold text-main shadow-[0px_0px_20px_0px_rgba(238,17,113,0.25)]">
                참석 정보 확인하기
              </button>
            </div>
          )}
          {eventDetail?.isAuthor && (
            <div className="fixed bottom-0 left-0 z-50 w-full border-none px-[1.25rem] pb-[1.25rem] pt-2">
              <button
                type="button"
                onClick={() => router.push(`/event/${eventId}/participate-info`)}
                className="w-full rounded-md border-[0.8px] border-main bg-BG-black py-4 text-[1rem] font-bold text-main shadow-[0px_0px_20px_0px_rgba(238,17,113,0.25)]">
                참석 명단 확인하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
