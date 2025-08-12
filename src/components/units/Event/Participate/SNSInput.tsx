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
