'use client';
import { eventState, participateFormState } from '@/context/recoil-context';
import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useParams } from 'next/navigation';
import { getEventDetail } from '@/lib/actions/event-controller/getEventDetail';
import { useEffect, useState } from 'react';
import { EventDetail } from '@/lib/types';
import { accessTokenState } from '@/context/recoil-context';

export default function DepositInfo({
  value,
  onChange,
  disabled = false,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
  disabled?: boolean;
}) {
  const accessToken = useRecoilValue(accessTokenState);
  const form = useRecoilValue(participateFormState);
  const params = useParams();
  const eventId = params?.eventId?.toString();
  const [event, setEvent] = useState<EventDetail | null>(null);

  const depositAmount = event?.depositAmount;
  const depositAccount = event?.depositAccount;
  
  // 동행인원에 따른 총 입금 금액 계산
  const totalDepositAmount = depositAmount ? depositAmount * form.totalNumber : 0;

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEventDetail(accessToken || '', eventId || '');
      setEvent(event);
    };
    fetchEvent();
  }, [eventId]);

  return (
    <div>
      <label className="mb-[0.62rem] block text-body1-16-bold">사전 예약금 입금 여부</label>
      <p className="text-body-14-medium mb-[0.62rem] text-gray300">
        아래 계좌로 안내된 금액을 송금하셔야 예약이 확정됩니다
        <br />
        내용을 확인하셨으면 '네, 입금했어요' 버튼을 눌러주세요
      </p>
      <div className="mb-[0.62rem] rounded-[0.13rem] bg-gray500 px-4 py-3">
        <div className="mb-[0.38rem] flex justify-between">
          <span className="text-body-14-medium text-gray300">계좌</span>
          <span className="text-body-14-medium text-gray100">{depositAccount}</span>
        </div>
        <div className="mb-[0.38rem] flex justify-between">
          <span className="text-body-14-medium text-gray300">인원</span>
          <span className="text-body-14-medium text-gray100">{form.totalNumber}명</span>
        </div>
        <div className="flex justify-between">
          <span className="text-body-14-medium text-gray300">총 금액</span>
          <span className="text-body-14-medium text-gray100">{totalDepositAmount.toLocaleString()}원</span>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={disabled ? {} : { scale: 0.97 }}
        onClick={() => !disabled && onChange(!value)}
        className={`mt-2 flex w-full items-center justify-center gap-2 rounded-[0.13rem] border py-3 text-body-14-bold text-white transition-colors ${
          disabled ? 'cursor-not-allowed border-main bg-sub1' : value ? 'border-main bg-sub1' : 'border-main bg-sub1'
        }`}
        disabled={disabled}>
        네, 입금했어요
        {value && <Check size={18} className="text-green-400" />}
      </motion.button>
    </div>
  );
}