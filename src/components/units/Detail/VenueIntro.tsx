'use client';

import Image from 'next/image';
import { Club } from '@/lib/types';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';

const NaverMap = dynamic(() => import('@/components/common/NaverMap'), { ssr: false });

interface VenueIntroProps {
  venue: Club;
}

const dayMap: Record<string, string> = {
  월요일: '월',
  화요일: '화',
  수요일: '수',
  목요일: '목',
  금요일: '금',
  토요일: '토',
  일요일: '일',
};

export default function VenueIntro({ venue }: VenueIntroProps) {
  const { entranceFee, entranceNotice, address, operationHours, englishName } = venue;
  const [clubs, setClubs] = useState<Club[]>([]);
  const [showFullHours, setShowFullHours] = useState(false);

  const [openTimeModal, setOpenTimeModal] = useState(false);

  function getOpenStatus(operationHours: Record<string, string>) {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const today = days[now.getDay()];
    const todayHours = operationHours[today];

    if (!todayHours || todayHours === '휴무') return 'CLOSED';

    const [open, close] = todayHours.split('~').map((t) => t.trim());
    if (!open || !close) return 'CLOSED';

    const toMinutes = (str: string) => {
      const [h, m] = str.split(':').map(Number);
      return h * 60 + m;
    };

    const nowMin = now.getHours() * 60 + now.getMinutes();
    const openMin = toMinutes(open);
    const closeMin = toMinutes(close);

    return nowMin >= openMin && nowMin <= closeMin ? 'OPEN' : 'CLOSED';
  }

  // 첫 번째 영업 요일 찾기
  const firstOpenDay = Object.entries(operationHours).find(([_, time]) => time !== '휴무');
  const openTime = firstOpenDay ? firstOpenDay[1] : '운영시간 미제공';

  useEffect(() => {
    if (address) {
      setClubs([
        {
          ...venue,
          englishName: venue.englishName || 'Venue',
        },
      ]);
    }
  }, [venue]);

  return (
    <div className="px-5">
      <div className="flex flex-col gap-2 rounded-[0.75rem] bg-gray700 p-4 text-gray100">
        {/* 운영 시간 */}
        <div className="flex w-full select-none items-start gap-1">
          <Image src="/icons/alarm.svg" alt="clock" width={20} height={20} className="" />

          <div className="flex flex-col" onClick={() => setShowFullHours((prev) => !prev)}>
            <div className="flex items-center gap-1">
            <p className="cursor-pointer text-[0.875rem] text-gray100">
              <span className={` ${getOpenStatus(operationHours) === 'OPEN' ? 'text-main' : 'text-white'}`}>
                {getOpenStatus(operationHours) === 'OPEN' ? 'OPEN' : 'CLOSED'}
              </span>{' '}
              • {openTime}
            </p>
            <Image src="/icons/arrow_back_ios_down.svg" alt="arrow-down" width={16} height={16} className={`${showFullHours ? 'rotate-180' : ''}`} />
            </div>

            {/* 펼쳐지는 운영 시간 상세 */}
            <AnimatePresence>
              {showFullHours && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-1 overflow-hidden text-[0.875rem] text-gray200">
                  {['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'].map((day) => (
                    <div key={day} className="flex py-[1px] pr-2">
                      <span className="mr-3 font-bold">{dayMap[day]}</span>
                      <span>{operationHours[day]}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* 입장료 */}
        <div className="flex flex-row items-start gap-1">
          <Image src="/icons/database.svg" alt="coin" width={20} height={20} />
          <div className="flex flex-col">
            <p className={`text-[0.875rem] ${entranceFee ? 'text-white' : 'text-main'}`}>
              {entranceFee ? `입장료 ${entranceFee.toLocaleString()}원` : '무료입장'}
            </p>
            <p className="text-[0.875rem]">{entranceNotice || '입장료 관련 특이사항이 없습니다.'}</p>
          </div>
        </div>

        {/* 주소 */}
        <div className="flex items-center gap-1">
          <Image src="/icons/detail_location.svg" alt="location" width={20} height={20} />
          <p className="text-[0.875rem] text-gray100">
            {address}{' '}
            <a
              href={`https://map.naver.com/v5/search/${encodeURIComponent(address)}`}
              className="ml-1 mt-1 text-[0.75rem] text-main"
              target="_blank"
              rel="noopener noreferrer">
              길찾기
            </a>
          </p>
        </div>

        {/* 지도 */}
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
          <NaverMap clubs={clubs} zoom={10} showLocationButton={false} showZoomControl={false} clickable={true} />
        </div>
      </div>
    </div>
  );
}
