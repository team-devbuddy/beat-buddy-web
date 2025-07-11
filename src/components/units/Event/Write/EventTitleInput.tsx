// components/units/EventWrite/EventTitleInput.tsx
'use client';

export default function EventTitleInput() {
  return (
    <div className="px-5 pt-7 bg-BG-black">
      <label className="flex items-center text-white text-[1rem] font-bold mb-[0.62rem]">
        <span>이벤트명</span>
      </label>
      <input
        type="text"
        className="w-full border-b px-4 py-3 bg-BG-black text-gray100 border-gray300 placeholder-gray300 py-2 text-sm focus:outline-none"
        placeholder="이벤트명을 입력해주세요."
      />
    </div>
  );
}
