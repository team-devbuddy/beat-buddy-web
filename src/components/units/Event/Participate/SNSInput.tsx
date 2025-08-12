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

  // SNS 타입만 선택했을 때는 완료할 수 없음
  const canConfirm =
    snsType === '' || // SNS 없음 선택
    (snsType === 'Instagram' && snsId.trim().length > 0) || // Instagram + ID 입력
    (snsType === 'Facebook' && snsId.trim().length > 0); // Facebook + ID 입력

  // 자동 진행 로직 제거 - 오직 확인 버튼이나 엔터 키로만 진행

  const getButtonClass = (sns: string) => {
    const isSelected = snsType === sns;
    return `flex-1 rounded-[0.38rem] py-3 text-body-14-medium border transition-colors ${
      isSelected ? 'bg-sub1 text-white border-main text-body-14-bold' : 'bg-gray500 text-gray300 border-gray500'
    }`;
  };

  const handleConfirm = () => {
    console.log('🔵 SNSInput handleConfirm 호출됨');
    console.log('🔵 canConfirm:', canConfirm, 'snsType:', snsType, 'snsId:', snsId);
    if (canConfirm) {
      hasConfirmed.current = true;
      console.log('🔵 onComplete 호출함');
      // 확인 버튼 클릭 시 키보드 숨김 후 onComplete 호출
      setIsKeyboardVisible(false);
      onComplete?.();
    } else {
      console.log('🔵 SNS 입력이 완료되지 않음, onComplete 호출 안함');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canConfirm) {
      hasConfirmed.current = true;
      handleConfirm();
    }
  };

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
              // hasConfirmed는 ID 입력 후 확인 버튼 클릭 시에만 true로 설정
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
              // hasConfirmed는 ID 입력 후 확인 버튼 클릭 시에만 true로 설정
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
              // SNS 없음 선택 시 바로 다음 단계로 진행
              setTimeout(() => {
                onComplete?.();
              }, 500);
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
          onFocus={() => {
            // 모바일에서만 키보드 감지
            if (window.innerWidth <= 768) {
              console.log('🔵 Instagram 입력 필드 포커스');
              setIsKeyboardVisible(true);
            }
          }}
          onBlur={() => {
            // 모바일에서만 키보드 감지
            if (window.innerWidth <= 768) {
              console.log('🔵 Instagram 입력 필드 블러');
              // onBlur에서 즉시 숨기지 않음 - 확인 버튼 클릭 후에만 숨김
            }
          }}
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
          onFocus={() => {
            // 모바일에서만 키보드 감지
            if (window.innerWidth <= 768) {
              console.log('🔵 Facebook 입력 필드 포커스');
              setIsKeyboardVisible(true);
            }
          }}
          onBlur={() => {
            // 모바일에서만 키보드 감지
            if (window.innerWidth <= 768) {
              console.log('🔵 Facebook 입력 필드 블러');
              // onBlur에서 즉시 숨기지 않음 - 확인 버튼 클릭 후에만 숨김
            }
          }}
          pattern="[a-zA-Z0-9._]+"
          title="영어, 숫자, 언더스코어(_), 점(.)만 입력 가능합니다"
          disabled={disabled}
        />
      )}

      {/* 확인 버튼 - 맨 아래에 위치, 가로 중앙 정렬 */}
      {isKeyboardVisible && canConfirm && (
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
