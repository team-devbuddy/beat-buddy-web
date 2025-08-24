'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, participateFormState, eventState } from '@/context/recoil-context';
import { postParticipate } from '@/lib/actions/event-controller/participate-controller/postParticipate';
import { getMyParticipate } from '@/lib/actions/event-controller/participate-controller/getMyParticipate';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';

type StepKey = 'name' | 'gender' | 'phone' | 'sns' | 'people' | 'deposit';

export default function ParticipationFormUnified({ eventId, mode }: { eventId: string; mode?: string | null }) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [form, setForm] = useRecoilState(participateFormState);
  const event = useRecoilValue(eventState);
  const router = useRouter();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // 키보드 상태
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // 서버 응답으로 steps 구성 (순서 고정)
  const steps = useMemo<StepKey[]>(() => {
    if (!event) return [];
    const arr: StepKey[] = [];
    if (event.receiveName) arr.push('name');
    if (event.receiveGender) arr.push('gender');
    if (event.receivePhoneNumber) arr.push('phone');
    if (event.receiveSNSId) arr.push('sns');
    if (event.receiveAccompany) arr.push('people');
    if (event.receiveMoney) arr.push('deposit'); // 조건부로 실제 진입/스킵 결정
    return arr;
  }, [event]);

  // 저장된 인덱스 복원 (없으면 0)
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`participate-step-index-${eventId}`);
      const n = saved ? Number(saved) : 0;
      return isNaN(n) ? 0 : n;
    }
    return 0;
  });

  // 현재 스텝 키
  const currentStep = steps[currentStepIndex];

  // 로컬 스토리지 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`participate-step-index-${eventId}`, String(currentStepIndex));
    }
  }, [currentStepIndex, eventId]);

  // 폼 업데이트
  const updateForm = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // 초기화
  useEffect(() => {
    setForm({
      name: '',
      gender: '',
      phoneNumber: '',
      snsType: '',
      snsId: '',
      totalNumber: 1,
      isPaid: false,
    });
    setCurrentStepIndex(0);
  }, [eventId, setForm]);

  // 수정 모드 → 기존 데이터 로딩 후 마지막 단계로
  useEffect(() => {
    if (mode === 'edit' && event) {
      (async () => {
        try {
          const my = await getMyParticipate(eventId, accessToken);
          if (my) {
            setForm({
              name: my.name || '',
              gender: my.gender === 'MALE' ? '남성 (M)' : my.gender === 'FEMALE' ? '여성 (F)' : 'None',
              phoneNumber: my.phoneNumber || '',
              snsType: my.snsType === 'INSTAGRAM' ? 'Instagram' : my.snsType === 'FACEBOOK' ? 'Facebook' : 'None',
              snsId: my.snsId || '',
              totalNumber: my.totalMember || 1,
              isPaid: my.isPaid || false,
            });
            // 모든 스텝 오픈
            setCurrentStepIndex(Math.max(0, (steps?.length || 1) - 1));
          }
        } catch (e) {
          console.error(e);
        }
      })();
    }
  }, [mode, eventId, accessToken, event, steps, setForm]);

  // 키보드 감지
  useEffect(() => {
    const handleViewportResize = () => {
      if ('visualViewport' in window) {
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport?.height || windowHeight;
        const heightDiff = windowHeight - viewportHeight;
        const threshold = 50;
        setIsKeyboardVisible(heightDiff > threshold);
        setKeyboardHeight(heightDiff > threshold ? heightDiff : 0);
      }
    };
    handleViewportResize();
    window.visualViewport?.addEventListener('resize', handleViewportResize);
    return () => window.visualViewport?.removeEventListener('resize', handleViewportResize);
  }, []);

  // 사전예약금 필요 여부(동적)
  const depositRequired = !!(event?.receiveMoney && form.totalNumber >= 5);
  const hasDepositStep = steps.includes('deposit');
  const depositIndex = steps.indexOf('deposit');

  // 다음 스텝 인덱스 계산(사전예약 스킵 고려)
  const getNextIndex = (idx: number) => {
    let next = idx + 1;
    if (next >= steps.length) return null;
    if (steps[next] === 'deposit' && !depositRequired) {
      // deposit 필요 없으면 스킵
      next = next + 1;
    }
    return next < steps.length ? next : null;
  };

  const advance = () => {
    const next = getNextIndex(currentStepIndex);
    if (next !== null) setCurrentStepIndex(next);
  };

  // people 단계에서 동행 인원 변경 시, 보증금 필요해지면 deposit 단계로 자동 진입
  useEffect(() => {
    if (!hasDepositStep) return;
    if (!depositRequired) return;
    if (currentStepIndex < 0) return;
    const idxDeposit = depositIndex;
    if (idxDeposit !== -1 && currentStepIndex < idxDeposit) {
      setCurrentStepIndex(idxDeposit);
    }
  }, [depositRequired, hasDepositStep, depositIndex, currentStepIndex]);

  // 누적 렌더링: 해당 스텝이 현재 인덱스 이하이면 보이기
  const showBlock = (k: StepKey) => {
    const idx = steps.indexOf(k);
    return idx !== -1 && idx <= currentStepIndex;
  };

  // 제출 가능 여부(보이는 마지막 단계까지 완료)
  const lastVisibleIndex = useMemo(() => {
    if (!hasDepositStep) return steps.length - 1;
    // deposit 스텝이 있지만 조건 미충족이면 people이 마지막
    if (!depositRequired) {
      const iPeople = steps.indexOf('people');
      return iPeople === -1 ? steps.length - 1 : iPeople;
    }
    return steps.length - 1;
  }, [steps, hasDepositStep, depositRequired]);

  const isOnFinalVisibleStep = currentStepIndex >= lastVisibleIndex;

  const canSubmit =
    isOnFinalVisibleStep &&
    (event?.receiveName !== true || form.name.trim().length > 0) &&
    (event?.receiveGender !== true || form.gender !== '') &&
    (event?.receivePhoneNumber !== true || form.phoneNumber.length >= 10) &&
    (event?.receiveSNSId !== true ||
      form.snsType === 'None' ||
      (form.snsType === 'Instagram' && form.snsId.trim().length > 0) ||
      (form.snsType === 'Facebook' && form.snsId.trim().length > 0)) &&
    (event?.receiveAccompany !== true || form.totalNumber > 0) &&
    (!depositRequired || form.isPaid);

  // 중앙 확인 버튼 노출 (키보드 입력형만)
  const shouldShowConfirmButton = () => {
    switch (currentStep) {
      case 'name':
        return isKeyboardVisible && form.name.trim().length > 0;
      case 'phone':
        return isKeyboardVisible && form.phoneNumber.length >= 10;
      case 'sns':
        return (
          isKeyboardVisible &&
          (form.snsType === 'None' ||
            (form.snsType === 'Instagram' && form.snsId.trim().length > 0) ||
            (form.snsType === 'Facebook' && form.snsId.trim().length > 0))
        );
      default:
        return false;
    }
  };

  const handleSubmit = async () => {
    try {
      const transformedForm = {
        name: form.name,
        gender: form.gender === '남성 (M)' ? 'MALE' : form.gender === '여성 (F)' ? 'FEMALE' : 'NONE',
        phoneNumber: form.phoneNumber,
        totalNumber: form.totalNumber,
        isPaid: form.isPaid,
        snsType: form.snsType === 'Instagram' ? 'INSTAGRAM' : form.snsType === 'Facebook' ? 'FACEBOOK' : 'NONE',
        snsId: form.snsType === 'None' ? '' : form.snsId,
      };
      await postParticipate(accessToken, eventId, transformedForm);
      if (typeof window !== 'undefined') {
        localStorage.setItem('participation-completed', 'true');
        localStorage.setItem('participation-event-id', eventId);
      }
      setShowCompletionModal(true);
    } catch (err) {
      console.error('참여 실패:', err);
      toast.error('참여 등록에 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
    router.back();
  };

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  const disabled = mode === 'edit';

  return (
    <>
      {/* 완료 모달 */}
      <AnimatePresence>
        {showCompletionModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={handleCloseModal}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-5"
            >
              <div
                className="w-full max-w-[600px] rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="mb-6 text-subtitle-20-bold text-white">참석 명단 작성이 완료되었어요!</h3>
                <button
                  onClick={handleCloseModal}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 font-bold text-gray200"
                >
                  닫기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-5 px-5 pb-6 text-white">
        {/* 이름 */}
        {showBlock('name') && (
          <motion.div key="name" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
            <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
              <label className="block text-body1-16-bold">이름</label>
              <label className="block text-body-14-medium text-gray300">Name</label>
            </div>
            <input
              type="text"
              placeholder="실명을 입력해주세요"
              className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
              value={form.name}
              onChange={(e) => updateForm('name', e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && form.name.trim().length > 0 && currentStep === 'name') {
                  advance();
                }
              }}
              disabled={disabled}
            />
          </motion.div>
        )}

        {/* 성별 */}
        {showBlock('gender') && (
          <AnimatePresence mode="wait">
            <motion.div key="gender" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">성별</label>
                <label className="block text-body-14-medium text-gray300">Gender</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['남성 (M)', '여성 (F)', 'None'].map((g) => (
                  <button
                    key={g}
                    onClick={() => {
                      if (disabled) return;
                      updateForm('gender', g);
                      if (currentStep === 'gender') advance();
                    }}
                    disabled={disabled}
                    className={`rounded-[0.38rem] py-3 text-body-14-semibold transition-colors ${
                      form.gender === g ? 'border border-main bg-sub1 text-white' : 'border border-gray500 bg-gray500 text-gray300'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* 전화번호 */}
        {showBlock('phone') && (
          <AnimatePresence mode="wait">
            <motion.div key="phone" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">전화번호</label>
                <label className="block text-body-14-medium text-gray300">Contact</label>
              </div>
              <input
                type="text"
                placeholder="연락 가능한 전화번호를 입력해주세요"
                className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
                value={formatPhoneNumber(form.phoneNumber)}
                onChange={(e) => {
                  const numbers = e.target.value.replace(/[^0-9]/g, '');
                  updateForm('phoneNumber', numbers);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && form.phoneNumber.length >= 10 && currentStep === 'phone') {
                    advance();
                  }
                }}
                maxLength={13}
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={disabled}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* SNS */}
        {showBlock('sns') && (
          <AnimatePresence mode="wait">
            <motion.div key="sns" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">SNS 아이디</label>
              </div>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {[
                  { display: '인스타그램', value: 'Instagram' },
                  { display: '페이스북', value: 'Facebook' },
                  { display: '없음', value: 'None' },
                ].map(({ display, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      if (disabled) return;
                      updateForm('snsType', value);
                      if (value === 'None' && currentStep === 'sns') {
                        advance(); // None이면 즉시 다음
                      }
                    }}
                    disabled={disabled}
                    className={`rounded-[0.38rem] py-3 text-body-14-semibold transition-colors ${
                      form.snsType === value ? 'border border-main bg-sub1 text-white' : 'border border-gray500 bg-gray500 text-gray300'
                    }`}
                  >
                    {display}
                  </button>
                ))}
              </div>

              {form.snsType !== '' && form.snsType !== 'None' && (
                <input
                  type="text"
                  placeholder={`${form.snsType === 'Instagram' ? '인스타그램' : '페이스북'} 아이디를 입력해주세요`}
                  className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
                  value={form.snsId}
                  onChange={(e) => updateForm('snsId', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && form.snsId.trim().length > 0 && currentStep === 'sns') {
                      advance();
                    }
                  }}
                  disabled={disabled}
                />
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* 동행 인원 */}
        {showBlock('people') && (
          <AnimatePresence mode="wait">
            <motion.div key="people" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items	end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">동행 인원</label>
                <label className="block text-body-14-medium text-gray300">Accompany</label>
              </div>
              <p className="mb-[0.62rem] text-body-14-medium text-gray300">본인 포함, 총 입장 인원 수를 입력해주세요 (ex. 3)</p>
              <div className="flex items-end justify-center gap-5">
                <motion.button
                  type="button"
                  title="minus"
                  onClick={() => {
                    if (disabled) return;
                    if (form.totalNumber > 1) updateForm('totalNumber', form.totalNumber - 1);
                  }}
                  className={`rounded p-2 text-body-14-medium ${disabled ? 'cursor-not-allowed bg-gray500' : 'bg-gray500'}`}
                  whileHover={disabled ? {} : { scale: 1.02 }}
                  whileTap={disabled ? {} : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  disabled={disabled}
                >
                  <Image src="/icons/check_indeterminate_small.svg" alt="minus" width={20} height={20} />
                </motion.button>
                <div className="flex items-center gap-1 border-b border-gray300 px-8 py-3">
                  <span className="min-w-[0.5rem] text-center text-body-14-bold">{form.totalNumber}</span>
                  <span className="text-body-14-medium text-gray300">명</span>
                </div>
                <motion.button
                  type="button"
                  title="plus"
                  onClick={() => {
                    if (disabled) return;
                    updateForm('totalNumber', form.totalNumber + 1);
                    // 증가 후 deposit 필요해지면 다음으로 넘어가도록(people → deposit 자동 진입)
                    if (hasDepositStep && currentStep === 'people') {
                      // depositRequired는 effect에서 감지되어 이동하므로 여기선 생략 가능
                    }
                  }}
                  className={`rounded border p-2 ${disabled ? 'cursor-not-allowed border-main bg-sub1' : 'border-main bg-sub1'}`}
                  whileHover={disabled ? {} : { scale: 1.02 }}
                  whileTap={disabled ? {} : { scale: 0.98 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 17 }}
                  disabled={disabled}
                >
                  <Image src="/icons/add.svg" alt="plus" width={20} height={20} />
                </motion.button>
              </div>
            </motion.div>
          </AnimatePresence>
        )}

        {/* 사전 예약금 (조건부 노출) */}
        {showBlock('deposit') && depositRequired && (
          <AnimatePresence mode="wait">
            <motion.div key="deposit" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">사전 예약금</label>
                <label className="block text-body-14-medium text-gray300">Deposit</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['입금 완료', '입금 예정'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      if (disabled) return;
                      updateForm('isPaid', status === '입금 완료');
                    }}
                    disabled={disabled}
                    className={`rounded-[0.38rem] py-3 text-body-14-semibold transition-colors ${
                      form.isPaid === (status === '입금 완료')
                        ? 'border border-main bg-sub1 text-white'
                        : 'border border-gray500 bg-gray500 text-gray300'
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>

              {/* 제출 버튼 (edit 아닐 때만) */}
              {mode !== 'edit' && (
                <button
                  onClick={handleSubmit}
                  className="mt-6 w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90"
                >
                  신청하기
                </button>
              )}
            </motion.div>
          </AnimatePresence>
        )}

        {/* 제출 버튼 (보이는 마지막 단계가 deposit이 아니거나, deposit 불필요한 경우) */}
        {canSubmit && (!hasDepositStep || !depositRequired) && mode !== 'edit' && (
          <AnimatePresence mode="wait">
            <motion.div key="submit" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.3 }}>
              <button
                onClick={handleSubmit}
                className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90"
              >
                신청하기
              </button>
            </motion.div>
          </AnimatePresence>
        )}
      </div>

      {/* 중앙 확인 버튼(키보드 위) */}
      {shouldShowConfirmButton() && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg"
          style={{ bottom: `${keyboardHeight}px`, transition: 'bottom 0.3s ease-out' }}
        >
          <div className="w-full max-w-[600px]">
            <button
              onClick={advance}
              disabled={mode === 'edit'}
              className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
