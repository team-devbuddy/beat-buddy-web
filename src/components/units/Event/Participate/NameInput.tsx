'use client';

export default function NameInput({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
      <div>
          <div className="flex items-end justify-start gap-[0.38rem] mb-[0.62rem]">
              <label className="block text-[1rem] font-bold">이름 </label>
              <label className="block text-gray300 text-[0.875rem]">Name </label>
          </div>
      <input
        type="text"
        placeholder="이름을 입력해주세요."
        className="w-full px-4 py-3 bg-BG-black border-b border-gray300 text-gray100 focus:outline-none placeholder-gray300"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
