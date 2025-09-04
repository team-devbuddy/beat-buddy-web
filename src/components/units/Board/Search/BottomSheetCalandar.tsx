'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { searchEventsByPeriod } from '@/lib/actions/event-controller/searchEventsByPeriod';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';

interface CalendarModalProps {
  onClose: (dateRange?: { startDate: string; endDate: string }) => void;
  onSearchResults?: (results: any) => void;
  initialStartDate?: string;
  initialEndDate?: string;
}

interface SelectedDate {
  year: number;
  month: number; // 0~11
  day: number;
}

const BottomSheetCalendar = ({ onClose, onSearchResults, initialStartDate, initialEndDate }: CalendarModalProps) => {
  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [startDay, setStartDay] = useState<SelectedDate | null>(null);
  const [endDay, setEndDay] = useState<SelectedDate | null>(null);
  const [clickCount, setClickCount] = useState(0);
  const accessToken = useRecoilValue(accessTokenState);

  // 초기 날짜 설정
  useEffect(() => {
    console.log('🔍 초기 날짜 설정:', { initialStartDate, initialEndDate });

    if (initialStartDate && initialEndDate) {
      const startDate = new Date(initialStartDate);
      const endDate = new Date(initialEndDate);

      console.log('🔍 Date 객체 변환:', { startDate, endDate });
      console.log('🔍 Date 유효성:', {
        startValid: !isNaN(startDate.getTime()),
        endValid: !isNaN(endDate.getTime()),
      });

      if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
        const startDay = {
          year: startDate.getFullYear(),
          month: startDate.getMonth(),
          day: startDate.getDate(),
        };

        const endDay = {
          year: endDate.getFullYear(),
          month: endDate.getMonth(),
          day: endDate.getDate(),
        };

        console.log('🔍 설정할 날짜:', { startDay, endDay });

        setStartDay(startDay);
        setEndDay(endDay);
        setClickCount(2); // 두 날짜 모두 선택된 상태
      } else {
        console.error('🔍 날짜 변환 실패:', { initialStartDate, initialEndDate });
      }
    }
  }, [initialStartDate, initialEndDate]);

  // 날짜를 YYYYMMDD 형식으로 변환하는 함수
  const formatDateForAPI = (date: SelectedDate) => {
    const year = date.year;
    const month = String(date.month + 1).padStart(2, '0');
    const day = String(date.day).padStart(2, '0');
    return `${year}${month}${day}`;
  };

  // 바텀시트가 닫힐 때 선택된 날짜를 상위 컴포넌트로 전달
  const handleClose = () => {
    if (startDay && endDay) {
      const startDate = formatDateForAPI(startDay);
      const endDate = formatDateForAPI(endDay);
      console.log('날짜가 선택됨:', startDate, '~', endDate);

      // YYYY-MM-DD 형식으로 변환해서 전달
      const formatToYYYYMMDD = (dateString: string) => {
        return `${dateString.substring(0, 4)}-${dateString.substring(4, 6)}-${dateString.substring(6, 8)}`;
      };

      onClose({
        startDate: formatToYYYYMMDD(startDate),
        endDate: formatToYYYYMMDD(endDate),
      });
    } else {
      onClose();
    }
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if ((e.target as HTMLElement).id === 'calendar-backdrop') {
        handleClose();
      }
    };
    window.addEventListener('mousedown', handleOutsideClick);
    return () => window.removeEventListener('mousedown', handleOutsideClick);
  }, [handleClose]);

  const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

  const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const getPrevMonthInfo = () => {
    const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    const prevMonthDays = getDaysInMonth(prevYear, prevMonth);
    return { prevMonth, prevYear, prevMonthDays };
  };

  const goToPrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleDayClick = (day: number) => {
    const clickedDate = { year: currentYear, month: currentMonth, day };

    // 이미 선택된 시작일과 같은 날짜를 클릭한 경우
    if (
      startDay &&
      !endDay &&
      startDay.year === clickedDate.year &&
      startDay.month === clickedDate.month &&
      startDay.day === clickedDate.day
    ) {
      // 하루 검색: 시작일과 종료일을 같게 설정
      setEndDay(clickedDate);
      setClickCount(2);
      return;
    }

    // 시작일과 종료일이 모두 선택된 상태에서 클릭한 경우 초기화
    if (startDay && endDay) {
      setStartDay(clickedDate);
      setEndDay(null);
      setClickCount(1);
      return;
    }

    const nextClickCount = clickCount + 1;

    if (nextClickCount % 2 === 1) {
      // 첫 번째 클릭: 시작일 설정
      setStartDay(clickedDate);
      setEndDay(null);
    } else {
      // 두 번째 클릭: 종료일 설정
      if (
        startDay &&
        new Date(clickedDate.year, clickedDate.month, clickedDate.day) <
          new Date(startDay.year, startDay.month, startDay.day)
      ) {
        // 클릭한 날짜가 시작일보다 이전인 경우 순서 바꿈
        setEndDay(startDay);
        setStartDay(clickedDate);
      } else {
        setEndDay(clickedDate);
      }
    }

    setClickCount(nextClickCount);
  };

  const renderCalendar = () => {
    const totalDays = getDaysInMonth(currentYear, currentMonth);
    const startDayOfMonth = getFirstDayOfMonth(currentYear, currentMonth);
    const days: JSX.Element[] = [];
    const { prevMonthDays } = getPrevMonthInfo();

    for (let i = startDayOfMonth - 1; i >= 0; i--) {
      days.push(
        <div
          key={`prev-${i}`}
          className="flex h-[45px] w-[45px] items-center justify-center font-suit text-calendar-date text-gray-400">
          {prevMonthDays - i}
        </div>,
      );
    }

    for (let day = 1; day <= totalDays; day++) {
      const isToday =
        day === today.getDate() && currentMonth === today.getMonth() && currentYear === today.getFullYear();

      const isStart =
        startDay && startDay.year === currentYear && startDay.month === currentMonth && startDay.day === day;

      const isEnd = endDay && endDay.year === currentYear && endDay.month === currentMonth && endDay.day === day;

      const isBetween =
        startDay &&
        endDay &&
        new Date(currentYear, currentMonth, day) > new Date(startDay.year, startDay.month, startDay.day) &&
        new Date(currentYear, currentMonth, day) < new Date(endDay.year, endDay.month, endDay.day);

      const classes = `
        w-[45px] h-[45px] flex items-center justify-center rounded-[0.7rem] text-calendar-date cursor-pointer font-suit
        ${isStart || isEnd ? 'bg-main text-white' : isBetween ? 'bg-sub1 text-white' : isToday ? 'text-main' : 'text-gray100'}
        transition-all duration-300
      `;

      days.push(
        <div key={`curr-${day}`} onClick={() => handleDayClick(day)} className={classes}>
          {day}
        </div>,
      );
    }

    const remaining = 42 - days.length;
    const nextDays = Math.min(7 - (days.length % 7 || 7), remaining);

    for (let i = 1; i <= nextDays; i++) {
      days.push(
        <div
          key={`next-${i}`}
          className="flex h-[45px] w-[45px] items-center justify-center font-suit text-calendar-date text-gray-400">
          {i}
        </div>,
      );
    }

    while (days.length < 42) {
      days.push(<div key={`empty-${days.length}`} className="h-[40px] w-[40px]" />);
    }

    return days;
  };

  return (
    <div id="calendar-backdrop" className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-60">
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        exit={{ y: 300 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-[600px] rounded-t-[1.5rem] bg-gray700 px-[1.25rem] py-[1.12rem]">
        <div className="relative mb-4 flex items-center justify-center text-white">
          <div className="absolute left-24">
            <Image
              src="/icons/calendar-left.svg"
              alt="chevron-left"
              width={28}
              height={28}
              className="cursor-pointer"
              onClick={goToPrevMonth}
            />
          </div>
          <span className="text-button-bold">
            {currentYear}년 {currentMonth + 1}월
          </span>
          <div className="absolute right-24">
            <Image
              src="/icons/calendar-right.svg"
              alt="chevron-right"
              width={28}
              height={28}
              className="cursor-pointer"
              onClick={goToNextMonth}
            />
          </div>
        </div>

        <div className="grid grid-cols-7 justify-items-center gap-1">
          {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
            <div
              key={day}
              className="text-calendar-date-bold flex h-[40px] w-[40px] items-center justify-center text-center font-suit font-semibold text-white">
              {day}
            </div>
          ))}
          {renderCalendar()}
        </div>
      </motion.div>
    </div>
  );
};

export default BottomSheetCalendar;
