'use client';

import { useState, useEffect } from 'react';

export default function NameInput({
  value,
  onChange,
  onConfirm,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  const handleConfirm = () => {
    console.log('🔵 NameInput handleConfirm 호출됨');
    console.log('🔵 value:', value, 'trim length:', value.trim().length);
    if (value.trim().length > 0) {
      console.log('🔵 onConfirm 호출함');
      // 확인 버튼 클릭 시 키보드 숨김 후 onConfirm 호출
      setIsKeyboardVisible(false);
      onConfirm();
    } else {
      console.log('🔵 이름이 비어있음, onConfirm 호출 안함');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim().length > 0) {
      handleConfirm();
    }
  };

  const handleFocus = () => {
    // 모바일에서만 키보드 감지
    if (window.innerWidth <= 768) {
      console.log('🔵 이름 입력 필드 포커스');
      setIsKeyboardVisible(true);
    }
  };

  const handleBlur = () => {
    // onBlur에서 즉시 숨기지 않음 - 확인 버튼 클릭 후에만 숨김
    console.log('🔵 이름 입력 필드 블러');
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">이름 </label>
        <label className="block text-body-14-medium text-gray300">Name </label>
      </div>
      <input
        type="text"
        placeholder="이름을 입력해주세요"
        className={`w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-white placeholder-gray300 safari-input-fix placeholder:text-body-14-medium focus:outline-none ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
      />

      {/* 확인 버튼 - 맨 아래에 위치, 가로 중앙 정렬 */}
      {isKeyboardVisible && value.trim().length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg">
          <div className="w-full max-w-[600px]">
            <button
              onClick={handleConfirm}
              disabled={disabled}
              className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
