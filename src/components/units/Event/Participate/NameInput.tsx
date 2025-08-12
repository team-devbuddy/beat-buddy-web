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

  // 키보드 감지 (모바일)
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const currentHeight = window.innerHeight;
        const initialHeight = window.visualViewport?.height || currentHeight;
        setIsKeyboardVisible(currentHeight < initialHeight);
      }
    };

    window.addEventListener('resize', handleResize);
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', handleResize);
      }
    };
  }, []);

  const handleConfirm = () => {
    if (value.trim().length > 0) {
      onConfirm();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim().length > 0) {
      handleConfirm();
    }
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
        disabled={disabled}
      />

      {/* 키보드 위 확인 버튼 (모바일) - 키보드 바로 위에 위치 */}
      {isKeyboardVisible && value.trim().length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-BG-black p-4 shadow-lg">
          <button
            onClick={handleConfirm}
            disabled={disabled}
            className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50">
            확인
          </button>
        </div>
      )}
    </div>
  );
}
