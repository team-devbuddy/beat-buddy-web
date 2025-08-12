'use client';

import { useRecoilValue } from 'recoil';
import { participateFormState, eventState } from '@/context/recoil-context';
import { useSearchParams } from 'next/navigation';

export default function SubmitButton({ onClick }: { onClick: () => void }) {
  const form = useRecoilValue(participateFormState);
  const event = useRecoilValue(eventState);
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
    (event?.receiveMoney !== true || form.isPaid === true);

  return (
    <button
      type="submit"
      className={`text-button-16-semibold my-6 w-full rounded py-3 ${
        isComplete ? 'bg-main text-sub2' : 'cursor-not-allowed bg-gray500 text-gray300'
      }`}
      onClick={isComplete ? onClick : undefined}>
      참석 등록하기
    </button>
  );
}
