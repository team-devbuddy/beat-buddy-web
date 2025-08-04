'use client';

import { useCallback } from 'react';

interface BoardSubmitButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

const BoardSubmitButton = ({ onClick, isDisabled }: BoardSubmitButtonProps) => {
  // 중복 클릭 방지를 위한 핸들러
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();

      if (isDisabled) {
        console.log('버튼이 비활성화되어 클릭 무시');
        return;
      }

      console.log('게시글 등록 버튼 클릭');
      onClick();
    },
    [onClick, isDisabled],
  );

  return (
    <div className="left-50 fixed bottom-0 mx-auto w-full max-w-[600px]">
      <button
        onClick={handleClick}
        disabled={isDisabled}
        className={`w-full py-4 transition-all duration-200 ${
          isDisabled
            ? 'cursor-not-allowed bg-gray500 text-gray300'
            : 'hover:bg-main-dark cursor-pointer bg-main text-white active:scale-95'
        } text-body1-16-bold`}
        style={{
          pointerEvents: isDisabled ? 'none' : 'auto',
          userSelect: 'none',
        }}>
        {isDisabled ? '게시글 등록 중...' : '게시글 등록하기'}
      </button>
    </div>
  );
};

export default BoardSubmitButton;
