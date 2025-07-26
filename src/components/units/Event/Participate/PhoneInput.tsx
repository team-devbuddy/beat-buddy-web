'use client';

export default function PhoneInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-[1rem] font-bold">전화번호 </label>
        <label className="block text-[0.875rem] text-gray300">Contact </label>
      </div>
      <input
        type="text"
        placeholder="연락 가능한 전화번호를 입력해주세요."
        className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
