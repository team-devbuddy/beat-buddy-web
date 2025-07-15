'use client';

import React, { useRef, useState } from 'react';
import { CSSTransition } from 'react-transition-group'; // 애니메이션을 위한 라이브러리

interface ReviewTextAreaProps {
  value: string;
  onChange: (value: string) => void;
}

const ReviewTextArea = ({ value, onChange }: ReviewTextAreaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // 높이 조정
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'; // 기존 높이를 초기화
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`; // 내용에 맞는 높이로 설정
    }
  };

  const toggleBottomSheet = () => {
    setIsBottomSheetOpen(!isBottomSheetOpen);
  };

  return (
    <div className="my-4 px-5">
      {/* 텍스트 영역 */}
      <div className="rounded-[0.5rem] bg-gray600">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (textareaRef.current) {
              textareaRef.current.style.height = 'auto';
              textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
            }
          }}
          className="w-full placeholder:font-bold overflow-hidden whitespace-pre-wrap border-none bg-transparent px-4 pb-4 pt-5 text-[0.75rem] text-gray200 placeholder:text-gray200 focus:outline-none"
          style={{ minHeight: '2rem', resize: 'none' }}
          placeholder="즐거웠던 경험을 공유해 주세요!"
        />

        {!value && (
          <div className="mt-[-2.3rem] rounded-[0.5rem] text-[0.75rem] pl-4 pr-5 pb-4 text-gray300">
            광고, 비난, 도배성 글을 남기면 영구적으로 활동이 제한될 수 있어요.
            자세한 내용은{' '}
            <a href="/rules" target="_blank" rel="noopener noreferrer" className="text-gray300 underline">
              리뷰 작성 규칙
            </a>
            을 참고해주세요.
          </div>
        )}
      </div>
      {/* 배경 (고정) */}
      {isBottomSheetOpen && <div className="fixed inset-0 z-40 bg-black/60" onClick={toggleBottomSheet}></div>}

      {/* 바텀시트 */}
      <CSSTransition in={isBottomSheetOpen} timeout={300} classNames="bottom-sheet" unmountOnExit>
        <div className="fixed bottom-0 left-0 right-0 z-50 rounded-t-lg bg-BG-black text-white">
          {/* 헤더 */}
          <div className="flex justify-center pt-[0.88rem]">
            <div className="h-1 w-16 rounded bg-gray600"></div>
          </div>
          <h3 className="px-4 pt-7 text-body1-16-bold">리뷰 작성 시 유의 사항</h3>
          <p className="mt-3 px-4 text-body2-15-medium text-gray300">
            ※ 본 공연은 9월 20일(금) 오후 5시까지 예매 가능합니다. 취소마감시간은 아래와 같이 예매 시 유의해주시기
            바랍니다.
          </p>
          <ul className="space-y-2 px-4 text-sm text-gray200">
            <li>[취소마감시간]</li>
            <li>- 공연관람일이 화요일~토요일인 경우 전날 오후 5시</li>
            <li>- 공연관람일이 일요일~월요일인 경우 토요일 오전 11시</li>
            <li>- 공휴일 및 공휴일 다음날인 경우</li>
            <li> * 공휴일 전날이 평일인 경우 오후 5시</li>
            <li> * 공휴일 전날이 토요일, 일요일인 경우 토요일 오전 11시</li>
          </ul>
          {/* 닫기 버튼 */}
          <button className="mt-6 w-full bg-main py-4 text-sm font-bold text-white" onClick={toggleBottomSheet}>
            닫기
          </button>
        </div>
      </CSSTransition>

      {/* 애니메이션 스타일 */}
      <style jsx global>{`
        .bottom-sheet-enter {
          transform: translateY(100%);
        }
        .bottom-sheet-enter-active {
          transform: translateY(0);
          transition: transform 300ms ease-in-out;
        }
        .bottom-sheet-exit {
          transform: translateY(0);
        }
        .bottom-sheet-exit-active {
          transform: translateY(100%);
          transition: transform 300ms ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default ReviewTextArea;
