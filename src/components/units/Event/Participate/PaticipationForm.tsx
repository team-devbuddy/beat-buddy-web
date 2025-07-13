'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, participateFormState } from '@/context/recoil-context';
import { postParticipate } from '@/lib/actions/event-controller/participate-controller/postParticipate';

import NameInput from './NameInput';
import GenderSelector from './GenderSelector';
import PhoneInput from './PhoneInput';
import SNSSelector from './SNSInput';
import PeopleCounter from './PeopleCounter';
import DepositInfo from './DepositInfo';
import SubmitButton from './SubmitButton';

import { AnimatePresence, motion } from 'framer-motion';

export default function ParticipateForm({ eventId }: { eventId: string }) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [form, setForm] = useRecoilState(participateFormState);

  const updateForm = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await postParticipate(accessToken, eventId, form);
      console.log('참여 완료:', response);
    } catch (err) {
      console.error('참여 실패:', err);
    }
  };

  // 조건별 렌더링 플래그 설정
  const showGender = form.name.trim().length > 0;
  const showPhone = showGender && form.gender !== '';
  const showSNS = showPhone && form.phoneNumber.length >= 9;
  const showPeople = showSNS && (form.snsType === 'None' || form.snsId.trim().length > 0);
  const showDeposit = showPeople && form.totalNumber > 0;

  return (
    <div className="flex flex-col gap-5 p-5 text-white">
      {/* 이름 입력 */}
      <NameInput value={form.name} onChange={(val) => updateForm('name', val)} />

      {/* 성별 */}
      <AnimatePresence>
        {showGender && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}>
            <GenderSelector value={form.gender} onChange={(val) => updateForm('gender', val)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 연락처 */}
      <AnimatePresence>
        {showPhone && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}>
            <PhoneInput value={form.phoneNumber} onChange={(val) => updateForm('phoneNumber', val)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SNS */}
      <AnimatePresence>
        {showSNS && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}>
            <SNSSelector
              snsType={form.snsType}
              snsId={form.snsId}
              onTypeChange={(val) => updateForm('snsType', val)}
              onIdChange={(val) => updateForm('snsId', val)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 동행 인원 */}
      <AnimatePresence>
        {showPeople && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}>
            <PeopleCounter value={form.totalNumber} onChange={(val) => updateForm('totalNumber', val)} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* 사전 예약금 */}
      <AnimatePresence>
        {showDeposit && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}>
            <DepositInfo value={form.isPaid} onChange={(val) => updateForm('isPaid', val)} />
            <SubmitButton onClick={handleSubmit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
