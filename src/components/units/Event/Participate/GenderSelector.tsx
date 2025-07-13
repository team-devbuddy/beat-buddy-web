'use client';

interface GenderSelectorProps {
  value: string;
  onChange: (value: string) => void;
  }

export default function GenderSelector({ value, onChange }: GenderSelectorProps) {
  const getButtonClass = (gender: string) => {
    const isSelected = value === gender;
    return `flex-1 rounded-[0.38rem] py-3 text-[0.875rem] ${
      isSelected ? 'bg-sub1 text-white border border-main font-bold' : 'bg-gray500 text-gray300'
    }`;
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-[1rem] font-bold">성별</label>
        <label className="block text-[0.875rem] text-gray300">Gender</label>
      </div>
      <div className="flex gap-[0.62rem]">
        <button type="button" className={getButtonClass('MALE')} onClick={() => onChange('MALE')}>
          남성 (M)
        </button>
        <button type="button" className={getButtonClass('FEMALE')} onClick={() => onChange('FEMALE')}>
          여성 (F)
        </button>
        <button type="button" className={getButtonClass('NONE')} onClick={() => onChange('NONE')}>
          None
        </button>
      </div>
    </div>
  );
}
