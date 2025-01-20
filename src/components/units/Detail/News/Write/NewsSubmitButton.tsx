'use client';

import React from 'react';

interface ReviewSubmitButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

const NewsSubmitButton = ({ onClick, isDisabled }: ReviewSubmitButtonProps) => {
  return (
    <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 mx-auto w-full max-w-[600px]">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`w-full py-4 ${
          isDisabled ? 'bg-gray400 text-gray300' : 'hover:bg-main-dark bg-main text-white'
        } text-body1-16-bold`}>
        뉴스 등록하기
      </button>
    </div>
  );
};

export default NewsSubmitButton;
