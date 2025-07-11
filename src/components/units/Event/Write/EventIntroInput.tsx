// components/units/EventWrite/EventTitleInput.tsx
'use client';

export default function EventIntroInput() {
  return (
    <div className="px-5 pt-7 bg-BG-black">
      <label className="flex items-center text-white text-[1rem] font-bold mb-[0.62rem]">
        <span>소개</span>
      </label>
      <input
        type="text"
        className="w-full border-b px-4 py-3 bg-BG-black text-gray100 border-gray300 placeholder-gray300  text-sm focus:outline-none"
        placeholder="소개를 입력해주세요."
      />
    </div>
  );
}
