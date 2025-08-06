'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ReviewCompleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  venueName: string;
}

const ReviewCompleteModal = ({ isOpen, onClose, venueName }: ReviewCompleteModalProps) => {
  const router = useRouter();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-BG-black mx-5 min-w-[20.9375rem] rounded-[0.75rem] p-5 text-center">
        <h2 className="text-[1.25rem] font-bold text-white">리뷰 작성이 완료되었어요!</h2>
        <p className="mt-[0.37rem] text-[0.875rem] text-gray300">
          작성해주신 소중한 리뷰는
          <br />
          베뉴를 찾는 버디들에게 도움이 될 거예요.
        </p>
        <button
          onClick={onClose}
          className="mt-5 w-full rounded-[0.5rem] bg-gray700 py-[0.66rem] text-[0.9935rem] font-bold text-gray200">
          닫기
        </button>
      </div>
    </div>
  );
};

export default ReviewCompleteModal;
