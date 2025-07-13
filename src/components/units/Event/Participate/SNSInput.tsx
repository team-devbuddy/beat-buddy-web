'use client';

interface SNSSelectorProps {
  snsType: string;
  snsId: string;
  onTypeChange: (value: string) => void;
  onIdChange: (value: string) => void;
}

export default function SNSSelector({ snsType, snsId, onTypeChange, onIdChange }: SNSSelectorProps) {
  const getButtonClass = (sns: string) => {
    const isSelected = snsType === sns;
    return `flex-1 rounded-[0.38rem] py-3 text-[0.875rem] ${
      isSelected ? 'bg-sub1 text-white border border-main font-bold' : 'bg-gray500 text-gray300'
    }`;
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-[1rem] font-bold">SNS</label>
        <label className="block text-[0.875rem] text-gray300">SNS</label>
      </div>
      <div className="flex gap-[0.62rem]">
        <button
          type="button"
          className={getButtonClass('Instagram')}
          onClick={() => {
            onTypeChange('Instagram');
            onIdChange('');
          }}>
          인스타그램
        </button>
        <button
          type="button"
          className={getButtonClass('Facebook')}
          onClick={() => {
            onTypeChange('Facebook');
            onIdChange('');
          }}>
          페이스북
        </button>
        <button
          type="button"
          className={getButtonClass('None')}
          onClick={() => {
            onTypeChange('None');
            onIdChange('');
          }}>
          없음
        </button>
      </div>

      {snsType === 'Instagram' && (
        <input
          type="text"
          placeholder="인스타그램 아이디를 입력해주세요."
          className="mt-3 focus:outline-none w-full border-b border-gray300 bg-BG-black px-4 py-3 text-gray100 placeholder-gray300"
          value={snsId}
          onChange={(e) => onIdChange(e.target.value)}
        />
      )}

      {snsType === 'Facebook' && (
        <input
          type="text"
          placeholder="페이스북 아이디를 입력해주세요."
          className="mt-3 focus:outline-none w-full border-b border-gray300 bg-BG-black px-4 py-3 text-gray100 placeholder-gray300"
          value={snsId}
          onChange={(e) => onIdChange(e.target.value)}
        />
      )}
    </div>
  );
}
