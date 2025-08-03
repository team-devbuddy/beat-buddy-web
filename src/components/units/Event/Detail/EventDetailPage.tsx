'use client';

import EventDetailSummary from './EventDetailSummary';
import EventDetailTab from './EventDetailTab';
import { useRouter } from 'next/navigation';
import EventDetailHeader from './EventDetailHeader';
import { useRecoilValue } from 'recoil';
import { accessTokenState, userProfileState } from '@/context/recoil-context';
import { getEventDetail } from '@/lib/actions/event-controller/getEventDetail';
import { EventDetail } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { eventState } from '@/context/recoil-context';
import { eventDetailTabState } from '@/context/recoil-context';

export default function EventDetailPage({ eventId }: { eventId: string }) {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [eventDetail, setEventDetail] = useState<EventDetail | null>(null);
  const setRecoilState = useSetRecoilState(eventState);
  const userProfile = useRecoilValue(userProfileState);
  const setEventDetailTab = useSetRecoilState(eventDetailTabState);
  const eventDetailTab = useRecoilValue(eventDetailTabState);
  const [showButton, setShowButton] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getEventDetail(accessToken, eventId);
      setEventDetail(data);
      setRecoilState(data);
      setEventDetailTab('info');
    };
    fetchDetail();
  }, [accessToken, eventId]);

  // 스크롤 감지
  useEffect(() => {
    const handleScroll = () => {
      console.log('Scroll event triggered!');

      // appLayout의 스크롤 컨테이너 찾기
      const scrollContainer = document.querySelector('.overflow-y-auto') || document.documentElement;
      const scrollTop = scrollContainer.scrollTop || window.pageYOffset || document.documentElement.scrollTop;
      const scrollHeight = scrollContainer.scrollHeight || document.documentElement.scrollHeight;
      const clientHeight = scrollContainer.clientHeight || window.innerHeight;

      // 스크롤이 맨 아래에 가까우면 버튼 표시
      const isAtBottom = scrollTop + clientHeight >= scrollHeight - 50;
      console.log('Scroll Debug:', { scrollTop, clientHeight, scrollHeight, isAtBottom });
      setShowButton(isAtBottom);
    };

    // 초기 상태는 false로 설정
    setShowButton(false);

    // appLayout의 스크롤 컨테이너에 이벤트 리스너 추가
    const scrollContainer = document.querySelector('.overflow-y-auto') || window;
    console.log('Adding scroll event listener to:', scrollContainer);
    scrollContainer.addEventListener('scroll', handleScroll);

    return () => {
      console.log('Removing scroll event listener');
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className="relative min-h-screen bg-BG-black">
      {/* 헤더는 최상단에 고정 */}
      <div className="absolute left-0 top-0 z-30 w-full">
        <EventDetailHeader handleBackClick={() => router.push('/event')} />
      </div>

      {/* Summary는 헤더 밑에 표시 */}
      {eventDetail && <EventDetailSummary eventDetail={eventDetail} />}

      {eventDetail && <EventDetailTab eventDetail={eventDetail} />}

      {eventDetailTab === 'info' && showButton && (
        <>
          {!eventDetail?.isAuthor && (
            <div className="fixed bottom-0 left-1/2 z-50 w-full max-w-[600px] -translate-x-1/2 border-none px-[1.25rem] pb-[1.25rem] pt-2">
              <button
                type="button"
                onClick={() => router.push(`/event/${eventId}/participate`)}
                className="w-full rounded-md border-none bg-main py-4 text-[1rem] font-bold text-sub2">
                참석하기
              </button>
            </div>
          )}
          {eventDetail?.isAuthor && eventDetail.receiveInfo && (
            <div className="fixed bottom-0 left-0 z-50 w-full border-none px-[1.25rem] pb-[1.25rem] pt-2">
              <button
                type="button"
                onClick={() => router.push(`/event/${eventId}/participate-info`)}
                className="w-full rounded-md border-[0.8px] border-main bg-BG-black py-4 text-[1rem] font-bold text-main shadow-[0px_0px_20px_0px_rgba(238,17,113,0.25)]">
                참석정보 확인하기
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
