'use client';

import { useState, useEffect } from 'react';

export default function SNSInput2({
  snsType,
  snsId,
  onTypeChange,
  onIdChange,
  onConfirm,
  disabled = false,
}: {
  snsType: string;
  snsId: string;
  onTypeChange: (value: string) => void;
  onIdChange: (value: string) => void;
  onConfirm: () => void;
  disabled?: boolean;
}) {
  // SNS 타입을 선택하고 ID를 입력했을 때만 완료할 수 있음
  const canConfirm =
    snsType === 'None' || // SNS 없음 선택
    (snsType === 'Instagram' && snsId.trim().length > 0) || // Instagram + ID 입력
    (snsType === 'Facebook' && snsId.trim().length > 0); // Facebook + ID 입력

  // 확인 버튼을 보여줄지 결정하는 조건
  const shouldShowConfirmButton =
    snsType === 'None' || // SNS 없음 선택 시
    (snsType === 'Instagram' && snsId.trim().length > 0) || // Instagram + ID 입력 완료 시
    (snsType === 'Facebook' && snsId.trim().length > 0); // Facebook + ID 입력 완료 시

  const getButtonClass = (sns: string) => {
    const isSelected = snsType === sns;
    return `flex-1 rounded-[0.38rem] py-3 text-body-14-medium border transition-colors ${
      isSelected ? 'bg-sub1 text-white border-main text-body-14-bold' : 'bg-gray500 text-gray300 border-gray500'
    }`;
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && canConfirm) {
      onConfirm();
    }
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">SNS</label>
      </div>
      <div className="flex gap-[0.62rem]">
        <button
          type="button"
          className={getButtonClass('Instagram')}
          onClick={() => {
            if (!disabled) {
              onTypeChange('Instagram');
              onIdChange('');
            }
          }}
          disabled={disabled}>
          인스타그램
        </button>
        <button
          type="button"
          className={getButtonClass('Facebook')}
          onClick={() => {
            if (!disabled) {
              onTypeChange('Facebook');
              onIdChange('');
            }
          }}
          disabled={disabled}>
          페이스북
        </button>
        <button
          type="button"
          className={getButtonClass('None')}
          onClick={() => {
            if (!disabled) {
              onTypeChange('None');
              onIdChange('');
              // SNS 없음 선택 시 바로 다음 단계로 진행
              setTimeout(() => {
                onConfirm();
              }, 500);
            }
          }}
          disabled={disabled}>
          없음
        </button>
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
    </div>
  );
}
