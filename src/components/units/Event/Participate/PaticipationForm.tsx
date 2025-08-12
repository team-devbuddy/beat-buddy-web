'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, participateFormState, eventState } from '@/context/recoil-context';
import { postParticipate } from '@/lib/actions/event-controller/participate-controller/postParticipate';
import { getMyParticipate } from '@/lib/actions/event-controller/participate-controller/getMyParticipate';
import toast from 'react-hot-toast';
import NameInput from './NameInput';
import GenderSelector from './GenderSelector';
import PhoneInput from './PhoneInput';
import SNSSelector from './SNSInput';
import PeopleCounter from './PeopleCounter';
import DepositInfo from './DepositInfo';
import SubmitButton from './SubmitButton';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ParticipateForm({ eventId, mode }: { eventId: string; mode?: string | null }) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [form, setForm] = useRecoilState(participateFormState);
  const event = useRecoilValue(eventState);
  const router = useRouter();

  const updateForm = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      gender: '',
      phoneNumber: '',
      snsType: 'None',
      snsId: '',
      totalNumber: 1,
      isPaid: false,
    });
  };

  useEffect(() => {
    resetForm();
  }, [eventId]);

  // 수정 모드일 때 기존 참석 정보 불러오기
  useEffect(() => {
    if (mode === 'edit') {
      const fetchMyParticipate = async () => {
        try {
          const myParticipate = await getMyParticipate(eventId, accessToken);
          if (myParticipate) {
            setForm({
              name: myParticipate.name || '',
              gender: myParticipate.gender || '',
              phoneNumber: myParticipate.phoneNumber || '',
              snsType: myParticipate.snsType || '',
              snsId: myParticipate.snsId || '',
              totalNumber: myParticipate.totalMember || 1,
              isPaid: myParticipate.isPaid || false,
            });
          }
        } catch (error) {
          console.error('Failed to fetch my participate info:', error);
        }
      };
      fetchMyParticipate();
    }
  }, [mode, eventId, accessToken]);

  const handleSubmit = async () => {
    try {
      const response = await postParticipate(accessToken, eventId, form);
      router.back();
    } catch (err) {
      console.error('참여 실패:', err);
    }
  };

  // 조건별 렌더링 플래그 설정
  const showGender = form.name.trim().length > 0;
  const showPhone = showGender && form.gender !== '';
  const showSNS = showPhone && form.phoneNumber.length >= 9;
  const showPeople =
    showSNS &&
    (form.snsType === '' ||
      (form.snsType === 'Instagram' && form.snsId.trim().length > 0) ||
      (form.snsType === 'Facebook' && form.snsId.trim().length > 0));
  const showDeposit = showPeople && form.totalNumber > 0 && event?.receiveMoney === true;

  // 신청 버튼 표시 조건
  const canSubmit =
    form.name.trim().length > 0 && // 이름 입력됨
    form.gender !== '' && // 성별 선택됨
    form.phoneNumber.length >= 9 && // 연락처 입력됨
    (form.snsType === '' || // SNS 없음 선택
      (form.snsType === 'Instagram' && form.snsId.trim().length > 0) || // 인스타그램 + 아이디 입력됨
      (form.snsType === 'Facebook' && form.snsId.trim().length > 0)) && // 페이스북 + 아이디 입력됨
    form.totalNumber > 0 && // 동행인원 선택됨
    (event?.receiveMoney !== true || form.isPaid); // 사전예약금이 필요하지 않거나 입금 확인됨

  return (
    <div className="flex flex-col gap-5 px-5 text-white">
      {/* 이름 입력 */}
      <NameInput value={form.name} onChange={(val) => updateForm('name', val)} disabled={mode === 'edit'} />

      {/* 성별 */}
      <AnimatePresence>
        {showGender && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}>
            <GenderSelector
              value={form.gender}
              onChange={(val) => updateForm('gender', val)}
              disabled={mode === 'edit'}
            />
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
            <PhoneInput
              value={form.phoneNumber}
              onChange={(val) => updateForm('phoneNumber', val)}
              disabled={mode === 'edit'}
            />
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
              disabled={mode === 'edit'}
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
            <PeopleCounter
              value={form.totalNumber}
              onChange={(val) => updateForm('totalNumber', val)}
              disabled={mode === 'edit'}
            />
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
            <DepositInfo value={form.isPaid} onChange={(val) => updateForm('isPaid', val)} disabled={mode === 'edit'} />
            {mode !== 'edit' && <SubmitButton onClick={handleSubmit} />}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 신청 버튼 (사전예약금이 필요하지 않은 경우) */}
      <AnimatePresence>
        {canSubmit && !showDeposit && mode !== 'edit' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}>
            <SubmitButton onClick={handleSubmit} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
