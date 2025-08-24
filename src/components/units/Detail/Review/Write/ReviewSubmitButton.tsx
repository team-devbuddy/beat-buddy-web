'use client';

import { useRouter } from 'next/navigation';
import { useSetRecoilState } from 'recoil';
import { detailTabState } from '@/context/recoil-context';

interface ReviewSubmitButtonProps {
  venueId: string;
  onClick: () => void;
  isDisabled: boolean;
  isEditMode?: boolean;
}

const ReviewSubmitButton = ({ venueId, onClick, isDisabled, isEditMode = false }: ReviewSubmitButtonProps) => {
  const router = useRouter();
  const setDetailTabState = useSetRecoilState(detailTabState);

  const handleSubmit = async () => {
    // 리뷰 제출 처리
    await onClick();

    // detailTabState를 'review'로 설정 (recoil-persist에 저장됨)
    setDetailTabState('review');

    // 리뷰 제출 완료 후 detail 페이지로 돌아가기
    router.push(`/detail/${venueId}`);
  };

  return (
    <div className="px-5">
      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 border-none px-[1.25rem] pb-[1.25rem] pt-2">
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`w-full rounded-[0.5rem] border-none ${
            isDisabled ? 'bg-gray500 text-gray300' : 'bg-main text-sub2'
          } py-[0.87rem] text-button-16-semibold`}>
          {isEditMode ? '리뷰 수정하기' : '리뷰 등록하기'}
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmitButton;
