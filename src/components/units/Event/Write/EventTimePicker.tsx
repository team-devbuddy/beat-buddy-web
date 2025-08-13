'use client';

import { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Mousewheel } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/free-mode';

type Props = {
  selectedHour: number;
  selectedMinute: number;
  onChange: (h: number, m: number) => void;
};

const HOUR_RANGE = 24;
const MINUTE_RANGE = 60;
const pad2 = (n: number) => String(n).padStart(2, '0');

export default function TimePickerSwiper({ selectedHour, selectedMinute, onChange }: Props) {
  const [hour, setHour] = useState(selectedHour % HOUR_RANGE);
  const [minute, setMinute] = useState(selectedMinute % MINUTE_RANGE);

  const hourSwiperRef = useRef<any>(null);
  const minuteSwiperRef = useRef<any>(null);

  // 외부 값 변경 시 위치 동기화 (애니메이션 없이 즉시)
  useEffect(() => {
    const h = selectedHour % HOUR_RANGE;
    const m = selectedMinute % MINUTE_RANGE;
    setHour(h);
    setMinute(m);
    hourSwiperRef.current?.slideToLoop(h, 0);
    minuteSwiperRef.current?.slideToLoop(m, 0);
  }, [selectedHour, selectedMinute]);

  // 공통 옵션: 세로 3개, 센터 기준 스냅, 루프, 클릭 시 해당 슬라이드로 이동
  const common = {
    direction: 'vertical' as const,
    slidesPerView: 3,
    centeredSlides: true,
    loop: true,
    freeMode: { enabled: true, sticky: true },
    modules: [FreeMode, Mousewheel],
    mousewheel: { forceToAxis: true, sensitivity: 0.6 },
    slideToClickedSlide: true, // ✅ 클릭 시 해당 항목으로 “스르륵”
    speed: 200,
    resistance: true,
    resistanceRatio: 0.35,
    roundLengths: true,
    spaceBetween: 0,
    grabCursor: true,
  };

  // 슬라이드 높이/컨텐츠 높이 일치 (여백 불균형 방지)
  const slideClass = 'flex h-[1.8125rem] items-center justify-center'; // ≈ 29px
  const cellBase = 'flex h-[1.8125rem] items-center justify-center text-body-14-semibold';

  return (
    <div className="flex items-center justify-center rounded-[0.25rem] border border-gray500 bg-BG-black px-[0.63rem] py-2 text-white">
      {/* Hour */}
      <div className="relative h-[5.4375rem] w-[5.1563rem]">
        {' '}
        {/* 약 29px * 3 */}
        <Swiper
          {...common}
          onSwiper={(sw) => (hourSwiperRef.current = sw)}
          initialSlide={hour}
          // ✅ 절반 넘으면 활성 인덱스가 바뀌면서 여기로 콜백 들어옴 → 그 값을 선택으로 사용
          onActiveIndexChange={(sw) => {
            const val = sw.realIndex % HOUR_RANGE;
            if (val !== hour) {
              setHour(val);
              onChange(val, minute);
            }
          }}
          className="h-full">
          {Array.from({ length: HOUR_RANGE }, (_, i) => (
            <SwiperSlide key={`h-${i}`} className={slideClass}>
              <div
                // 보장용 클릭 핸들러(옵션 slideToClickedSlide가 동작 안 하는 환경 대비)
                onClick={() => {
                  hourSwiperRef.current?.slideToLoop(i, 200);
                  // 상태/콜백 업데이트는 onActiveIndexChange에서 일관 처리
                }}
                className={`${cellBase} ${i === hour ? 'rounded-l-[0.25rem] bg-gray700 text-main' : 'text-gray300'}`}>
                {pad2(i)}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Minute */}
      <div className="relative h-[5.4375rem] w-[5.1563rem]">
        <Swiper
          {...common}
          onSwiper={(sw) => (minuteSwiperRef.current = sw)}
          initialSlide={minute}
          onActiveIndexChange={(sw) => {
            const val = sw.realIndex % MINUTE_RANGE;
            if (val !== minute) {
              setMinute(val);
              onChange(hour, val);
            }
          }}
          className="h-full">
          {Array.from({ length: MINUTE_RANGE }, (_, i) => (
            <SwiperSlide key={`m-${i}`} className={slideClass}>
              <div
                onClick={() => {
                  minuteSwiperRef.current?.slideToLoop(i, 200);
                }}
                className={`${cellBase} ${i === minute ? 'rounded-r-[0.25rem] bg-gray700 text-main' : 'text-gray300'}`}>
                {pad2(i)}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}
