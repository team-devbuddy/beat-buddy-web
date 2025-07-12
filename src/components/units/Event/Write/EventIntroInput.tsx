'use client';

import { useState } from 'react';

export default function EventIntroInput() {
  const [intro, setIntro] = useState('');
  const [focused, setFocused] = useState(false);

  return (
    <div className="px-5 pt-7 bg-BG-black">
      <label className="mb-4 flex items-center text-[1rem] font-bold text-white">
        <span>소개</span>
      </label>

      <div className="relative">
        {/* 안내문구: 입력값 없고 포커스도 없을 때만 표시 */}
        {!intro && !focused && (
          <div className="pointer-events-none absolute left-4 top-4 -translate-y-1/2 text-sm leading-tight text-gray300">
            <div>이벤트에 대한 상세 소개를 입력해주세요.</div>
            <div>(ex. 타임테이블, 콘텐츠 등)</div>
          </div>
        )}

        <input
          type="text"
          className="w-full border-b px-4 py-3 bg-BG-black text-gray100 border-gray300 placeholder-gray300 text-sm focus:outline-none"
          value={intro}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onChange={(e) => setIntro(e.target.value.replace(/\n/g, ' '))}
          placeholder="" // 빈 placeholder (안내문구는 따로 만듦)
        />
      </div>
    </div>
  );
}
