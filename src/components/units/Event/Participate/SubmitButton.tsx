'use client';

import { useRecoilValue } from 'recoil';
import { participateFormState } from '@/context/recoil-context';

export default function SubmitButton({ onClick }: { onClick: () => void }) {
  const form = useRecoilValue(participateFormState);

  const isComplete =
    form.name.trim() !== '' &&
    form.gender !== '' &&
    form.phoneNumber.length >= 9 &&
    (form.snsType === 'None' || form.snsId.trim() !== '') &&
    form.totalNumber > 0 &&
    typeof form.isPaid === 'boolean';

  return (
    <button
      type="submit"
      className={`mt-6 w-full rounded py-3 text-body2-15-bold ${
        isComplete ? 'bg-main text-sub2' : 'cursor-not-allowed bg-gray500 text-gray300'
      }`}
      onClick={isComplete ? onClick : undefined}>
      참석 등록하기
    </button>
  );
}
