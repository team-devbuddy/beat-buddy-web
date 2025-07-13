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
  useEffect(() => {
    const fetchDetail = async () => {
      const data = await getEventDetail(accessToken, eventId);
      setEventDetail(data);
      setRecoilState(data);
      setEventDetailTab('info');
    };
    fetchDetail();
  }, [accessToken, eventId]);

  return (
    <div className="relative min-h-screen bg-BG-black">
      {/* 헤더는 최상단에 고정 */}
      <div className="absolute left-0 top-0 z-30 w-full">
        <EventDetailHeader handleBackClick={() => router.push('/event')} />
      </div>

      {/* Summary는 헤더 밑에 표시 */}
      {eventDetail && <EventDetailSummary eventDetail={eventDetail} />}

      {eventDetail && <EventDetailTab eventDetail={eventDetail} />}

      {eventDetailTab === 'info' && (
        <>
          {!eventDetail?.isAuthor && (
            <div className="fixed bottom-0 left-0 w-full border-none px-[1.25rem] pb-[1.25rem] pt-2">
              <button
                type="button"
                onClick={() => router.push(`/event/${eventId}/participate`)}
                className="w-full rounded-md border-none bg-main py-4 text-[1rem] font-bold text-sub2">
                참석하기
              </button>
            </div>
          )}
          {eventDetail?.isAuthor && (
            <div className="fixed bottom-0 left-0 w-full border-none px-[1.25rem] pb-[1.25rem] pt-2">
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
