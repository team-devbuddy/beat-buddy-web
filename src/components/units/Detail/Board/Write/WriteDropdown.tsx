'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface WriteDropdownProps {
  value: string; // 드롭다운에서 선택된 값
  options: string[]; // 드롭다운 옵션 목록
  onChange: (value: string) => void; // 값 변경 핸들러
  px?: string; // padding-x 값
  py?: string; // padding-y 값
  placeholder?: string; // 선택되지 않았을 때 표시될 기본 값
}

const WriteDropdown: React.FC<WriteDropdownProps> = ({
  value,
  options,
  onChange,
  px = 'px-4',
  py = 'py-3',
  placeholder = '00',
}) => {
  const [isOpen, setIsOpen] = React.useState(false);

  const toggleDropdown = () => setIsOpen((prev) => !prev);
  const closeDropdown = () => setIsOpen(false);

  return (
    <div className="relative flex items-center space-x-2">
      <div className="relative w-full">
        <button
          onClick={toggleDropdown}
          className={`flex w-full items-center justify-between rounded-xs border border-gray300 bg-gray700 ${px} ${py} text-gray300 focus:outline-none ${
            value ? 'border border-main' : ''
          }`}>
          {value || placeholder}
          <img
            src="/icons/chevron-down.svg"
            alt="드롭다운"
            className={`ml-[0.38rem] h-4 w-4 transform ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>
        <AnimatePresence>
          {isOpen && (
            <>
              <motion.div
                className="fixed inset-0 z-10 bg-black/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeDropdown}></motion.div>
              <motion.ul
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute z-20 mt-2 max-h-40 w-full overflow-y-auto rounded-xs border bg-gray500 text-gray300 shadow-lg">
                {options.map((option) => (
                  <li
                    key={option}
                    onClick={() => {
                      onChange(option);
                      closeDropdown();
                    }}
                    className="cursor-pointer px-4 py-3 hover:bg-gray400">
                    {option}
                  </li>
                ))}
              </motion.ul>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WriteDropdown;
