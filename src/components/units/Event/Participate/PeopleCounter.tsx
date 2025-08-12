'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';

export default function PeopleCounter({
  value,
  onChange,
  onComplete,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  onComplete?: () => void;
  disabled?: boolean;
}) {
  const hasInteracted = useRef(false);
  const initialValue = useRef(value);

  // 사용자가 동행인원을 변경했을 때만 다음 단계로 진행
  useEffect(() => {
    if (onComplete && hasInteracted.current && value > 0 && !disabled) {
      // 약간의 지연을 두어 사용자가 선택을 완료했음을 인지할 수 있도록 함
      const timer = setTimeout(() => {
        onComplete();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [value, onComplete, disabled]);

  const handleDecrease = (value: number) => {
    if (value > 1) {
      hasInteracted.current = true;
      onChange(value - 1);
    }
  };

  const handleIncrease = (value: number) => {
    hasInteracted.current = true;
    onChange(value + 1);
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">동행 인원 </label>
        <label className="block text-body-14-medium text-gray300">Accompany</label>
      </div>
      <p className="mb-[0.62rem] text-body-14-medium text-gray300">본인 포함, 총 입장 인원 수를 입력해주세요 (ex. 3)</p>
      <div className="flex items-end justify-center gap-5">
        <motion.button
          type="button"
          title="minus"
          onClick={() => !disabled && handleDecrease(value)}
          className={`rounded p-2 text-body-14-medium ${disabled ? 'cursor-not-allowed bg-gray500' : 'bg-gray500'}`}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled}>
          <Image src="/icons/check_indeterminate_small.svg" alt="minus" width={20} height={20} />
        </motion.button>
        <div className="flex items-center gap-1 border-b border-gray300 px-8 py-3">
          <span className="min-w-[0.5rem] text-center text-body-14-bold">{value}</span>
          <span className="text-body-14-medium text-gray300">명</span>
        </div>
        <motion.button
          type="button"
          title="plus"
          onClick={() => !disabled && handleIncrease(value)}
          className={`rounded border p-2 ${disabled ? 'cursor-not-allowed border-main bg-sub1' : 'border-main bg-sub1'}`}
          whileHover={disabled ? {} : { scale: 1.02 }}
          whileTap={disabled ? {} : { scale: 0.98 }}
          transition={{ type: 'spring', stiffness: 400, damping: 17 }}
          disabled={disabled}>
          <Image src="/icons/add.svg" alt="plus" width={20} height={20} />
        </motion.button>
      </div>
    </div>
  );
}
