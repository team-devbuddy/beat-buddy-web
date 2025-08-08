'use client';

import Image from 'next/image';
import { useRef, useState, useEffect } from 'react';
import BoardDropDown from '../../Board/BoardDropDown';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { eventState, accessTokenState } from '@/context/recoil-context';
import { postLikeEvent } from '@/lib/actions/event-controller/postLikeEvent';
import { deleteLikeEvent } from '@/lib/actions/event-controller/deleteLikeEvent';

export default function EventDetailHeader({ handleBackClick }: { handleBackClick: () => void }) {
  const event = useRecoilValue(eventState);
  const setEvent = useSetRecoilState(eventState);
  const accessToken = useRecoilValue(accessTokenState) || '';
  const isAuthor = event?.isAuthor || false;
  const eventId = event?.eventId || 0;

  const [showDropdown, setShowDropdown] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isLiking, setIsLiking] = useState(false);
  const buttonRef = useRef<HTMLImageElement>(null);

  // 좋아요 처리 함수
  const handleLike = async () => {
    if (!event || isLiking) return;

    setIsLiking(true);
    try {
      if (event.liked) {
        await deleteLikeEvent(event.eventId, accessToken);
        // Recoil 상태 업데이트
        setEvent((prev) => (prev ? { ...prev, liked: false, likes: Math.max(0, prev.likes - 1) } : null));
      } else {
        await postLikeEvent(event.eventId, accessToken);
        // Recoil 상태 업데이트
        setEvent((prev) => (prev ? { ...prev, liked: true, likes: prev.likes + 1 } : null));
      }
    } catch (error) {
      console.error('좋아요 처리 실패:', error);
    } finally {
      setIsLiking(false);
    }
  };

  const handleShareClick = () => {
    const url = window.location.href;
    const title = event?.title || 'BeatBuddy';
    const text = `${event?.title} - BeatBuddy에서 확인해보세요!`;

    if (navigator.share) {
      navigator.share({
        title: title,
        text: text,
        url: url,
      });
    } else {
      fallbackShare();
    }
  };

  const fallbackShare = () => {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url)
      .then(() => {
        console.log('링크가 복사되었습니다.');
      })
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

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
    <div className="relative mx-auto flex max-w-[600px] items-center justify-between px-5 pb-[0.88rem] pt-[0.62rem]">
      {/* 왼쪽: 백버튼 */}
      <Image
        src="/icons/arrow_back_ios.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        onClick={handleBackClick}
        className="cursor-pointer"
      />

      {/* 오른쪽: 좋아요와 메뉴 버튼 */}
      <div className="flex items-center gap-3">
        <Image src="/icons/upload.svg" alt="공유" width={24} height={24} className="cursor-pointer" onClick={handleShareClick} />
        {/* 좋아요 버튼 */}
        <Image
          src={event?.liked ? '/icons/FilledHeart.svg' : '/icons/eventHeart.svg'}
          alt="좋아요"
          width={21}
          height={21}
          className="cursor-pointer"
          onClick={handleLike}
        />

        {/* 메뉴 버튼 */}
        {isAuthor && (
        <Image
          src="/icons/dot-vertical-white.svg"
          alt="메뉴"
          width={9}
          height={20}
          className="cursor-pointer"
          ref={buttonRef}
            onClick={() => setShowDropdown((prev) => !prev)}
          />
        )}
      </div>

      {/* 드롭다운 메뉴 */}
      {showDropdown && (
        <BoardDropDown
          isAuthor={isAuthor}
          onClose={() => setShowDropdown(false)}
          position={position}
          postId={eventId} // 이벤트 ID 사용
          eventId={eventId} // 이벤트 ID 전달
          type="event"
        />
      )}
    </div>
  );
}
