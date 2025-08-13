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
    // 포커스 시 키보드가 올라올 것으로 예상
    console.log('🔵 이름 입력 필드 포커스');
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

      {/* 확인 버튼 - VisualViewport를 사용하여 키보드 위에 정확히 위치 */}
      {isKeyboardVisible && value.trim().length > 0 && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg"
          style={{
            bottom: `${keyboardHeight}px`,
            transition: 'bottom 0.3s ease-out',
          }}>
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
