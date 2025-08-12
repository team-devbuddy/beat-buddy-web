'use client';
import { motion } from 'framer-motion';

interface SNSSelectorProps {
  snsType: string;
  snsId: string;
  onTypeChange: (value: string) => void;
  onIdChange: (value: string) => void;
  disabled?: boolean;
}

export default function SNSSelector({ snsType, snsId, onTypeChange, onIdChange, disabled = false }: SNSSelectorProps) {
  const getButtonClass = (sns: string) => {
    const isSelected = snsType === sns;
    return `flex-1 rounded-[0.38rem] py-3 text-body-14-medium border transition-colors ${
      isSelected ? 'bg-sub1 text-white border-main text-body-14-bold' : 'bg-gray500 text-gray300 border-gray500'
    }`;
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
          className={`text-body-14-medium mt-3 w-full border-b border-gray300 bg-BG-black px-4 py-3 text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
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
          pattern="[a-zA-Z0-9._]+"
          title="영어, 숫자, 언더스코어(_), 점(.)만 입력 가능합니다"
          disabled={disabled}
        />
      )}

      {snsType === 'Facebook' && (
        <input
          type="text"
          placeholder="페이스북 아이디를 입력해주세요"
          className={`text-body-14-medium mt-3 w-full border-b border-gray300 bg-BG-black px-4 py-3 text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
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
          pattern="[a-zA-Z0-9._]+"
          title="영어, 숫자, 언더스코어(_), 점(.)만 입력 가능합니다"
          disabled={disabled}
        />
      )}
    </div>
  );
}