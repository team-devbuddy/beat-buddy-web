'use client';

import { Club } from '@/lib/types';
import { useRouter } from 'next/navigation';

import { useRecoilValue } from 'recoil';
import { isBusinessState } from '@/context/recoil-context';

interface EventWriteButtonProps {
  venueEngName: string;
  venueId: string;
  onClick: () => void;
  isDisabled: boolean;
}

const EventWriteButton = ({ venueEngName, venueId, onClick, isDisabled }: EventWriteButtonProps) => {
  const router = useRouter();
  const isBusiness = useRecoilValue(isBusinessState);

  const handleClick = () => {
    router.push(`/event/write?venue=${venueEngName}&venueId=${venueId}`);
  };

  // 비즈니스 회원이 아닌 경우 버튼을 렌더링하지 않음
  if (!isBusiness) {
    return null;
  }

  return (
    <div className="px-5">
      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 border-none px-[1.25rem] pb-[1.25rem] pt-2">
        <button
          onClick={handleClick}
          disabled={isDisabled}
          className="w-full rounded-md border-none bg-main py-[0.81rem] text-[1rem] font-bold text-sub2">
          {venueEngName} 이벤트 작성하기
        </button>
      </div>
    </div>
  );
};

export default EventWriteButton;
