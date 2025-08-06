'use client';


interface ReviewSubmitButtonProps {
  venueId: string;
  onClick: () => void;
  isDisabled: boolean;
}

const ReviewSubmitButton = ({ venueId, onClick, isDisabled }: ReviewSubmitButtonProps) => {
  return (
    <div className="px-5">
      <div className="fixed bottom-0 left-1/2 z-10 w-full max-w-[600px] -translate-x-1/2 border-none px-[1.25rem] pb-[1.25rem] pt-2">
        <button
          onClick={onClick}
          disabled={isDisabled}
          className={`w-full rounded-[0.5rem] border-none ${
            isDisabled ? 'bg-gray500 text-gray300' : 'bg-main text-sub2'
          } py-[0.81rem] text-[0.9935rem] font-bold `}>
          리뷰 등록하기
        </button>
      </div>
    </div>
  );
};

export default ReviewSubmitButton;
