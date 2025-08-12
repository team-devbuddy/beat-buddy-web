'use client';

export default function NameInput({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">이름 </label>
        <label className="text-body-14-medium block text-gray300">Name </label>
      </div>
      <input
        type="text"
        placeholder="이름을 입력해주세요"
        className={`text-body-14-medium placeholder:text-body-14-medium w-full border-b border-gray300 bg-BG-black px-4 py-3 text-white placeholder-gray300 safari-input-fix focus:outline-none ${
          disabled ? 'cursor-not-allowed' : ''
        }`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
    </div>
  );
}
