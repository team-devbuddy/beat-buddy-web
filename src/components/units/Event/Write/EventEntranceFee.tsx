'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRecoilState } from 'recoil';
import { eventFormState } from '@/context/recoil-context';

export default function EventEntranceFee() {
  const [eventForm, setEventForm] = useRecoilState(eventFormState);
  const [noteFocused, setNoteFocused] = useState(false);

  const handleToggleFree = () => {
    const nextFree = !eventForm.isFreeEntrance;
    setEventForm({
      ...eventForm,
      isFreeEntrance: nextFree,
      entranceFee: nextFree ? '0' : '',
    });
  };

  const handleFeeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setEventForm({
      ...eventForm,
      entranceFee: value,
      isFreeEntrance: value === '0',
    });
  };

  return (
    <div className="bg-BG-black px-5 pt-7 text-white">
      {/* 입장료 라벨 */}
      <label className="mb-2 flex items-center justify-between">
        <span className="text-[1rem] font-bold">입장료</span>
        <div
          onClick={handleToggleFree}
          className="flex cursor-pointer items-center justify-center gap-[0.25rem] text-[0.75rem] text-gray300">
          <Image
            src={eventForm.isFreeEntrance ? '/icons/check_box.svg' : '/icons/check_box_outline_blank.svg'}
            alt="checkbox"
            width={18}
            height={18}
          />
          <span>무료 입장</span>
        </div>
      </label>

      {/* 입장료 입력창 */}
      <div className="relative mb-4">
        <input
          type="text"
          placeholder="ex. 10,000"
          className="w-full border-b border-gray300 bg-BG-black px-4 py-3 pr-10 text-sm text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
          value={eventForm.entranceFee ? Number(eventForm.entranceFee).toLocaleString() : ''}
          onChange={handleFeeChange}
          disabled={eventForm.isFreeEntrance}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-gray300">원</span>
      </div>

      {/* 특이사항 입력창 + 안내 텍스트 */}
      <div className="relative">
        {!noteFocused && !eventForm.entranceNotice && (
          <div className="pointer-events-none absolute left-4 top-4 -translate-y-1/2 text-sm leading-tight text-gray300">
            <div>[선택] 입장료 관련 특이 사항을 입력해주세요.</div>
            <div>(ex. 프리드링크, 환불 조건 등)</div>
          </div>
        )}
        <input
          type="text"
          placeholder=""
          className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-sm text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
          value={eventForm.entranceNotice}
          onFocus={() => setNoteFocused(true)}
          onBlur={() => setNoteFocused(false)}
          onChange={(e) => {
            const clean = e.target.value.replace(/\n/g, ' ');
            setEventForm({ ...eventForm, entranceNotice: clean });
          }}
        />
      </div>
    </div>
  );
}
