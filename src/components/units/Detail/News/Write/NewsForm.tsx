'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface NewsFormProps {
  formData: {
    eventName: string;
    date: { year: string; month: string; day: string };
    location: string;
    description: string;
  };
  onFormChange: (field: string, value: string | { year: string; month: string; day: string }) => void;
}

const NewsForm: React.FC<NewsFormProps> = ({ formData, onFormChange }) => {
  const [isYearDropdownOpen, setIsYearDropdownOpen] = useState(false);
  const [isMonthDropdownOpen, setIsMonthDropdownOpen] = useState(false);
  const [isDayDropdownOpen, setIsDayDropdownOpen] = useState(false);
  const [remainingDays, setRemainingDays] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const [isFetching, setIsFetching] = useState(false);

  const fetchSearchResults = async (keyword: string) => {
    if (!keyword) {
      setSearchResults([]);
      return;
    }

    setIsFetching(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          keyword: [keyword],
        }),
      });
      const data = await response.json();
      if (data && Array.isArray(data.results)) {
        setSearchResults(data.results.map((result: any) => result.name)); // 결과에서 장소 이름만 추출
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setSearchResults([]);
    } finally {
      setIsFetching(false);
    }
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const keyword = e.target.value;
    onFormChange('location', keyword);
    fetchSearchResults(keyword); // 장소 검색 실행
  };

  const handleSearchResultClick = (result: string) => {
    onFormChange('location', result); // 선택한 장소로 값 설정
    setSearchResults([]); // 검색 결과 초기화
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

  return (
    <div className="relative space-y-6 bg-BG-black px-4 py-6">
      
      {/* 이벤트명 */}
      <div>
        <label className="mb-[0.62rem] block text-body1-16-bold text-white">이벤트명</label>
        <input
          type="text"
          value={formData.eventName}
          onChange={(e) => onFormChange('eventName', e.target.value)}
          placeholder="이벤트명을 입력해주세요."
          className={`w-full rounded-xs border bg-gray500 px-4 py-3 text-body2-15-medium  placeholder-gray300 outline-none ${getBorderStyle(
            formData.eventName,
          )} ${getTextColor(formData.date.year)}`}
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

      {/* 장소 */}
      <div>
        <label className="mb-[0.62rem] block text-body1-16-bold text-white">장소</label>
        <input
          type="text"
          value={formData.location}
          onChange={handleLocationChange}
          placeholder="장소 정보를 입력해주세요."
          className={`w-full rounded-xs border bg-gray500 px-4 py-3 text-body2-15-medium  placeholder-gray300 outline-none ${getBorderStyle(
            formData.location,
          )} ${getTextColor(formData.location)}`}
        />
      {/* 검색 결과 */}
      {isFetching && <div className="mt-2 text-gray300">검색 중...</div>}
        {!isFetching && searchResults.length > 0 && (
          <ul className="mt-2 max-h-40 overflow-y-auto rounded-xs border bg-gray500 shadow-lg">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="cursor-pointer px-4 py-2 hover:bg-gray400"
                onClick={() => handleSearchResultClick(result)}
              >
                {result}
              </li>
            ))}
          </ul>
        )}
      </div>

      

      {/* 소개 */}
      <div className="pb-14">
        <label className="mb-[0.62rem] block text-body1-16-bold text-white">소개</label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormChange('description', e.target.value)}
          placeholder="이벤트 소개를 입력해주세요."
          rows={4}
          className={`w-full resize-none rounded-xs border bg-gray500 px-4 py-3 text-body2-15-medium  placeholder-gray300 outline-none ${getBorderStyle(
            formData.description,
          )} ${getTextColor(formData.description)}`}
        />
      </div>
    </div>
  );
};

export default NewsForm;
