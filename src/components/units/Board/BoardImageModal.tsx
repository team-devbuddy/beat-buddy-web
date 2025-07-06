'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { createPortal } from 'react-dom';

interface BoardImageModalProps {
  images: string[];
  initialIndex: number;
  onClose: () => void;
}

export default function BoardImageModal({
  images,
  initialIndex,
  onClose,
}: BoardImageModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const modalRef = useRef<HTMLDivElement>(null);
  const touchStartX = useRef<number | null>(null);
  const touchEndX = useRef<number | null>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (e.key === 'ArrowLeft') {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      } else if (e.key === 'Escape') {
        onClose();
      }
    },
    [images.length, onClose]
  );

  const handleClickOutside = useCallback(
    (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose();
      }
    },
    [onClose]
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.changedTouches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndX.current = e.changedTouches[0].clientX;
    if (touchStartX.current !== null && touchEndX.current !== null) {
      const deltaX = touchStartX.current - touchEndX.current;
      if (deltaX > 50) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      } else if (deltaX < -50) {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    }
    touchStartX.current = null;
    touchEndX.current = null;
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown, handleClickOutside]);

  if (typeof window === 'undefined') return null;

  return createPortal(
    <div className="fixed inset-0 z-50 bg-black bg-opacity-80 flex items-center justify-center">
      <div
        className="relative bg-gray700 rounded-[0.5rem] p-4 min-w-[90vw] max-h-[90vh] flex flex-col items-center justify-center"
        ref={modalRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* 상단 헤더 */}
        <div className="w-full flex items-center justify-between px-2 ">
          <div className="text-white text-sm font-semibold text-center w-full">
            {currentIndex + 1} / {images.length}
          </div>
          <div className="absolute right-4 flex gap-2">
            <a
              href={images[currentIndex]}
              download
              className="text-white text-lg opacity-70 hover:opacity-100"
            >
              ⬇
            </a>
            <button
              onClick={onClose}
              className="text-white text-lg opacity-70 hover:opacity-100"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 이미지 */}
        <div className="mt-4">
          <Image
            src={images[currentIndex]}
            alt={`modal-img-${currentIndex}`}
            width={1000}
            height={1000}
            className="w-auto h-auto max-w-[80vw] max-h-[70vh] object-contain"
          />
        </div>
      </div>
    </div>,
    document.body
  );
}
