'use client';

import { useState, useEffect } from 'react';
import WriteDropdown from './WriteDropdown'; // WriteDropdown 컴포넌트
import WriteField from './WriteField'; // WriteField 컴포넌트
import { motion, AnimatePresence } from 'framer-motion';

interface BoardFormProps {
  formData: {
    title: string;
    date: { year: string; month: string; day: string };
    minParticipants: string;
    maxParticipants: string;
    cost: string;
    content: string;
    location: string;
    venue: string;
  };
  onFormChange: (field: string, value: string | { year: string; month: string; day: string }) => void;
  onTypeChange: (type: string) => void;
}

const locations = ['홍대', '이태원', '강남&신사', '압구정', '기타']; // 지역 옵션
const venues = ['B1', 'PAUST', '와이키키', 'HIPHADI', 'SABOTAGE']; // dummy venues

const BoardForm: React.FC<BoardFormProps> = ({ formData, onFormChange, onTypeChange }) => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const [boardType, setBoardType] = useState('자유 게시판');
  const boardOptions = ['자유 게시판', '조각 게시판'];

  const handleBoardTypeChange = (value: string) => {
    setBoardType(value);
    onTypeChange(value === '조각 게시판' ? 'piece' : 'free');
  };

  // 1인당 비용 계산
  const calculatePerPersonCost = () => {
    const cost = parseInt(formData.cost.replace(/,/g, ''), 10) || 0; // 총 비용
    const participants = parseInt(formData.maxParticipants, 10) || 0; // 최대 인원
    return participants > 0 ? Math.round(cost / participants).toLocaleString() : '0';
  };
  
  const handleInputChange = (field: string, value: string) => {
    onFormChange(field, value);
    setErrorMessage('');
  };
  
  const generateYearOptions = () => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, i) => currentYear + i);
  };

  const generateMonthOptions = () => {
    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    const selectedYear = parseInt(formData.date.year);

    if (selectedYear === currentYear) {
      // 현재 년도인 경우, 현재 월까지 선택 가능
      return Array.from({ length: 12 }, (_, i) => 
        (i + 1).toString().padStart(2, '0')
      ).filter(month => parseInt(month) >= currentMonth);
    }
    // 미래 년도인 경우, 모든 월 선택 가능
    return Array.from({ length: 12 }, (_, i) => 
      (i + 1).toString().padStart(2, '0')
    );
  };

  const generateDayOptions = () => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    const selectedYear = parseInt(formData.date.year);
    const selectedMonth = parseInt(formData.date.month);
    
    // 선택된 연월의 마지막 날짜 계산
    const lastDay = new Date(selectedYear, selectedMonth, 0).getDate();
    
    return Array.from({ length: lastDay }, (_, i) => {
      const day = i + 1;
      
      // 현재 년도이고 현재 월인 경우
      if (selectedYear === currentYear && selectedMonth === currentMonth) {
        // 오늘부터의 날짜 반환 (오늘 포함)
        return day >= currentDay ? day.toString().padStart(2, '0') : null;
      }
      
      // 미래 월인 경우 모든 날짜 반환
      return day.toString().padStart(2, '0');
    }).filter(Boolean);
  };

  // 날짜가 모두 선택되었을 때 D-day 계산
  useEffect(() => {
    if (formData.date.year && formData.date.month && formData.date.day) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const selectedDate = new Date(
        parseInt(formData.date.year),
        parseInt(formData.date.month) - 1,
        parseInt(formData.date.day)
      );
      selectedDate.setHours(0, 0, 0, 0);

      const timeDiff = selectedDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
      setRemainingDays(daysDiff);
    } else {
      setRemainingDays(null);
    }
  }, [formData.date.year, formData.date.month, formData.date.day]);

  const handleDateChange = (field: string, value: string) => {
    // 연도를 선택할 때 에러 메시지 초기화
    if (field === 'year') {
      setErrorMessage('');
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const selectedDate = new Date(
      field === 'year' ? parseInt(value) : parseInt(formData.date.year),
      field === 'month' ? parseInt(value) - 1 : parseInt(formData.date.month) - 1,
      field === 'day' ? parseInt(value) : parseInt(formData.date.day)
    );
    selectedDate.setHours(0, 0, 0, 0);

    // 선택한 날짜가 오늘보다 이전인 경우 변경하지 않음 (오늘은 허용)
    if (selectedDate.getTime() < today.getTime()) {
      return;
    }

    onFormChange('date', { ...formData.date, [field]: value });
  };

  const closeAllDropdowns = () => {
    setIsYearDropdownOpen(false);
    setIsMonthDropdownOpen(false);
    setIsDayDropdownOpen(false);
  };

  const toggleDropdown = (type: 'year' | 'month' | 'day') => {
    if (type === 'year') {
      setIsYearDropdownOpen((prev) => !prev);
      setIsMonthDropdownOpen(false);
      setIsDayDropdownOpen(false);
    } else if (type === 'month') {
      setIsMonthDropdownOpen((prev) => !prev);
      setIsYearDropdownOpen(false);
      setIsDayDropdownOpen(false);
    } else {
      setIsDayDropdownOpen((prev) => !prev);
      setIsYearDropdownOpen(false);
      setIsMonthDropdownOpen(false);
    }
  };

  const getBorderStyle = (value: string | undefined) => (value ? 'border-main' : 'border-gray300');
  const getTextColor = (value: string | undefined) => (value ? 'text-gray100' : 'text-gray300');

  const handleMonthClick = () => {
    if (!formData.date.year) {
      setErrorMessage('연도를 먼저 선택해주세요.');
      return;
    }
    setErrorMessage('');
    toggleDropdown('month');
  };

  const handleDayClick = () => {
    if (!formData.date.year) {
      setErrorMessage('연도를 먼저 선택해주세요.');
      return;
    }
    if (!formData.date.month) {
      setErrorMessage('월을 먼저 선택해주세요.');
      return;
    }
    setErrorMessage('');
    toggleDropdown('day');
  };

  const formatCost = (value: string) => {
    // 숫자가 아닌 문자 제거
    const numbers = value.replace(/[^\d]/g, '');
    // 3자리마다 콤마 추가
    return numbers.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  };

  const handleCostChange = (value: string) => {
    const formattedValue = formatCost(value);
    onFormChange('cost', formattedValue);
  };

  return (
    <div className="min-h-screen bg-BG-black px-4 py-6 text-white">
      {/* 게시판 선택 */}
      <div className="relative mb-7">
        <WriteDropdown 
          value={boardType} 
          options={boardOptions} 
          onChange={(value) => {
            setBoardType(value);
            handleBoardTypeChange(value);
          }} 
        />
      </div>
      {boardType === '조각 게시판' && (
        <>
          {/* 지역 및 베뉴 */}
          <div className="mb-6">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">지역 및 베뉴</label>
            <div className="grid grid-cols-2 gap-4">
              <WriteDropdown
                value={formData.location}
                options={locations}
                onChange={(value) => handleInputChange('location', value)}
                placeholder="지역 선택"
                px="px-4"
                py="py-3"
              />
              <WriteDropdown
                value={formData.venue}
                options={venues}
                onChange={(value) => handleInputChange('venue', value)}
                placeholder="베뉴 선택"
                px="px-4"
                py="py-3"
              />
            </div>
          </div>

          {/* 글 제목 */}
          <div className="mb-6">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">글 제목</label>
            <WriteField
              value={formData.title}
              onChange={(value) => handleInputChange('title', value)}
              placeholder="글 제목을 입력해주세요."
              className={`w-full rounded-xs border px-4 py-3 focus:outline-none ${getBorderStyle(
                formData.title
              )}`}
            />
          </div>

      {/* 일자 */}
      <div>
        <label className="mb-[0.62rem] block text-body1-16-bold text-white">일자</label>
        <div className="flex justify-between space-x-2">
          {/* Year Dropdown */}
          <div className="">
            <button
              className={`flex items-center rounded-xs border bg-gray500 px-4 py-3 text-center text-body2-15-medium outline-none ${getBorderStyle(
                formData.date.year,
              )} ${getTextColor(formData.date.year)}`}
              onClick={() => toggleDropdown('year')}>
              {formData.date.year || '0000'}
              <img
                src="/icons/chevron-down.svg"
                alt="드롭다운"
                className={`h-4 w-4 ml-[0.38rem] transform ${isYearDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {isYearDropdownOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 z-10 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeAllDropdowns}></motion.div>
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute z-20 mt-2 max-h-40 w-24 overflow-y-auto rounded-xs border bg-gray500 text-gray300 shadow-lg">
                    {generateYearOptions().map((year) => (
                      <li
                        key={year}
                        onClick={() => {
                          handleDateChange('year', year.toString());
                          closeAllDropdowns();
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-gray400">
                        {year}
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>
          <span className="flex items-center text-gray100">년</span>

          {/* Month Dropdown */}
          <div className="">
            <button
              className={`flex items-center rounded-xs border bg-gray500 px-4 py-3 text-center text-body2-15-medium  outline-none ${getBorderStyle(
                formData.date.month,
              )} ${getTextColor(formData.date.month)}`}
              onClick={handleMonthClick}>
              {formData.date.month || '00'}
              <img
                src="/icons/chevron-down.svg"
                alt="드롭다운"
                className={`h-4 w-4 ml-[0.38rem] transform ${isMonthDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {isMonthDropdownOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 z-10 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeAllDropdowns}></motion.div>
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute z-20 mt-2 max-h-40 w-[4.7rem] overflow-y-auto rounded-xs border bg-gray500 text-gray300 shadow-lg">
                    {generateMonthOptions().map((month) => (
                      <li
                        key={month}
                        onClick={() => {
                          handleDateChange('month', month);
                          closeAllDropdowns();
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-gray400">
                        {month}
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>
          <span className="flex items-center text-gray100">월</span>

          {/* Day Dropdown */}
          <div className="">
            <button
              className={`flex items-center rounded-xs border bg-gray500 px-4 py-3 text-center text-body2-15-medium  outline-none ${getBorderStyle(
                formData.date.day,
              )} ${getTextColor(formData.date.day)}`}
              onClick={handleDayClick}>
              {formData.date.day || '00'}
              <img
                src="/icons/chevron-down.svg"
                alt="드롭다운"
                className={`h-4 w-4 ml-[0.38rem] transform ${isDayDropdownOpen ? 'rotate-180' : ''}`}
              />
            </button>
            <AnimatePresence>
              {isDayDropdownOpen && (
                <>
                  <motion.div
                    className="fixed inset-0 z-10 bg-black/50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={closeAllDropdowns}></motion.div>
                  <motion.ul
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute z-20 mt-2 max-h-40 w-[4.9rem] overflow-y-auto rounded-xs border bg-gray500 text-gray300 shadow-lg">
                    {generateDayOptions().map((day) => (
                      <li
                        key={day}
                        onClick={() => {
                          if (day) {
                            handleDateChange('day', day);
                          }
                          closeAllDropdowns();
                        }}
                        className="cursor-pointer px-4 py-2 hover:bg-gray400">
                        {day}
                      </li>
                    ))}
                  </motion.ul>
                </>
              )}
            </AnimatePresence>
          </div>
          <span className="flex items-center text-gray100">일</span>
        </div>
        <div className="mt-[0.62rem]">
          {/* 에러 메시지 */}
          {errorMessage && (
            <div className="text-main text-body3-12-medium">
              {errorMessage}
            </div>
          )}
          {/* D-day 표시 */}
          {remainingDays !== null && !errorMessage && (
            <div className="text-body3-12-medium text-gray300">
              이벤트 당일까지 
              <span className="ml-[0.62rem] inline-block rounded-sm bg-gray500 text-gray100 px-[0.38rem] py-[0.13rem]">
                {remainingDays === 0 ? '당일' : `D-${remainingDays}일`}
              </span>
            </div>
          )}
        </div>
      </div>
      {/* 총 인원 */}
          <div className="mb-6">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">총 인원</label>
            <div className="flex items-center justify-between">
              <span className="text-gray300">최소</span>
              <WriteDropdown
                value={formData.minParticipants}
                options={Array.from({ length: 100 }, (_, i) => (i + 1).toString())}
                onChange={(value) => handleInputChange('minParticipants', value)}
              />
              <span className="text-gray300">명부터</span>
              <span className="text-gray300">최대</span>
              <WriteDropdown
                value={formData.maxParticipants}
                options={Array.from({ length: 100 }, (_, i) => (i + 1).toString())}
                onChange={(value) => handleInputChange('maxParticipants', value)}
              />
              <span className="text-gray300">명까지</span>
            </div>
          </div>
          {/* 총 비용 */}
          <div className="mb-6">
            <label className="mb-[0.62rem] block text-body1-16-bold text-white">총 비용</label>

            <WriteField
              value={formData.cost}
              onChange={handleCostChange}
              placeholder="총 비용을 입력해주세요."
              className={`w-full rounded-xs border px-4 py-3 focus:outline-none ${getBorderStyle(
                formData.cost
              )}`}
            />
            <div className="mt-2 text-gray300">
              {formData.cost && formData.maxParticipants && (
                <>
                  <span className='text-body3-12-medium'>{formData.maxParticipants}명일 경우 인당</span>
                  <span className="ml-[0.62rem] rounded-xs bg-gray500 py-[0.13rem] px-[0.38rem] text-gray100 text-body3-12-medium">{calculatePerPersonCost()}원</span>
                </>
              )}
            </div>
          </div>
        </>
      )}

      {/* 글쓰기 */}
      <div className="mb-6">
        <label className="mb-[0.62rem] block text-body1-16-bold text-white">글쓰기</label>
        <WriteField
          value={formData.content}
          onChange={(value) => handleInputChange('content', value)} // 수정된 핸들러
          className={`w-full rounded-xs border px-4 py-3 focus:outline-none ${getBorderStyle(
            formData.content
          )}`}          placeholder="조각 모집 관련 내용을 입력해주세요."
        ></WriteField>
      </div>
    </div>
  );
};

export default BoardForm;
