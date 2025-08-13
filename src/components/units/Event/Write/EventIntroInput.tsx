'use client';

import { useState } from 'react';
import { useRecoilState } from 'recoil';
import { eventFormState } from '@/context/recoil-context';

export default function EventIntroInput() {
  const [eventForm, setEventForm] = useRecoilState(eventFormState);
  const [focused, setFocused] = useState(false);

  return (
    <div className="bg-BG-black px-5">
      <label className="mb-[1.37rem] flex items-center text-body1-16-bold text-white">
        <span>소개</span>
      </label>

      <div className="relative">
        {/* 안내문구: 입력값 없고 포커스도 없을 때만 표시 */}
        {!eventForm.content && !focused && (
          <div className="pointer-events-none absolute left-4 top-4 -translate-y-1/2 text-body-13-medium text-gray300">
            <div>이벤트에 대한 상세 소개를 입력해주세요</div>
            <div>(ex. 타임테이블, 콘텐츠 등)</div>
          </div>
        )}

        <input
          type="text"
          className={`w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-13-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
            eventForm.content ? 'border-main text-white' : ''
          }`}
          value={eventForm.content}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setEventForm({ ...eventForm, content: e.target.value.replace(/\n/g, ' ') })}
          placeholder=""
        />
      </div>
    </div>
  );
}
