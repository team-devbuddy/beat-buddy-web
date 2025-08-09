'use client';

import { useState, useEffect } from 'react';
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
      // 무료 입장으로 변경할 때 사전 예약금 관련 상태 초기화
      receiveMoney: nextFree ? false : eventForm.receiveMoney,
      depositAccount: nextFree ? '' : eventForm.depositAccount,
      depositAmount: nextFree ? '' : eventForm.depositAmount,
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

  // 무료 입장이 체크되어 있으면 입장료를 "0"으로 설정
  useEffect(() => {
    if (eventForm.isFreeEntrance && eventForm.entranceFee !== '0') {
      setEventForm({
        ...eventForm,
        entranceFee: '0',
      });
    }
  }, [eventForm.isFreeEntrance, eventForm.entranceFee, setEventForm]);

  return (
    <div className="bg-BG-black px-5 text-white">
      {/* 입장료 라벨 */}
      <label className="mb-[0.62rem] flex items-center justify-between">
        <span className="text-[1rem] font-bold">입장료</span>
        <div
          onClick={handleToggleFree}
          className={`flex cursor-pointer items-center justify-center gap-[0.25rem] text-[0.75rem] text-gray300 ${
            eventForm.isFreeEntrance ? 'text-main' : ''
          }`}>
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
      <div className="relative mb-[1.37rem]">
        <input
          type="text"
          placeholder="ex. 10,000"
          className={`w-full border-b border-gray300 bg-BG-black px-4 py-3 pr-10 text-[0.8125rem] text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
            eventForm.entranceFee ? 'border-main text-white' : ''
          }`}
          value={eventForm.entranceFee ? Number(eventForm.entranceFee).toLocaleString() : ''}
          onChange={handleFeeChange}
          disabled={eventForm.isFreeEntrance}
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[0.8125rem] text-gray300">원</span>
      </div>

      {/* 특이사항 입력창 + 안내 텍스트 */}
      <div className="relative">
        {!noteFocused && !eventForm.entranceNotice && (
          <div className="pointer-events-none absolute left-4 top-4 -translate-y-1/2 text-[0.8125rem] leading-tight text-gray300">
            <div>[선택] 입장료 관련 특이 사항을 입력해주세요.</div>
            <div>(ex. 프리드링크, 환불 조건 등)</div>
          </div>
        )}
        <input
          type="text"
          placeholder=""
          className={`w-full border-b border-gray300 bg-BG-black px-4 py-3 text-[0.8125rem] text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
            eventForm.entranceNotice ? 'border-main text-white' : ''
          }`}
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
