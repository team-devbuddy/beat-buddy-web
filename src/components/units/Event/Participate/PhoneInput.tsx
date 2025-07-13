'use client';

export default function PhoneInput({ value, onChange}: { value: string; onChange: (value: string) => void }) {
  return (
      <div>
          <div className="flex items-end justify-start gap-[0.38rem] mb-[0.62rem]">
              <label className="block text-[1rem] font-bold">전화번호 </label>
              <label className="block text-gray300 text-[0.875rem]">Contact </label>
          </div>
      <input
        type="text"
        placeholder="연락 가능한 전화번호를 입력해주세요."
        className="w-full px-4 py-3 bg-BG-black border-b border-gray300 text-gray100 focus:outline-none placeholder-gray300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
