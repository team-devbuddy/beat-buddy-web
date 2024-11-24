'use client';

import React, { useState } from 'react';
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

  const generateYearOptions = () => Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i);
  const generateMonthOptions = () => Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
  const generateDayOptions = () => Array.from({ length: 31 }, (_, i) => (i + 1).toString().padStart(2, '0'));

  const handleDateChange = (field: string, value: string) => {
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
          className={`w-full rounded-xs border bg-gray500 px-4 py-3 text-body2-15-medium text-gray300 placeholder-gray300 outline-none ${getBorderStyle(
            formData.eventName,
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
              className={`flex items-center  rounded-xs border bg-gray500 px-4 py-3 text-center text-body2-15-medium text-gray300 outline-none ${getBorderStyle(
                formData.date.year,
              )}`}
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
                    className="absolute z-20 mt-2 max-h-40 w-full overflow-y-auto rounded-xs border bg-gray500 text-gray300 shadow-lg">
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
          <span className="flex items-center text-gray300">년</span>

          {/* Month Dropdown */}
          <div className="">
            <button
              className={`flex items-center justify-between rounded-xs border bg-gray500 px-4 py-3 text-center text-body2-15-medium text-gray300 outline-none ${getBorderStyle(
                formData.date.month,
              )}`}
              onClick={() => toggleDropdown('month')}>
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
                    className="absolute z-20 mt-2 max-h-40 w-full overflow-y-auto rounded-xs border bg-gray500 text-gray300 shadow-lg">
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
          <span className="flex items-center text-gray300">월</span>

          {/* Day Dropdown */}
          <div className="">
            <button
              className={`flex items-center justify-between rounded-xs border bg-gray500 px-4 py-3 text-center text-body2-15-medium text-gray300 outline-none ${getBorderStyle(
                formData.date.day,
              )}`}
              onClick={() => toggleDropdown('day')}>
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
                    className="absolute z-20 mt-2 max-h-40 w-full overflow-y-auto rounded-xs border bg-gray500 text-gray300 shadow-lg">
                    {generateDayOptions().map((day) => (
                      <li
                        key={day}
                        onClick={() => {
                          handleDateChange('day', day);
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
          <span className="flex items-center text-gray300">일</span>
        </div>
      </div>

      {/* 장소 */}
      <div>
        <label className="mb-[0.62rem] block text-body1-16-bold text-white">장소</label>
        <input
          type="text"
          value={formData.location}
          onChange={(e) => onFormChange('location', e.target.value)}
          placeholder="장소 정보를 입력해주세요."
          className={`w-full rounded-xs border bg-gray500 px-4 py-3 text-body2-15-medium text-gray300 placeholder-gray300 outline-none ${getBorderStyle(
            formData.location,
          )}`}
        />
      </div>

      {/* 소개 */}
      <div className="pb-14">
        <label className="mb-[0.62rem] block text-body1-16-bold text-white">소개</label>
        <textarea
          value={formData.description}
          onChange={(e) => onFormChange('description', e.target.value)}
          placeholder="이벤트 소개를 입력해주세요."
          rows={4}
          className={`w-full resize-none rounded-xs border bg-gray500 px-4 py-3 text-body2-15-medium text-gray300 placeholder-gray300 outline-none ${getBorderStyle(
            formData.description,
          )}`}
        />
      </div>
    </div>
  );
};

export default NewsForm;
