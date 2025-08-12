'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import classNames from 'classnames';

function debounce<T extends (...args: any[]) => void>(func: T, delay: number) {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return function (this: ThisParameterType<T>, ...args: Parameters<T>) {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

interface EventTimePickerProps {
  selectedHour: number;
  selectedMinute: number;
  onChange: (hour: number, minute: number) => void;
}

const MULTIPLIER = 10;
const ITEM_HEIGHT = 40;
const VISIBLE_COUNT = 3;
const CENTER_OFFSET = ITEM_HEIGHT * Math.floor(VISIBLE_COUNT / 2);
const HOUR_RANGE = 24;
const MINUTE_RANGE = 60;

export default function EventTimePicker({ selectedHour, selectedMinute, onChange }: EventTimePickerProps) {
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);

  const [internalHour, setInternalHour] = useState(selectedHour);
  const [internalMinute, setInternalMinute] = useState(selectedMinute);

  useEffect(() => {
    console.log('🕐 EventTimePicker useEffect - selectedHour:', selectedHour, 'selectedMinute:', selectedMinute);

    // 선택된 값으로 직접 스크롤
    scrollToItem(hourRef, selectedHour);
    scrollToItem(minuteRef, selectedMinute);
    setInternalHour(selectedHour);
    setInternalMinute(selectedMinute);

    console.log('🔄 내부 상태 설정 - internalHour:', selectedHour, 'internalMinute:', selectedMinute);
  }, [selectedHour, selectedMinute]);

  const scrollToItem = (ref: React.RefObject<HTMLDivElement>, value: number) => {
    const el = ref.current;
    if (!el) return;

    // 선택된 값을 중앙에 위치시키기 (VISIBLE_COUNT가 3이므로 중앙은 1번째 인덱스)
    const centerOffset = ITEM_HEIGHT; // 3개 중 중앙(1번째) 위치
    const scrollTop = value * ITEM_HEIGHT - centerOffset;

    console.log('📜 scrollToItem:', {
      value,
      ITEM_HEIGHT,
      centerOffset,
      scrollTop,
    });

    el.scrollTo({
      top: scrollTop,
      behavior: 'auto',
    });
  };

  const handleScrollEnd = (
    target: HTMLDivElement,
    range: number,
    setFn: React.Dispatch<React.SetStateAction<number>>,
    type: 'hour' | 'minute',
  ) => {
    const scrollTop = target.scrollTop;
    const centerOffset = ITEM_HEIGHT; // 3개 중 중앙(1번째) 위치
    const value = Math.round((scrollTop + centerOffset) / ITEM_HEIGHT);

    console.log(`🎯 handleScrollEnd - ${type}:`, {
      scrollTop,
      centerOffset,
      value,
      range,
      ITEM_HEIGHT,
    });

    // 선택된 값을 중앙에 맞추기
    scrollToItem({ current: target }, value);

    // 내부 상태 업데이트 후 onChange 호출
    if (type === 'hour') {
      console.log('⏰ 시간 변경 - 새로운 hour:', value, '현재 minute:', internalMinute);
      setInternalHour(value);
      onChange(value, internalMinute);
    } else {
      console.log('⏰ 분 변경 - 현재 hour:', internalHour, '새로운 minute:', value);
      setInternalMinute(value);
      onChange(internalHour, value);
    }
  };

  const handleHourScroll = useCallback(
    debounce(() => {
      if (hourRef.current) handleScrollEnd(hourRef.current, HOUR_RANGE, setInternalHour, 'hour');
    }, 100),
    [internalMinute, onChange],
  );

  const handleMinuteScroll = useCallback(
    debounce(() => {
      if (minuteRef.current) handleScrollEnd(minuteRef.current, MINUTE_RANGE, setInternalMinute, 'minute');
    }, 100),
    [internalHour, onChange],
  );

  const renderList = (
    range: number,
    currentValue: number,
    scrollHandler: () => void,
    ref: React.RefObject<HTMLDivElement>,
    type: 'hour' | 'minute',
  ) => {
    const totalCount = range * MULTIPLIER;

    const handleItemClick = (value: number) => {
      console.log(`🖱️ handleItemClick - ${type}:`, value);

      if (type === 'hour') {
        console.log('⏰ 시간 클릭 - 새로운 hour:', value, '현재 minute:', internalMinute);
        setInternalHour(value);
        scrollToItem(ref, value);
        // 즉시 onChange 호출
        onChange(value, internalMinute);
      } else {
        console.log('⏰ 분 클릭 - 현재 hour:', internalHour, '새로운 minute:', value);
        setInternalMinute(value);
        scrollToItem(ref, value);
        // 즉시 onChange 호출
        onChange(internalHour, value);
      }
    };

    return (
      <div
        ref={ref}
        className="h-[100px] w-[50px] snap-y snap-mandatory overflow-y-scroll scrollbar-hide"
        onScroll={scrollHandler}>
        {[...Array(totalCount)].map((_, i) => {
          const val = i % range;
          const isSelected = val === currentValue;

          return (
            <div
              key={i}
              onClick={() => handleItemClick(val)}
              className={classNames(
                'flex h-[40px] cursor-pointer snap-center items-center justify-center text-[0.875rem] transition-all hover:bg-gray700',
                isSelected ? 'text-main' : 'text-gray-400',
              )}>
              {String(val).padStart(2, '0')}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="bg-BG_black flex items-center justify-center rounded-xl border border-gray500 p-4 text-white">
      {renderList(HOUR_RANGE, internalHour, handleHourScroll, hourRef, 'hour')}
      {renderList(MINUTE_RANGE, internalMinute, handleMinuteScroll, minuteRef, 'minute')}
    </div>
  );
}
