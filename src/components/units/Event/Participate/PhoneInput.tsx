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
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // VisualViewport API를 사용한 키보드 감지
  useEffect(() => {
    const handleViewportResize = () => {
      if ('visualViewport' in window) {
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport?.height || windowHeight;

        // 키보드가 올라왔는지 확인 (window height > viewport height)
        if (windowHeight > viewportHeight) {
          setIsKeyboardVisible(true);
          setKeyboardHeight(windowHeight - viewportHeight);
        } else {
          setIsKeyboardVisible(false);
          setKeyboardHeight(0);
        }
      }
    };

    // 초기 상태 설정
    handleViewportResize();

    // 이벤트 리스너 등록
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', handleViewportResize);
    }

    return () => {
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numbers = e.target.value.replace(/[^0-9]/g, '');
    onChange(numbers);
  };

  const handleConfirm = () => {
    console.log('🔵 PhoneInput handleConfirm 호출됨');
    console.log('🔵 value:', value, 'length:', value.length, 'isPhoneValid:', isPhoneValid);
    if (value.length >= 10) {
      console.log('🔵 onConfirm 호출함');
      // 확인 버튼 클릭 시 키보드 숨김 후 onConfirm 호출
      setIsKeyboardVisible(false);
      onConfirm();
    } else {
      console.log('🔵 전화번호가 너무 짧음, onConfirm 호출 안함');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.length >= 10) {
      handleConfirm();
    }
  };

  const handleFocus = () => {
    // 포커스 시 키보드가 올라올 것으로 예상
    console.log('🔵 전화번호 입력 필드 포커스');
  };

  const handleBlur = () => {
    // onBlur에서 즉시 숨기지 않음 - 확인 버튼 클릭 후에만 숨김
    console.log('🔵 전화번호 입력 필드 블러');
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
        onFocus={handleFocus}
        onBlur={handleBlur}
        maxLength={13}
        inputMode="numeric"
        pattern="[0-9]*"
        disabled={disabled}
      />

      {/* 확인 버튼 - VisualViewport를 사용하여 키보드 위에 정확히 위치 */}
      {isKeyboardVisible && isPhoneValid && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg"
          style={{
            bottom: `${keyboardHeight}px`,
            transition: 'bottom 0.3s ease-out',
          }}>
          <div className="w-full max-w-[600px]">
            <motion.button
              onClick={handleConfirm}
              disabled={disabled}
              whileHover={!disabled ? { scale: 1.02 } : {}}
              whileTap={!disabled ? { scale: 0.98 } : {}}
              className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50">
              확인
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
