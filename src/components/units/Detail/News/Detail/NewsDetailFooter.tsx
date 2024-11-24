'use client';

import React from 'react';

interface NewsDetailFooterProps {
  onClick: () => void; // 클릭 이벤트 핸들러
}

const NewsDetailFooter = ({ onClick }: NewsDetailFooterProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 mx-auto flex w-full max-w-[600px] items-center">
      {/* 예매 버튼 (비율: 8) */}
      <button
        onClick={onClick}
        className="flex h-[3.75rem] flex-grow items-center justify-center bg-main text-body1-16-bold text-black"
        style={{ flex: 9 }}>
        예매하기
      </button>

      {/* 하트 아이콘 (비율: 2) */}
      <div
        className="flex h-[3.75rem] items-center justify-center bg-white"
        style={{
          flex: 2,
        }}>
        <img src="/icons/heartBlanked.svg" alt="Heart Icon" className="h-[24px] w-[24px] text-gray-500" />
      </div>
    </div>
  );
};

export default NewsDetailFooter;
