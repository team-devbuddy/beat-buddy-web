'use client';

export default function PhoneInput({
  value,
  onChange,
  disabled = false,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (input: string) => {
    // 숫자만 추출
    const numbers = input.replace(/[^0-9]/g, '');

    // 길이에 따라 하이픈 추가
    if (numbers.length <= 3) {
      return numbers;
    } else if (numbers.length <= 7) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    } else if (numbers.length <= 11) {
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
    } else {
      // 11자리 초과 시 11자리까지만
      return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
    }
  };

  // 입력값 검증 함수
  const validatePhoneNumber = (input: string) => {
    const numbers = input.replace(/[^0-9]/g, '');

    // 각 구간별로 완성 여부 확인
    if (numbers.length < 3) return false; // 첫 번째 구간 미완성
    if (numbers.length < 7) return false; // 두 번째 구간 미완성
    if (numbers.length < 11) return false; // 세 번째 구간 미완성

    return true; // 모든 구간 완성
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatPhoneNumber(inputValue);
    onChange(formattedValue);
  };

  return (
    <div>
      <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
        <label className="block text-body1-16-bold">전화번호 </label>
        <label className="text-body-14-medium block text-gray300">Contact </label>
      </div>
      <input
        type="text"
        placeholder="연락 가능한 전화번호를 입력해주세요"
        className={`text-body-14-medium w-full border-b border-gray300 bg-BG-black px-4 py-3 text-gray100 placeholder-gray300 safari-input-fix focus:outline-none ${
          disabled ? 'cursor-not-allowed ' : ''
        }`}
        value={value}
        onChange={handleInputChange}
        maxLength={13}
        pattern="[0-9]{3}-[0-9]{4}-[0-9]{4}"
        title="전화번호 형식: 010-1234-5678"
        disabled={disabled}
      />
    </div>
  );
}
