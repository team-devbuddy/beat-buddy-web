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

  const hourMidIndex = selectedHour + HOUR_RANGE * Math.floor(MULTIPLIER / 2);
  const minuteMidIndex = selectedMinute + MINUTE_RANGE * Math.floor(MULTIPLIER / 2);

  useEffect(() => {
    scrollToItem(hourRef, hourMidIndex);
    scrollToItem(minuteRef, minuteMidIndex);
    setInternalHour(selectedHour);
    setInternalMinute(selectedMinute);
    onChange(selectedHour, selectedMinute);
  }, []);

  const scrollToItem = (ref: React.RefObject<HTMLDivElement>, index: number) => {
    const el = ref.current;
    if (!el) return;
    el.scrollTo({
      top: index * ITEM_HEIGHT - CENTER_OFFSET,
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
    const index = Math.round((scrollTop + CENTER_OFFSET) / ITEM_HEIGHT);
    const value = ((index % range) + range) % range;

    setFn(value);
    scrollToItem({ current: target }, index); // 중앙 맞춤 재조정

    if (type === 'hour') {
      onChange(value, internalMinute);
    } else {
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
      if (type === 'hour') {
        setInternalHour(value);
        onChange(value, internalMinute);
        scrollToItem(ref, value + HOUR_RANGE * Math.floor(MULTIPLIER / 2));
      } else {
        setInternalMinute(value);
        onChange(internalHour, value);
        scrollToItem(ref, value + MINUTE_RANGE * Math.floor(MULTIPLIER / 2));
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
