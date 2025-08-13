'use client';

import { useRecoilState, useRecoilValue } from 'recoil';
import { accessTokenState, participateFormState, eventState } from '@/context/recoil-context';
import { postParticipate } from '@/lib/actions/event-controller/participate-controller/postParticipate';
import { getMyParticipate } from '@/lib/actions/event-controller/participate-controller/getMyParticipate';
import toast from 'react-hot-toast';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function ParticipationFormUnified({ eventId, mode }: { eventId: string; mode?: string | null }) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [form, setForm] = useRecoilState(participateFormState);
  const event = useRecoilValue(eventState);
  const router = useRouter();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // 키보드 상태 관리 (SignupBusiness와 동일)
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // localStorage에서 currentStep 복원 또는 초기값 설정
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`participate-step-${eventId}`);
      const initialStep = saved ? parseInt(saved) : 1;
      return initialStep;
    }
    return 1;
  });

  // currentStep이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`participate-step-${eventId}`, currentStep.toString());
    }
  }, [currentStep, eventId]);

  const updateForm = <K extends keyof typeof form>(key: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const resetForm = () => {
    setForm({
      name: '',
      gender: '',
      phoneNumber: '',
      snsType: '',
      snsId: '',
      totalNumber: 1,
      isPaid: false,
    });
    setCurrentStep(1);
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
            setCurrentStep(5);
          }
        } catch (error) {
          console.error('Failed to fetch my participate info:', error);
        }
      };
      fetchMyParticipate();
    }
  }, [mode, eventId, accessToken]);

  // VisualViewport API를 사용한 키보드 감지 (SignupBusiness와 동일)
  useEffect(() => {
    const handleViewportResize = () => {
      if ('visualViewport' in window) {
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport?.height || windowHeight;
        const heightDiff = windowHeight - viewportHeight;
        const threshold = 50; // 50px 이상 차이나야 키보드로 인식

        if (heightDiff > threshold) {
          setIsKeyboardVisible(true);
          setKeyboardHeight(heightDiff);
        } else {
          setIsKeyboardVisible(false);
          setKeyboardHeight(0);
        }
      }
    };

    // 초기 상태 설정
    handleViewportResize();

    // 이벤트 리스너 등록
    if ('visualViewport' in window) {
      window.visualViewport?.addEventListener('resize', handleViewportResize);
    }

    return () => {
      if ('visualViewport' in window) {
        window.visualViewport?.removeEventListener('resize', handleViewportResize);
      }
    };
  }, []);

  const handleSubmit = async () => {
    try {
      const response = await postParticipate(accessToken, eventId, form);
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

  // 현재 단계에서 확인 버튼을 보여줄지 결정 (SignupBusiness와 동일)
  const shouldShowConfirmButton = () => {
    switch (currentStep) {
      case 1: // 이름 입력
        return isKeyboardVisible && form.name.trim().length > 0;
      case 2: // 성별 선택
        return isKeyboardVisible && form.gender !== '';
      case 3: // 전화번호 입력
        return isKeyboardVisible && form.phoneNumber.length >= 10;
      case 4: // SNS 입력
        return (
          isKeyboardVisible &&
          (form.snsType === 'None' ||
            (form.snsType === 'Instagram' && form.snsId.trim().length > 0) ||
            (form.snsType === 'Facebook' && form.snsId.trim().length > 0))
        ); // 키보드가 보이고 SNS 타입이 선택되고 아이디가 입력된 경우에만 표시
      default:
        return false;
    }
  };

  // 중앙 확인 버튼 클릭 핸들러
  const handleConfirmButtonClick = () => {
    switch (currentStep) {
      case 1:
        setCurrentStep(2);
        break;
      case 2:
        setCurrentStep(3);
        break;
      case 3:
        setCurrentStep(4);
        break;
      case 4:
        setCurrentStep(5);
        break;
      default:
        break;
    }

    // 키보드 숨김
    setIsKeyboardVisible(false);
  };

  // 조건별 렌더링 플래그 설정 (단계별로 변경)
  const showName = event?.receiveName === true && currentStep >= 1;
  const showGender = event?.receiveGender === true && currentStep >= 2;
  const showPhone = event?.receivePhoneNumber === true && currentStep >= 3;
  const showSNS = event?.receiveSNSId === true && currentStep >= 4;
  const showPeople = event?.receiveAccompany === true && currentStep >= 5;
  // 사전예약금이 필요한 이벤트이고, 동행인원이 선택되었을 때만 표시
  const showDeposit = event?.receiveMoney === true && form.totalNumber >= 5;

  // 마지막 단계 정의 - 현재 스텝에서 다음에 보여줄 항목이 있는지 확인
  const isLastStep = () => {
    if (currentStep === 1) return !showGender;
    if (currentStep === 2) return !showPhone;
    if (currentStep === 3) return !showSNS;
    if (currentStep === 4) return !showPeople;
    if (currentStep === 5) return !showDeposit;
    return true; // 6단계 이상이면 항상 마지막
  };

  // 신청 버튼 표시 조건 - 현재 스텝에서 필요한 항목들이 모두 완료되면 활성화
  const canSubmit =
    isLastStep() &&
    (event?.receiveName !== true || form.name.trim().length > 0) &&
    (event?.receiveGender !== true || form.gender !== '') &&
    (event?.receivePhoneNumber !== true || form.phoneNumber.length >= 10) &&
    (event?.receiveSNSId !== true ||
      form.snsType === 'None' ||
      (form.snsType === 'Instagram' && form.snsId.trim().length > 0) ||
      (form.snsType === 'Facebook' && form.snsId.trim().length > 0)) &&
    (event?.receiveAccompany !== true || form.totalNumber > 0) &&
    (event?.receiveMoney !== true || form.isPaid);

  // 전화번호 포맷팅 함수
  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/[^0-9]/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 7) return `${numbers.slice(0, 3)}-${numbers.slice(3)}`;
    return `${numbers.slice(0, 3)}-${numbers.slice(3, 7)}-${numbers.slice(7)}`;
  };

  return (
    <>
      {/* 참석 완료 모달 */}
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
              className="fixed inset-0 z-50 flex items-center justify-center p-5">
              <div
                className="w-full max-w-[600px] rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
                onClick={(e) => e.stopPropagation()}>
                <h3 className="mb-6 text-subtitle-20-bold text-white">참석 명단 작성이 완료되었어요!</h3>
                <button
                  onClick={handleCloseModal}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 font-bold text-gray200">
                  닫기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-5 px-5 pb-6 text-white">
        {/* 이름 입력 */}
        {showName && (
          <motion.div
            key="name"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            transition={{ duration: 0.3 }}>
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
                if (e.key === 'Enter' && form.name.trim().length > 0) {
                  setCurrentStep(2);
                }
              }}
              disabled={mode === 'edit'}
            />
          </motion.div>
        )}

        {/* 성별 */}
        <AnimatePresence mode="wait">
          {showGender && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">성별</label>
                <label className="block text-body-14-medium text-gray300">Gender</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {['남성 (M)', '여성 (F)', 'None'].map((gender) => (
                  <button
                    key={gender}
                    onClick={() => {
                      updateForm('gender', gender);
                      setCurrentStep(3);
                    }}
                    disabled={mode === 'edit'}
                    className={`text-body-14-semibold rounded-[0.38rem] py-3 transition-colors ${
                      form.gender === gender
                        ? 'border border-main bg-sub1 text-white'
                        : 'text-body-14-semibold border border-gray500 bg-gray500 text-gray300'
                    }`}>
                    {gender}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 연락처 */}
        <AnimatePresence mode="wait">
          {showPhone && (
            <motion.div
              key="phone"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}>
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
                  if (e.key === 'Enter' && form.phoneNumber.length >= 10) {
                    setCurrentStep(4);
                  }
                }}
                maxLength={13}
                inputMode="numeric"
                pattern="[0-9]*"
                disabled={mode === 'edit'}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* SNS */}
        <AnimatePresence mode="wait">
          {showSNS && (
            <motion.div
              key="sns"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">SNS 아이디</label>
                <label className="block text-body-14-medium text-gray300">SNS ID</label>
              </div>

              {/* SNS 타입 선택 */}
              <div className="mb-4 grid grid-cols-3 gap-2">
                {[
                  { display: '인스타그램', value: 'Instagram' },
                  { display: '페이스북', value: 'Facebook' },
                  { display: '없음', value: 'None' },
                ].map(({ display, value }) => (
                  <button
                    key={value}
                    onClick={() => {
                      updateForm('snsType', value);
                      if (value === 'None') {
                        // '없음' 선택 시 다음 단계로 진행
                        if (showPeople) {
                          setCurrentStep(5); // 동행 인원 단계로
                        }
                      }
                    }}
                    disabled={mode === 'edit'}
                    className={`text-body-14-semibold rounded-[0.38rem] py-3 transition-colors ${
                      form.snsType === value
                        ? 'border border-main bg-sub1 text-white'
                        : 'text-body-14-semibold border border-gray500 bg-gray500 text-gray300'
                    }`}>
                    {display}
                  </button>
                ))}
              </div>

              {/* SNS ID 입력 (선택된 경우에만) */}
              {form.snsType !== '' && form.snsType !== 'None' && (
                <input
                  type="text"
                  placeholder={`${form.snsType === 'Instagram' ? '인스타그램' : '페이스북'} 아이디를 입력해주세요`}
                  className="w-full border-b border-gray300 bg-BG-black px-4 py-3 text-body-14-medium text-gray100 placeholder-gray300 safari-input-fix focus:outline-none"
                  value={form.snsId}
                  onChange={(e) => updateForm('snsId', e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && form.snsId.trim().length > 0) {
                      // SNS ID 입력 완료 후 다음 단계로 진행
                      if (showPeople) {
                        setCurrentStep(5); // 동행 인원 단계로
                      }
                    }
                  }}
                  disabled={mode === 'edit'}
                />
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 동행 인원 */}
        <AnimatePresence mode="wait">
          {showPeople && (
            <motion.div
              key="people"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">동행 인원</label>
                <label className="block text-body-14-medium text-gray300">Accompany</label>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[1, 2, 3, 4, 5, 6].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      updateForm('totalNumber', num);
                      setCurrentStep(6);
                    }}
                    disabled={mode === 'edit'}
                    className={`text-body-14-semibold rounded-[0.38rem] py-3 transition-colors ${
                      form.totalNumber === num
                        ? 'border border-main bg-sub1 text-white'
                        : 'text-body-14-semibold border border-gray500 bg-gray500 text-gray300'
                    }`}>
                    {num}명
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* 사전 예약금 */}
        <AnimatePresence mode="wait">
          {showDeposit && (
            <motion.div
              key="deposit"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}>
              <div className="mb-[0.62rem] flex items-end justify-start gap-[0.38rem]">
                <label className="block text-body1-16-bold">사전 예약금</label>
                <label className="block text-body-14-medium text-gray300">Deposit</label>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['입금 완료', '입금 예정'].map((status) => (
                  <button
                    key={status}
                    onClick={() => {
                      updateForm('isPaid', status === '입금 완료');
                      // 사전 예약금 선택 완료 시 신청 버튼이 나타남
                    }}
                    disabled={mode === 'edit'}
                    className={`text-body-14-semibold rounded-[0.38rem] py-3 transition-colors ${
                      form.isPaid === (status === '입금 완료')
                        ? 'border border-main bg-sub1 text-white'
                        : 'text-body-14-semibold border border-gray500 bg-gray500 text-gray300'
                    }`}>
                    {status}
                  </button>
                ))}
              </div>
              {mode !== 'edit' && (
                <button
                  onClick={handleSubmit}
                  className="mt-6 w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90">
                  신청하기
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* 신청 버튼 (사전예약금이 필요하지 않은 경우) */}
        <AnimatePresence mode="wait">
          {canSubmit && !showDeposit && mode !== 'edit' && (
            <motion.div
              key="submit"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}>
              <button
                onClick={handleSubmit}
                className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90">
                신청하기
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 중앙 확인 버튼 - 키보드 위에 표시 (SignupBusiness와 동일) */}
      {shouldShowConfirmButton() && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg"
          style={{
            bottom: `${keyboardHeight}px`,
            transition: 'bottom 0.3s ease-out',
          }}>
          <div className="w-full max-w-[600px]">
            <button
              onClick={handleConfirmButtonClick}
              disabled={mode === 'edit'}
              className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50">
              확인
            </button>
          </div>
        </div>
      )}
    </>
  );
}
