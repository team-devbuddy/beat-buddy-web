'use client';

import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';

interface DropdownProps {
  onClose: () => void;
  position: { top: number; left: number };
  // 기존 게시글 드롭다운용
  onDelete?: () => void;
  isAuthor?: boolean;
  postId?: number;
  // 프로필 드롭다운용
  isProfile?: boolean;
  memberId?: number;
  onReport?: () => void;
  onBlock?: () => void;
}

const BoardDropdown = ({
  onClose,
  position,
  onDelete,
  isAuthor = false,
  postId,
  isProfile = false,
  memberId,
  onReport,
  onBlock,
}: DropdownProps) => {
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

  const handleReport = () => {
    // TODO: 신고 기능 구현
    alert('신고 기능은 준비 중입니다.');
    onReport?.();
    onClose();
  };

  const handleBlock = () => {
    // TODO: 차단 기능 구현
    alert('차단 기능은 준비 중입니다.');
    onBlock?.();
    onClose();
  };

  const dropdownContent = (
    <>
      {/* ✅ 백그라운드 오버레이 */}
      <div className="fixed inset-0 z-40 bg-black bg-opacity-40 transition-opacity" onClick={onClose} />

      <motion.div
        ref={dropdownRef}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        className="fixed z-50 min-w-[90px] space-y-2 rounded-[0.75rem] bg-gray700 px-3 py-2 shadow-lg"
        style={{ top: position.top, left: position.left }}>
        {/* 프로필 드롭다운 메뉴 */}
        {isProfile && !isAuthor && (
          <>
            <button
              className="flex w-full items-center justify-between rounded-md px-2 py-1 text-body3-12-medium text-white hover:bg-gray600"
              onClick={handleReport}>
              <span>신고하기</span>
              <Image src="/icons/flag.svg" alt="신고" width={16} height={16} />
            </button>
            <button
              className="flex w-full items-center justify-between rounded-md px-2 py-1 text-body3-12-medium text-red-400 hover:bg-gray600"
              onClick={handleBlock}>
              <span>차단하기</span>
              <Image src="/icons/block.svg" alt="차단" width={16} height={16} />
            </button>
          </>
        )}

        {/* 게시글 드롭다운 메뉴 - 기존 방식 호환 */}
        {!isProfile && onDelete && (
          <button
            className="flex w-full items-center justify-between rounded-md text-body3-12-medium text-white hover:bg-gray600"
            onClick={() => {
              onDelete();
              onClose();
            }}>
            <span>삭제</span>
            <Image src="/icons/trashcan.svg" alt="삭제" width={16} height={16} />
          </button>
        )}
      </motion.div>
    </>
  );

  if (typeof window === 'object') {
    return createPortal(dropdownContent, document.body);
  }
  return null;
};

export default BoardDropdown;
