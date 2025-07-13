'use client';

import Image from 'next/image';

export default function PeopleCounter({ value, onChange }: { value: number; onChange: (value: number) => void }) {
  const handleDecrease = (value: number) => {
    if (value > 1) {
      onChange(value - 1);
    }
  };

  const handleIncrease = (value: number) => {
    onChange(value + 1);
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-[1rem] font-bold">동행 인원 </label>
        <label className="block text-[0.875rem] text-gray300">Accompany </label>
      </div>
      <p className="mb-[0.62rem] text-[0.875rem] text-gray300">본인 포함, 총 입장 인원 수를 입력해주세요. (ex. 3)</p>
      <div className="flex items-end justify-center gap-5">
        <button
          type="button"
          title="minus"
          onClick={() => handleDecrease(value)}
          className="rounded   bg-gray500 p-2">
          <Image src="/icons/check_indeterminate_small.svg" alt="minus" width={20} height={20} />
        </button>
        <div className="flex items-center px-8 py-3 border-b border-gray300 gap-1">
          <span className="text-[0.875rem] font-bold">{value}</span>
          <span className="text-[0.875rem] text-gray300">명</span>
        </div>
        <button type="button" title="plus" onClick={() => handleIncrease(value)} className="rounded border border-main bg-sub1 p-2">
          <Image src="/icons/add.svg" alt="plus" width={20} height={20} />
        </button>
      </div>
    </div>
  );
}
