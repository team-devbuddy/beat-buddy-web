'use client';

import { useRecoilState } from 'recoil';
import { eventFormState } from '@/context/recoil-context';

export default function EventTitleInput() {
  const [eventForm, setEventForm] = useRecoilState(eventFormState);

  return (
    <div className="safari-padding-fix bg-BG-black px-5 pt-7">
      <label className="mb-[0.62rem] flex items-center text-[1rem] font-bold text-white">
        <span>이벤트명</span>
      </label>
      <input
        type="text"
        className="w-full border-b border-gray300 bg-BG-black px-4  py-3 text-sm text-gray100 placeholder-gray300 focus:outline-none"
        placeholder="이벤트명을 입력해주세요."
        value={eventForm.title}
        onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
        style={{
          WebkitAppearance: 'none',
          WebkitBorderRadius: '0',
          borderRadius: '0',
        }}
      />
    </div>
  );
}
