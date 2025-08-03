'use client';

export default function NameInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-[1rem] font-bold">이름 </label>
        <label className="block text-[0.875rem] text-gray300">Name </label>
      </div>
      <input
        type="text"
        placeholder="이름을 입력해주세요."
        className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-[0.875rem] text-white placeholder:text-[0.875rem] placeholder-gray300 safari-input-fix focus:outline-none"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
