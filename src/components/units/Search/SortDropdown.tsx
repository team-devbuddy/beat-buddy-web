'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { DropdownProps } from '@/lib/types';

function Dropdown({
  options,
  selectedOption,
  setSelectedOption,
  label,
  isThirdDropdown = false,
}: DropdownProps & { isThirdDropdown?: boolean }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleOptionClick = (option: string) => {
    if (option === selectedOption) {
      setSelectedOption('');  // 선택된 옵션을 다시 클릭하면 선택 해제
    } else {
      setSelectedOption(option);
    }
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div className="flex items-center">
        <button
          type="button"
          className={`inline-flex w-full justify-between rounded-sm cursor-pointer py-[0.25rem] pl-[0.62rem] pr-[0.5rem] text-body2-15-medium focus:outline-none ${
            isThirdDropdown
              ? 'text-gray300 border-transparent bg-transparent'
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
      {isOpen && (
        <div
          className={`absolute ${isThirdDropdown ? 'right-0 w-[6.25rem]' : 'left-0 w-[13.75rem]'} z-50 mt-2 origin-top-right rounded-sm bg-gray700 shadow-lg`}>
          {!isThirdDropdown && (
            <div className="flex items-center gap-[0.5rem] border-b-[0.5px] border-gray400 px-[0.75rem] py-[0.5rem] text-body1-16-bold text-gray-400 rounded-t-sm">
              <Image src="/icons/OpenArrow.svg" alt="arrow down" width={24} height={24} />
              <div>{label}</div>
            </div>
          )}
          {options.map((option, index) => (
            <button
              key={index}
              className={`block w-full text-left text-body1-16-medium ${
                isThirdDropdown ? 'text-gray300' : 'text-white'
              } ${option === selectedOption ? (isThirdDropdown ? 'text-white' : 'bg-gray500') : ''} ${
                index === 0 ? 'rounded-t-sm' : index === options.length - 1 ? 'rounded-b-sm' : ''
              }`}
              onClick={() => handleOptionClick(option)}>
              <div className={`flex items-center gap-[0.25rem] px-[0.75rem] py-[0.5rem] hover:bg-gray500 ${index === 0 ? 'rounded-t-sm' : index === options.length - 1 ? 'rounded-b-sm' : ''}`}>
                {!isThirdDropdown && (
                  <div className="flex h-[28px] w-[28px] items-center justify-center">
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
      )}
    </div>
  );
}

export default Dropdown;
