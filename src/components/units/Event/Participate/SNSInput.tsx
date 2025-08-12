'use client';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';

interface SNSSelectorProps {
  snsType: string;
  snsId: string;
  onTypeChange: (value: string) => void;
  onIdChange: (value: string) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export default function SNSSelector({
  snsType,
  snsId,
  onTypeChange,
  onIdChange,
  onComplete,
  disabled = false,
}: SNSSelectorProps) {
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const hasInteracted = useRef(false);
  const hasConfirmed = useRef(false);

  // 키보드 감지 (모바일)
  useEffect(() => {
    let initialHeight = window.innerHeight;
    let timeoutId: NodeJS.Timeout;

    const handleResize = () => {
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        const currentHeight = window.innerHeight;

        // Safari를 위한 추가 키보드 감지 방법
        const isKeyboardVisible = currentHeight < initialHeight * 0.8; // 화면 높이가 80% 이하로 줄어들면 키보드로 간주

        console.log('🔵 키보드 감지 (Safari 포함):', {
          currentHeight,
          initialHeight,
          isKeyboardVisible,
          isMobile,
          ratio: currentHeight / initialHeight,
        });

        setIsKeyboardVisible(isKeyboardVisible);
      }
    };

    const handleFocus = () => {
      // 입력 필드에 포커스될 때 키보드가 올라올 것으로 예상
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        console.log('🔵 입력 필드 포커스됨 - 키보드 예상');
        // 약간의 지연 후 키보드 상태 확인
        timeoutId = setTimeout(() => {
          handleResize();
        }, 300);
      }
    };

    const handleBlur = () => {
      // 입력 필드에서 포커스가 벗어날 때 키보드가 내려갈 것으로 예상
      const isMobile = window.innerWidth <= 768;
      if (isMobile) {
        console.log('🔵 입력 필드 블러됨 - 키보드 숨김 예상');
        setIsKeyboardVisible(false);
      }
    };

    // 초기 상태 설정
    handleResize();

    // 이벤트 리스너 등록
    window.addEventListener('resize', handleResize);
    window.addEventListener('focusin', handleFocus);
    window.addEventListener('focusout', handleBlur);

    // visualViewport가 지원되는 경우 추가
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', handleResize);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('focusin', handleFocus);
      window.removeEventListener('focusout', handleBlur);
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', handleResize);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // SNS 입력이 완료되면 자동으로 다음 단계로 진행 (사용자가 확인했을 때만)
  useEffect(() => {
    if (
      onComplete &&
      hasInteracted.current &&
      hasConfirmed.current &&
      (snsType === '' || (snsType && snsId.trim().length > 0))
    ) {
      // 약간의 지연을 두어 사용자가 입력을 완료했음을 인지할 수 있도록 함
      const timer = setTimeout(() => {
        onComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [snsType, snsId, onComplete]);

  const getButtonClass = (sns: string) => {
    const isSelected = snsType === sns;
    return `flex-1 rounded-[0.38rem] py-3 text-body-14-medium border transition-colors ${
      isSelected ? 'bg-sub1 text-white border-main text-body-14-bold' : 'bg-gray500 text-gray300 border-gray500'
    }`;
  };

  const handleConfirm = () => {
    if (snsType === '' || (snsType && snsId.trim().length > 0)) {
      hasConfirmed.current = true;
      onComplete?.();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canConfirm) {
      hasConfirmed.current = true;
      handleConfirm();
    }
  };

  // SNS 타입만 선택했을 때는 완료할 수 없음
  const canConfirm = snsType === '' || (snsType && snsId.trim().length > 0);

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">SNS</label>
      </div>
      <div className="flex gap-[0.62rem]">
        <motion.button
          type="button"
          className={getButtonClass('Instagram')}
          onClick={() => {
            if (!disabled) {
              hasInteracted.current = true;
              hasConfirmed.current = false; // SNS 타입 선택 시에는 아직 확인되지 않음
              onTypeChange('Instagram');
              onIdChange('');
            }
          }}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled}>
          인스타그램
        </motion.button>
        <motion.button
          type="button"
          className={getButtonClass('Facebook')}
          onClick={() => {
            if (!disabled) {
              hasInteracted.current = true;
              hasConfirmed.current = false; // SNS 타입 선택 시에는 아직 확인되지 않음
              onTypeChange('Facebook');
              onIdChange('');
            }
          }}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled}>
          페이스북
        </motion.button>
        <motion.button
          type="button"
          className={getButtonClass('')}
          onClick={() => {
            if (!disabled) {
              hasInteracted.current = true;
              hasConfirmed.current = true; // SNS 없음 선택 시 자동으로 확인된 것으로 처리
              onTypeChange('');
              onIdChange('');
            }
          }}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled}>
          없음
        </motion.button>
      </div>

      {snsType === 'Instagram' && (
        <input
          type="text"
          placeholder="인스타그램 아이디를 입력해주세요"
          className={`mt-3 w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          value={snsId}
          onChange={(e) => {
            if (!disabled) {
              // 영어, 숫자, 언더스코어, 점만 허용
              const value = e.target.value.replace(/[^a-zA-Z0-9._]/g, '');
              onIdChange(value);
            }
          }}
          onKeyDown={handleKeyDown}
          pattern="[a-zA-Z0-9._]+"
          title="영어, 숫자, 언더스코어(_), 점(.)만 입력 가능합니다"
          disabled={disabled}
        />
      )}

      {snsType === 'Facebook' && (
        <input
          type="text"
          placeholder="페이스북 아이디를 입력해주세요"
          className={`mt-3 w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
            disabled ? 'cursor-not-allowed' : ''
          }`}
          value={snsId}
          onChange={(e) => {
            if (!disabled) {
              // 영어, 숫자, 언더스코어, 점만 허용
              const value = e.target.value.replace(/[^a-zA-Z0-9._]/g, '');
              onIdChange(value);
            }
          }}
          onKeyDown={handleKeyDown}
          pattern="[a-zA-Z0-9._]+"
          title="영어, 숫자, 언더스코어(_), 점(.)만 입력 가능합니다"
          disabled={disabled}
        />
      )}

      {/* 키보드 위 확인 버튼 (모바일) - 키보드 바로 위에 위치 */}
      {isKeyboardVisible && canConfirm && (
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
