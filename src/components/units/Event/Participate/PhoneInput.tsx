'use client';

import { useState, useEffect } from 'react';

export default function PhoneInput({
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // 숫자만 추출하여 저장
    const numbers = e.target.value.replace(/[^0-9]/g, '');
    if (numbers.length <= 11) {
      onChange(numbers);
    }
  };

  // 전화번호 포맷팅 함수 (화면에 표시용)
  const formatPhoneNumber = (input: string) => {
    if (input.length <= 3) {
      return input;
    } else if (input.length <= 7) {
      return `${input.slice(0, 3)}-${input.slice(3)}`;
    } else if (input.length <= 11) {
      return `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7)}`;
    } else {
      return `${input.slice(0, 3)}-${input.slice(3, 7)}-${input.slice(7, 11)}`;
    }
  };

  const handleConfirm = () => {
    console.log('📱 PhoneInput handleConfirm 호출됨, value:', value, 'length:', value.length);
    if (value.length >= 10) {
      console.log('📱 onConfirm 함수 호출함');
      onConfirm();
    } else {
      console.log('📱 전화번호가 너무 짧음, 진행 불가');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    console.log('📱 PhoneInput handleKeyDown 호출됨, key:', e.key, 'value:', value, 'length:', value.length);
    if (e.key === 'Enter' && value.length >= 10) {
      console.log('📱 엔터키 눌림, handleConfirm 호출');
      handleConfirm();
    } else if (e.key === 'Enter') {
      console.log('📱 엔터키 눌렸지만 전화번호가 너무 짧음');
    }
  };

  const isPhoneValid = value.length >= 10;

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">전화번호 </label>
        <label className="block text-body-14-medium text-gray300">Contact </label>
      </div>
      <input
        type="text"
        placeholder="연락 가능한 전화번호를 입력해주세요"
        className={`w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
        value={formatPhoneNumber(value)}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        maxLength={13}
        inputMode="numeric"
        pattern="[0-9]*"
        disabled={disabled}
      />

      {/* 키보드 위 확인 버튼 (모바일) - 키보드 바로 위에 위치 */}
      {isKeyboardVisible && isPhoneValid && (
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
