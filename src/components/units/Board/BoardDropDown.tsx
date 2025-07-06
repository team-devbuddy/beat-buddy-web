'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';

interface DropdownItem {
  label: string;
  icon: string;
  onClick: () => void;
}

interface DropdownProps {
  isAuthor: boolean;
  onClose: () => void;
  position: { top: number; left: number };
}

const BoardDropdown = ({ isAuthor, onClose, position }: DropdownProps) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const items: DropdownItem[] = isAuthor
    ? [
        { label: '공유', icon: '/icons/material-symbols_share-outline.svg', onClick: () => alert('공유') },
        { label: '수정', icon: '/icons/edit.svg', onClick: () => router.push('/board/edit/1') },
        { label: '삭제', icon: '/icons/trashcan.svg', onClick: () => alert('삭제') },
      ]
    : [
        { label: '공유', icon: '/icons/material-symbols_share-outline.svg', onClick: () => alert('공유') },
        { label: '차단', icon: '/icons/block.svg', onClick: () => alert('차단') },
        { label: '신고', icon: '/icons/material-symbols_siren-outline.svg', onClick: () => alert('신고') },
      ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return createPortal(
    <>
      {/* 배경 */}
      <div className="fixed  inset-0 bg-black/50 z-40" onClick={onClose} />

      {/* 드롭다운 박스 */}
      <AnimatePresence>
        <motion.div
          ref={dropdownRef}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
  className="fixed z-50 bg-gray900 min-w-[100px]  rounded-[0.75rem] bg-gray700 shadow-lg py-3 px-4 animate-fadeInUp space-y-2"
  style={{ top: position.top, left: position.left }}
  onClick={e => e.stopPropagation()}
>
  {items.map(item => (
    <button
      key={item.label}
      className="flex items-center justify-between text-body3-12-medium text-white  w-full rounded-md "
      onClick={() => {
        item.onClick();
        onClose();
      }}
    >
      <span>{item.label}</span>
      <Image src={item.icon} alt={item.label} width={16} height={16} />
    </button>
  ))}
</motion.div>
</AnimatePresence>
    </>,
    document.body
  );
};

export default BoardDropdown;
