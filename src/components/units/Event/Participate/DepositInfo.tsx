'use client';
import { eventState } from '@/context/recoil-context';
import { useRecoilValue } from 'recoil';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react'; // Lucide 아이콘 사용 중이면 이거 추가
import { useParams } from 'next/navigation';
import { getEventDetail } from '@/lib/actions/event-controller/getEventDetail';
import { useEffect, useState } from 'react';
import { EventDetail } from '@/lib/types';
import { accessTokenState } from '@/context/recoil-context';

export default function DepositInfo({ value, onChange }: { value: boolean; onChange: (value: boolean) => void }) {
  const accessToken = useRecoilValue(accessTokenState);
  const params = useParams();
  const eventId = params?.eventId?.toString();
  const [event, setEvent] = useState<EventDetail | null>(null);

  const depositAmount = event?.depositAmount;
  const depositAccount = event?.depositAccount;

  useEffect(() => {
    const fetchEvent = async () => {
      const event = await getEventDetail(accessToken || '', eventId || '');
      setEvent(event);
    };
    fetchEvent();
  }, [eventId]);
  return (
    <div>
      <label className="mb-[0.62rem] block text-[1rem] font-bold">사전 예약금 입금 여부</label>
      <p className="mb-[0.62rem] text-[0.875rem] text-gray300">
        아래 계좌로 안내된 금액을 송금하셔야 예약이 확정됩니다.
        <br />
        내용을 확인하셨으면 '네, 입금했어요' 버튼을 눌러주세요.
      </p>
      <div className="mb-[0.62rem] rounded-[0.13rem] bg-gray500 px-4 py-3">
        <div className="mb-[0.38rem] flex justify-between">
          <span className="text-[0.875rem] text-gray300">계좌</span>
          <span className="text-[0.875rem] text-gray100">{depositAccount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-[0.875rem] text-gray300">금액</span>
          <span className="text-[0.875rem] text-gray100">{depositAmount}원</span>
        </div>
      </div>

      <motion.button
        type="button"
        whileTap={{ scale: 0.97 }}
        onClick={() => onChange(!value)}
        className={`w-full mt-2 flex items-center justify-center gap-2 rounded-[0.13rem] border py-3 text-body2-15-bold text-white transition-colors ${
          value ? 'bg-sub1 border-main' : 'bg-sub1 border-main'
        }`}
      >
        네, 입금했어요
        {value && <Check size={18} className="text-green-400" />}
      </motion.button>
    </div>
  );
}
