'use client';

import React from 'react';

interface ReviewSubmitButtonProps {
  onClick: () => void;
  isDisabled: boolean;
}

const NewsSubmitButton = ({ onClick, isDisabled }: ReviewSubmitButtonProps) => {
  return (
    <div className="fixed bottom-0 left-0 w-full ">
      <button
        onClick={onClick}
        disabled={isDisabled}
        className={`w-full  py-4 ${
          isDisabled ? 'bg-gray500 text-gray300' : 'hover:bg-main-dark bg-main text-white'
        } text-body1-16-bold`}>
        뉴스 등록하기
      </button>
    </div>
  );
};

export default NewsSubmitButton;
