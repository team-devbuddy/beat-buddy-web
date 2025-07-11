'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import BoardDropDown from '../../Board/BoardDropDown';
import { useRecoilValue } from 'recoil';
import { eventState } from '@/context/recoil-context';

export default function EventDetailHeader({ handleBackClick }: { handleBackClick: () => void }) {
  const event = useRecoilValue(eventState);
  const isAuthor = event?.isAuthor || false;
  const eventId = event?.eventId || 0;

  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (showDropdown && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const scrollX = window.scrollX || document.documentElement.scrollLeft;
  
      // 드롭다운 너비를 고려해 left 보정
      const DROPDOWN_WIDTH = 100; // 드롭다운 예상 너비 (px)
      const SCREEN_WIDTH = window.innerWidth;
  
      let left = rect.right + scrollX - DROPDOWN_WIDTH; // 오른쪽 정렬 기준
      if (left < 8) left = 8; // 화면 밖으로 안 나가도록 최소값 보정
  
      setPosition({
        top: rect.bottom + scrollY + 8,
        left,
      });
    }
  }, [showDropdown]);
  

  return (
    <div className="p-4 max-w-[600px] mx-auto flex items-center justify-between relative">
      {/* 왼쪽: 백버튼 */}
      <Image
        src="/icons/line-md_chevron-left.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        onClick={handleBackClick}
        className="cursor-pointer"
      />

      {/* 오른쪽: 메뉴 버튼 */}
      <Image
        src="/icons/dot-vertical-white.svg"
        alt="메뉴"
        width={9}
        height={20}
        className="cursor-pointer"
        ref={buttonRef}
        onClick={() => setShowDropdown((prev) => !prev)}
      />

      {/* 드롭다운 메뉴 */}
      {showDropdown && (
        <BoardDropDown
          isAuthor={isAuthor}
          onClose={() => setShowDropdown(false)}
          position={position}
          postId={eventId}
          type="event"
        />
      )}
    </div>
  );
}
