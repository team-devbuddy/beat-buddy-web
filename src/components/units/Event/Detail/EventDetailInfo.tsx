'use client';

import { EventDetail } from '@/lib/types';
import Image from 'next/image';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { userProfileState } from '@/context/recoil-context';
import { useRouter } from 'next/navigation';
import { eventState } from '@/context/recoil-context';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { getESsearch } from '@/lib/actions/event-controller/event-write-controller/getESsearch';
import BoardDropDown from '../../Board/BoardDropDown';

const NaverMap = dynamic(() => import('@/components/common/NaverMap'), { ssr: false });

export default function EventInfo({ eventDetail }: { eventDetail: EventDetail }) {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const userProfile = useRecoilValue(userProfileState);
  const event = useRecoilValue(eventState);
  const [clubs, setClubs] = useState<any[]>([]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday}) ${hours}:${minutes}`;
  };

  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  // ✅ 클럽 정보 검색해서 지도 마커 표시용으로 세팅
  useEffect(() => {
    const fetchClubInfo = async () => {
      if (!eventDetail.location) return;

      try {
        const res = await getESsearch(eventDetail.location, accessToken);

        const topResult = res?.[0];
        if (topResult) {
          const eventClub = {
            venueId: topResult.venueId,
            englishName: topResult.englishName,
            koreanName: topResult.koreanName,
            address: topResult.address,
            latitude: topResult.latitude,
            longitude: topResult.longitude,
          };
          setClubs([eventClub]);
        } else {
          console.warn('No club found for location:', eventDetail.location);
        }
      } catch (err) {
        console.error('Error fetching club info:', err);
      }
    };

    fetchClubInfo();
  }, [eventDetail.location]);

  const onClick = () => {
    if (eventDetail.isAuthor) {
      router.push(`/event/${eventDetail.eventId}/participate-info`);
    } else {
      router.push(`/event/${eventDetail.eventId}/participate`);
    }
  };

  return (
    <div className="space-y-3 px-[1.25rem] py-[1.5rem]">
      <section>
        <h3 className="text-[1rem] font-bold text-white">Notice</h3>
        <div className="mt-3 flex flex-col gap-[0.5rem] rounded-md bg-gray700 p-4">
          <div className="flex items-start gap-[0.25rem]">
            <Image src="/icons/calendar.svg" alt="calendar" width={20} height={20} />
            <p className="text-[0.875rem] text-gray100">
              {formatDate(eventDetail.startDate)} 부터
              <br />
              {formatDate(eventDetail.endDate)} 까지
            </p>
          </div>
          <div className="flex items-start gap-[0.25rem]">
            <Image src="/icons/database.svg" alt="enter fee" width={20} height={20} />
            <p className="text-[0.875rem] text-white">
              {eventDetail.entranceFee ? `입장료 ${formatPrice(eventDetail.entranceFee)}원` : '무료'}
              <br />
              <span className="text-[0.875rem] text-gray100">{eventDetail.entranceNotice}</span>
            </p>
          </div>
          <div className="flex items-start gap-[0.25rem]">
            <Image src="/icons/locationMark.svg" alt="info" width={20} height={20} />
            <div className="flex items-end gap-1">
              <p className="text-[0.875rem] text-gray100">{eventDetail.location}</p>
              {eventDetail.location && (
                <a
                  href={`https://map.naver.com/p/search/${encodeURIComponent(eventDetail.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.75rem] text-main hover:underline">
                  길찾기
                </a>
              )}
            </div>
          </div>

          {clubs.length > 0 && (
            <div className="">
              <div
                className="h-[10rem] overflow-hidden rounded-[0.25rem] border-none focus:outline-none"
                style={{ touchAction: 'none', pointerEvents: 'auto' }}
                onTouchStart={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchMove={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onTouchEnd={(e) => {
                  e.stopPropagation();
                  e.preventDefault();
                }}
                onPointerDown={(e) => {
                  e.stopPropagation();
                }}
                onPointerMove={(e) => {
                  e.stopPropagation();
                }}
                onPointerUp={(e) => {
                  e.stopPropagation();
                }}>
                <NaverMap clubs={clubs} zoom={15} showLocationButton={false} showZoomControl={false} clickable={true} />
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="pb-24">
        <h3 className="text-[1rem] font-bold text-white">About</h3>
        <div className="mt-3 rounded-md bg-gray700 px-[1rem] py-[1.25rem] text-[0.875rem] text-gray300">
          {eventDetail.content}
        </div>
      </section>
    </div>
  );
}
