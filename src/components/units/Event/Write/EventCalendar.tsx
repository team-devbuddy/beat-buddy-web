// EventCalendar.tsx 파일

'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface EventCalendarProps {
  selectedDate: string;
  onSelectDate: (date: string) => void;
    onClose: () => void;
    minDate?: string;
    maxDate?: string;
}

export default function EventCalendar({ selectedDate, onSelectDate, onClose, minDate, maxDate }: EventCalendarProps) {
  const [localSelectedDate, setLocalSelectedDate] = useState(selectedDate);
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());

  const todayString = `${today.getFullYear()}. ${String(today.getMonth() + 1).padStart(2, '0')}. ${String(today.getDate()).padStart(2, '0')}`;

  useEffect(() => {
    setLocalSelectedDate(selectedDate); // 외부 selectedDate 바뀌면 반영
  }, [selectedDate]);

  const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
  const getFirstDayOfMonth = (y: number, m: number) => new Date(y, m, 1).getDay();

  const handlePrevMonth = () => {
    if (month === 0) {
      setYear((prev) => prev - 1);
      setMonth(11);
    } else {
      setMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (month === 11) {
      setYear((prev) => prev + 1);
      setMonth(0);
    } else {
      setMonth((prev) => prev + 1);
    }
  };
  const handleSelectDate = (day: number) => {
    const selected = `${year}. ${String(month + 1).padStart(2, '0')}. ${String(day).padStart(2, '0')}`;
    setLocalSelectedDate(selected); // ✅ 즉시 스타일 반영
    onSelectDate(selected); // 상위에도 전달 (startDate는 외부 클릭 시 적용됨)
  };    
  // 🔥 여기가 수정된 캘린더 렌더링 로직입니다.
  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const prevMonth = month === 0 ? 11 : month - 1;
    const prevYear = month === 0 ? year - 1 : year;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);

    const totalCells = firstDay + daysInMonth;
    const nextDays = (7 - (totalCells % 7)) % 7;

      const calendarDays = [];
      
      const isBeforeMinDate = (day: number) => {
        if (!minDate) return false;
        const current = new Date(year, month, day);
        const min = new Date(minDate);
        return current < min;
      };
      const isAfterMaxDate = (day: number) => {
        if (!maxDate) return false;
        const current = new Date(year, month, day);
        const max = new Date(maxDate);
        return current > max;
      };
    // 1. 이전 달 날짜 채우기
    for (let i = firstDay - 1; i >= 0; i--) {
      const day = prevMonthDays - i;
      calendarDays.push(
        <div
          key={`prev-${day}`}
          className="flex aspect-square cursor-default items-center justify-center text-[0.75rem] text-gray400">
          {day}
        </div>,
      );
    }

    // 2. 현재 달 날짜
    for (let day = 1; day <= daysInMonth; day++) {
      const formatted = `${year}. ${String(month + 1).padStart(2, '0')}. ${String(day).padStart(2, '0')}`;
      const isToday = formatted === todayString;
      const isSelected = localSelectedDate === formatted;
      const isDisabled = isBeforeMinDate(day);
      const isDisabledMax = isAfterMaxDate(day);
      calendarDays.push(
        <div
          key={`${year}-${month + 1}-${day}`}
          className={`flex aspect-square cursor-pointer items-center justify-center rounded-[0.75rem] text-[0.75rem] transition ${
            isSelected ? 'bg-main text-white' : isToday ? 'text-main' : isDisabled ? 'text-gray400 cursor-not-allowed' : isDisabledMax ? 'text-gray400 cursor-not-allowed' : 'hover:bg-gray700'
          }`}
          onClick={() => {
            if (!isDisabled && !isDisabledMax) handleSelectDate(day);
          }}>
          {day}
        </div>,
      );
    }

    // 3. 다음 달 날짜 채우기
    for (let i = 1; i <= nextDays; i++) {
      calendarDays.push(
        <div
          key={`next-${i}`}
          className="flex aspect-square cursor-default items-center justify-center text-[0.75rem] text-gray400">
          {i}
        </div>,
      );
    }

    return calendarDays;
  };
  return (
    <div className="bg-gray900 relative w-full max-w-[17rem] rounded-md border border-gray600 p-3 shadow-md">
      {/* 헤더 */}
      <div className="relative mb-4 flex items-center justify-center text-white">
        <div className="absolute left-16">
          <Image
            src="/icons/chevron-left-1.svg"
            alt="chevron-left"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={handlePrevMonth}
          />
        </div>
        <span className="font-suit text-[0.875rem] font-semibold">
          {year}년 {month + 1}월
        </span>
        <div className="absolute right-16">
          <Image
            src="/icons/chevron-left-2.svg"
            alt="chevron-right"
            width={18}
            height={18}
            className="cursor-pointer"
            onClick={handleNextMonth}
          />
        </div>
      </div>

      {/* 요일 + 날짜 */}
      <div className="grid grid-cols-7 gap-[2px] text-center text-[0.75rem] text-gray200">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="flex aspect-square items-center justify-center font-bold">
            {day}
          </div>
        ))}
        {renderCalendar()}
      </div>
    </div>
  );
}
