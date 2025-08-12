'use client';

import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

interface GenderSelectorProps {
  value: string;
  onChange: (value: string) => void;
  onComplete?: () => void;
  disabled?: boolean;
}

export default function GenderSelector({ value, onChange, onComplete, disabled = false }: GenderSelectorProps) {
  const hasCompleted = useRef(false);

  // 성별 선택이 완료되면 자동으로 다음 단계로 진행
  useEffect(() => {
    if (onComplete && value && !disabled && !hasCompleted.current) {
      hasCompleted.current = true;
      // 약간의 지연을 두어 사용자가 선택을 완료했음을 인지할 수 있도록 함
      const timer = setTimeout(() => {
        onComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [value, onComplete, disabled]); // disabled 추가하여 수정 모드에서는 실행되지 않도록 함

  const getButtonClass = (gender: string) => {
    const isSelected = value === gender;
    return `flex-1 rounded-[0.38rem] py-3 border transition-colors ${
      isSelected
        ? 'bg-sub1 text-white border-main text-body-14-bold'
        : 'text-body-14-medium bg-gray500 text-gray300 border-gray500'
    }`;
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">성별</label>
        <label className="block text-body-14-medium text-gray300">Gender</label>
      </div>
      <div className="flex gap-[0.62rem]">
        <motion.button
          type="button"
          className={getButtonClass('MALE')}
          onClick={() => !disabled && onChange('MALE')}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled}>
          남성 (M)
        </motion.button>
        <motion.button
          type="button"
          className={getButtonClass('FEMALE')}
          onClick={() => !disabled && onChange('FEMALE')}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled}>
          여성 (F)
        </motion.button>
        <motion.button
          type="button"
          className={getButtonClass('NONE')}
          onClick={() => !disabled && onChange('NONE')}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled}>
          None
        </motion.button>
      </div>
    </div>
  );
}
