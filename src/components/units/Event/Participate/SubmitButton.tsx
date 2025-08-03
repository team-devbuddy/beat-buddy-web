'use client';

import { useRecoilValue } from 'recoil';
import { participateFormState } from '@/context/recoil-context';
import { useSearchParams } from 'next/navigation';

export default function SubmitButton({ onClick }: { onClick: () => void }) {
  const form = useRecoilValue(participateFormState);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  // 취소 모드일 때는 버튼을 표시하지 않음
  if (mode === 'edit') {
    return null;
  }

  const isComplete =
    form.name.trim() !== '' &&
    form.gender !== '' &&
    form.phoneNumber.length >= 9 &&
    (form.snsType === '' || form.snsId.trim() !== '') &&
    form.totalNumber > 0 &&
    typeof form.isPaid === 'boolean';

  return (
    <button
      type="submit"
      className={`my-6 w-full rounded py-3 text-body2-15-bold ${
        isComplete ? 'bg-main text-sub2' : 'cursor-not-allowed bg-gray500 text-gray300'
      }`}
      onClick={isComplete ? onClick : undefined}>
      참석 등록하기
    </button>
  );
}
