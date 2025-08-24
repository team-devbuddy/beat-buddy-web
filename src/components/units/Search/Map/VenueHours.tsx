'use client';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';
import { useVenueHours, getVenueHoursText } from '@/lib/utils/venueInfoUtils';

const dayMap: Record<string, string> = {
  월요일: '월',
  화요일: '화',
  수요일: '수',
  목요일: '목',
  금요일: '금',
  토요일: '토',
  일요일: '일',
};

export default function VenueHours({
  operationHours,
}: {
  operationHours: Record<string, string>;
}) {
  const { status, todayOpen, todayClose, now } = useVenueHours(operationHours);
  const { label, detail, color } = getVenueHoursText({
    status,
    todayOpen,
    todayClose,
    now,
  });
  const [show, setShow] = useState(false);

  const daysKor = Object.keys(dayMap);
  const todayKor =
    daysKor[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]; // 요일 강조용

  

  return (
    <div className="flex w-full items-start gap-1">
      <Image src="/icons/alarm.svg" alt="clock" width={16} height={16} />
      <div className="flex flex-col">
        {/* 상단 상태 + 오늘 정보 */}
        <div
          className="flex items-center gap-1 cursor-pointer"
          onClick={() => setShow((p) => !p)}
        >
          <p className="text-body-12-medium flex items-center gap-1">
            <span className={`text-body-12-medium ${color}`}>{label}</span>
            {detail && (
              <>
                <span className="mx-1">·</span>
                <span className="text-gray200">{detail}</span>
              </>
            )}
          </p>
          <Image
            src="/icons/arrow_back_ios_down.svg"
            alt="arrow-down"
            width={12}
            height={12}
            className={`${show ? 'rotate-180' : ''}`}
          />
        </div>

        {/* 펼쳐지는 상세 요일별 시간 */}
        <AnimatePresence>
          {show && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="mt-1 overflow-hidden text-body-12-medium text-gray200"
            >
              {daysKor.map((day) => (
                <div
                  key={day}
                  className={`flex py-[1px] pr-2 text-body-12-medium ${
                    day === todayKor ? 'text-main font-semibold' : ''
                  }`}
                >
                  <span className="mr-2 font-bold">{dayMap[day]}</span>
                  <span>{operationHours[day]}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
