'use client';

import { Club } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface ReviewWriteButtonProps {
  venueEngName: string;
  venueId: string;
  onClick: () => void;
  isDisabled: boolean;
  setActiveTab: (tab: 'info' | 'review' | 'event') => void;
}

const ReviewWriteButton = ({ venueEngName, venueId, onClick, isDisabled, setActiveTab }: ReviewWriteButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    // 리뷰 작성 페이지로 이동 (tab=review 파라미터 추가)
    router.push(`/review/write?venue=${venueEngName}&venueId=${venueId}&tab=review`);
  };

  return (
    <div className="px-5">
      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 border-none px-[1.25rem] pb-[1.25rem] pt-2">
        <button
          onClick={handleClick}
          disabled={isDisabled}
          className="w-full rounded-md border-none bg-main py-[0.81rem] text-[1rem] font-bold text-sub2">
          {venueEngName} 리뷰 작성하기
        </button>
      </div>
    </div>
  );
};

export default ReviewWriteButton;
