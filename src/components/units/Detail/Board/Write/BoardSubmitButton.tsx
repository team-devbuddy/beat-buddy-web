'use client';

interface BoardSubmitButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

const BoardSubmitButton = ({ onClick, isDisabled }: BoardSubmitButtonProps) => {
  return (
    <div className="left-50 fixed bottom-0 mx-auto w-full max-w-[600px]">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`w-full py-4 ${
          isDisabled ? 'bg-gray500 text-gray300' : 'hover:bg-main-dark bg-main text-white'
        } text-body1-16-bold`}>
        게시글 등록하기
      </button>
    </div>
  );
};

export default BoardSubmitButton;
