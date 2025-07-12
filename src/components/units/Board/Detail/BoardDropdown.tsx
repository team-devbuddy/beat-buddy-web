'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface DropdownProps {
  onClose: () => void;
  onDelete: () => void;
  position: { top: number; left: number };
}

const BoardDropdown = ({ onClose, onDelete, position }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const dropdownContent = (
    <>
      {/* ✅ 백그라운드 오버레이 */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-40  transition-opacity"
        onClick={onClose}
      />

      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 min-w-[100px] space-y-2 rounded-[0.75rem] bg-gray700 px-4 py-3 shadow-lg"
        style={{ top: position.top, left: position.left }}>
        <button
          className="flex w-full items-center justify-between rounded-md text-body3-12-medium text-white"
          onClick={() => {
            onDelete();
            onClose();
          }}>
          <span>삭제</span>
          <Image src="/icons/trashcan.svg" alt="삭제" width={16} height={16} />
        </button>
      </motion.div>
    </>
  );

  if (typeof window === 'object') {
    return createPortal(dropdownContent, document.body);
  }
  return null;
};

export default BoardDropdown;
