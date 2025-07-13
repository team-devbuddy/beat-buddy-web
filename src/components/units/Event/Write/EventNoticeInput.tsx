'use client';

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { eventFormState } from '@/context/recoil-context';

export default function EventNoticeInput() {
  const [eventForm, setEventForm] = useRecoilState(eventFormState);
  const [focused, setFocused] = useState(false);

  return (
    <div className="bg-BG-black px-5 pt-7">
      {/* 라벨 */}
      <label className="mb-4 flex items-center text-[1rem] font-bold text-white">
        <span>중요 공지</span>
      </label>

      {/* 입력창 + 안내 문구 */}
      <div className="relative">
        {/* 안내 문구 (입력 없고 focus도 안 됐을 때만 보임) */}
        {!focused && !eventForm.notice && (
          <div className="pointer-events-none absolute left-4 top-4 -translate-y-1/2 text-sm leading-tight text-gray300">
            <div>중요 공지 및 주의 사항을 입력해주세요.</div>
            <div>(ex. 연령 제한, 신분증 검사 등)</div>
          </div>
        )}

        <input
          type="text"
          className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-[0.75rem] text-gray100 placeholder-gray300 focus:outline-none"
          placeholder=""
          value={eventForm.notice}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setEventForm({ ...eventForm, notice: e.target.value.replace(/\n/g, ' ') })}
        />
      </div>
    </div>
  );
}
