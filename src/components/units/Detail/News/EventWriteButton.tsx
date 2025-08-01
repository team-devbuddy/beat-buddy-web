'use client';

import { Club } from '@/lib/types';
import { useRouter } from 'next/navigation';

interface EventWriteButtonProps {
  venueEngName: string;
  venueId: string;
  onClick: () => void;
  isDisabled: boolean;
}

const EventWriteButton = ({ venueEngName, venueId, onClick, isDisabled }: EventWriteButtonProps) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/event/write?venue=${venueEngName}&venueId=${venueId}`);
  };

  return (
    <div className="px-5">
      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 border-none px-[1.25rem] pb-[1.25rem] pt-2">
        <button
          onClick={handleClick}
          disabled={isDisabled}
          className="w-full rounded-md border-none bg-main py-4 text-[1rem] font-bold text-sub2">
          {venueEngName} 이벤트 작성하기
        </button>
      </div>
    </div>
  );
};

export default EventWriteButton;
