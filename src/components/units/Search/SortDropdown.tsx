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
          className={`inline-flex w-full cursor-pointer justify-between rounded-sm py-[0.25rem] pl-[0.62rem] pr-[0.5rem] text-body2-15-medium focus:outline-none ${
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
                selectedOption && !isThirdDropdown ? '/icons/chevron.forward-pink.svg' : '/icons/chevron.forward.svg'
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
              className="fixed  inset-0 bg-black bg-opacity-30 z-40"
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
              className={`absolute ${dropdownTop ? 'top-full' : 'bottom-full'} ${isThirdDropdown ? 'right-0 w-[6.25rem]' : label === '장르' ? 'left-0 w-[15.5rem]' : 'left-0 w-[12.25rem]'} z-50 mt-2 origin-top-right rounded-md bg-gray700 shadow-lg`}>
              {!isThirdDropdown && (
                <div className="flex items-center gap-[0.5rem] border-b-[0.5px] border-gray400 px-[0.75rem] py-[0.5rem] text-body1-16-bold text-gray-400">
                  <Image src="/icons/OpenArrow.svg" alt="arrow down" width={24} height={24} />
                  <div>{label}</div>
                </div>
              )}
              <div className={`${label === '장르' ? 'grid grid-cols-2' : 'flex flex-col'}`}>
                {options.map((option, index) => (
                  <button
                    key={index}
                    className={`block w-full text-left text-body1-16-medium ${
                      isThirdDropdown ? 'text-gray300 ' : 'text-white'
                    } ${option === selectedOption ? (isThirdDropdown ? 'text-white' : 'bg-gray500') : ''}`}
                    onClick={() => handleOptionClick(option)}>
                    <div
                      className={`flex items-center gap-[0.25rem] px-[0.75rem] py-[0.75rem] hover:bg-gray500 ${
                        label === '장르'
                          ? index === 8
                            ? 'rounded-bl-md'
                            : index === options.length - 1
                            ? 'rounded-br-md'
                            : ''
                          : index === 0
                          ? isThirdDropdown ? 'rounded-t-md' : ''
                          : index === options.length - 1
                          ? 'rounded-b-md'
                          : ''
                      }`}>
                      {!isThirdDropdown && (
                        <div className="flex h-[28px] w-[28px] py-[0.5rem] items-center justify-center">
                          {option === selectedOption && (
                            <Image src="/icons/checkmark.svg" alt="checked" width={16} height={16} />
                          )}
                        </div>
                      )}
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
