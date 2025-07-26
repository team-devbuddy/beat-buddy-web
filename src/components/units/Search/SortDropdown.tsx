'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DropdownProps } from '@/lib/types';
import { dropdownVariants } from '@/lib/animation';
import { motion, AnimatePresence } from 'framer-motion';

function Dropdown({
  options,
  selectedOption,
  setSelectedOption,
  label,
  isThirdDropdown = false,
}: DropdownProps & { isThirdDropdown?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownTop, setDropdownTop] = useState(true); // 드롭다운의 위치를 제어하는 상태
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (isThirdDropdown && options.length > 0 && !selectedOption) {
      setSelectedOption(options[0]);
    }
  }, [isThirdDropdown, options, selectedOption, setSelectedOption]);

  useEffect(() => {
    if (isOpen && buttonRef.current && dropdownRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect();
      const dropdownRect = dropdownRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;

      if (buttonRect.bottom + dropdownRect.height > viewportHeight) {
        setDropdownTop(false);
      } else {
        setDropdownTop(true);
      }
    }
  }, [isOpen]);

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    if (option === selectedOption) {
      setSelectedOption(''); // 선택된 옵션을 다시 클릭하면 선택 해제
    } else {
      setSelectedOption(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center">
        <button
          ref={buttonRef}
          type="button"
          className={`inline-flex w-full cursor-pointer justify-between rounded-[0.5rem] py-[0.25rem] pl-[0.5rem] pr-[0.25rem] text-[0.8125rem] focus:outline-none ${
            isThirdDropdown
              ? 'border-transparent bg-transparent text-gray300'
              : selectedOption
                ? 'border-sub2 bg-sub2 text-main2'
                : 'border-gray700 bg-gray700 text-gray300'
          }`}
          onClick={toggleDropdown}>
          <div className="flex items-center gap-[0.25rem]">
            <span>{selectedOption || label}</span>
            <Image
              src={
                selectedOption && !isThirdDropdown
                  ? '/icons/chevron.forward-pink.svg'
                  : '/icons/keyboard_arrow_down.svg'
              }
              alt="arrow down"
              width={16}
              height={16}
            />
          </div>
        </button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-black bg-opacity-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial="closed"
              animate="open"
              exit="closed"
              variants={dropdownVariants}
              className={`absolute whitespace-nowrap ${dropdownTop ? 'top-full' : 'bottom-full'} ${isThirdDropdown ? 'right-0' : 'left-0'} z-50 mt-2 origin-top-right rounded-md bg-gray700 shadow-lg`}>
              <div className="flex max-h-52 flex-col overflow-y-auto hide-scrollbar">
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`block text-center text-[0.8125rem] text-gray300 ${
                      option === selectedOption ? 'font-bold text-main' : ''
                    }`}
                    onClick={() => handleOptionClick(option)}>
                    <div
                      className={`flex items-center justify-center px-[1.12rem] py-[0.56rem] hover:bg-gray500 ${
                        index === 0 ? 'rounded-t-md' : index === options.length - 1 ? 'rounded-b-md' : ''
                      }`}>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Dropdown;
