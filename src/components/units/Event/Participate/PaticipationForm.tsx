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
import SNSInput2 from './SNSInput2';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';

export default function ParticipateForm({ eventId, mode }: { eventId: string; mode?: string | null }) {
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [form, setForm] = useRecoilState(participateFormState);
  const event = useRecoilValue(eventState);
  const router = useRouter();
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // 키보드 상태 관리
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  // localStorage에서 currentStep 복원 또는 초기값 설정
  const [currentStep, setCurrentStep] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`participate-step-${eventId}`);
      const initialStep = saved ? parseInt(saved) : 1;
      console.log('🚀 초기 currentStep 설정:', initialStep, '저장된 값:', saved);
      return initialStep;
    }
    return 1;
  });

  // currentStep이 변경될 때마다 localStorage에 저장
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(`participate-step-${eventId}`, currentStep.toString());
      console.log('💾 currentStep localStorage 저장:', currentStep);
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
      snsType: 'None',
      snsId: '',
      totalNumber: 1,
      isPaid: false,
    });
    // currentStep을 1로 강제 초기화
    setCurrentStep(1);
    console.log('🔄 폼 및 currentStep 초기화됨');
  };

  useEffect(() => {
    resetForm();
  }, [eventId]); // eventId만 의존성으로 유지

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
            // 수정 모드에서는 모든 단계를 표시
            setCurrentStep(5);
          }
        } catch (error) {
          console.error('Failed to fetch my participate info:', error);
        }
      };
      fetchMyParticipate();
    }
  }, [mode, eventId, accessToken]); // currentStep 제거

  const handleSubmit = async () => {
    try {
      const response = await postParticipate(accessToken, eventId, form);
      // 참석 완료 상태를 localStorage에 저장
      if (typeof window !== 'undefined') {
        localStorage.setItem('participation-completed', 'true');
        localStorage.setItem('participation-event-id', eventId);
      }
      // 참석 완료 모달 표시
      setShowCompletionModal(true);
    } catch (err) {
      console.error('참여 실패:', err);
      toast.error('참여 등록에 실패했습니다.');
    }
  };

  const handleCloseModal = () => {
    setShowCompletionModal(false);
    // 모달 닫기 후 라우팅
    router.back();
  };

  // 단계별 진행 핸들러
  const handleNameConfirm = () => {
    setCurrentStep(2);
  };

  const handleGenderComplete = () => {
    setCurrentStep(3);
  };

  const handlePhoneConfirm = () => {
    console.log('🔵 handlePhoneConfirm 호출됨, 현재 단계:', currentStep);
    console.log('🔵 전화번호:', form.phoneNumber, '길이:', form.phoneNumber.length);
    setCurrentStep(4);
    console.log('🔵 currentStep을 4로 설정함');
  };

  const handleSNSComplete = () => {
    console.log('🔵 handleSNSComplete 호출됨, 현재 단계:', currentStep);
    setCurrentStep(5);
    console.log('🔵 currentStep을 5로 설정함');
  };

  const handlePeopleComplete = () => {
    // 동행 인원 선택 완료 시 마지막 단계로 진행
    console.log('🔵 handlePeopleComplete 호출됨, 현재 단계:', currentStep);
    setCurrentStep(5);
    console.log('🔵 currentStep을 5로 설정함');
  };

  // 중앙 확인 버튼 클릭 핸들러
  const handleConfirmButtonClick = () => {
    console.log('🔵 중앙 확인 버튼 클릭, 현재 단계:', currentStep);

    switch (currentStep) {
      case 1:
        handleNameConfirm();
        break;
      case 2:
        handleGenderComplete();
        break;
      case 3:
        handlePhoneConfirm();
        break;
      case 4:
        handleSNSComplete();
        break;
      default:
        break;
    }

    // 키보드 숨김
    setIsKeyboardVisible(false);
  };

  // VisualViewport API를 사용한 키보드 감지
  useEffect(() => {
    const handleViewportResize = () => {
      if ('visualViewport' in window) {
        const windowHeight = window.innerHeight;
        const viewportHeight = window.visualViewport?.height || windowHeight;
        const heightDiff = windowHeight - viewportHeight;
        const threshold = 50; // 50px 이상 차이나야 키보드로 인식

        console.log('🔵 PaticipationForm 키보드 감지:', { windowHeight, viewportHeight, heightDiff, threshold });

        if (heightDiff > threshold) {
          setIsKeyboardVisible(true);
          setKeyboardHeight(heightDiff);
          console.log('🔵 키보드 감지됨:', heightDiff);
        } else {
          setIsKeyboardVisible(false);
          setKeyboardHeight(0);
          console.log('🔵 키보드 없음');
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

  // currentStep 상태 변화 추적
  useEffect(() => {
    console.log('🟡 currentStep 변경됨:', currentStep);
  }, [currentStep]);

  // 조건별 렌더링 플래그 설정 (단계별로 변경)
  const showName = event?.receiveName === true && currentStep >= 1;
  const showGender = event?.receiveGender === true && currentStep >= 2;
  const showPhone = event?.receivePhoneNumber === true && currentStep >= 3;
  const showSNS = event?.receiveSNSId === true && currentStep >= 4;
  const showPeople = event?.receiveAccompany === true && currentStep >= 5;
  // 사전예약금이 필요한 이벤트이고, 동행인원이 선택되었을 때만 표시
  const showDeposit = event?.receiveMoney === true && form.totalNumber >= 5;

  // 마지막 단계 정의
  const isLastStep = showPeople; // 동행인원 선택 완료 후

  // 현재 단계에서 확인 버튼을 보여줄지 결정
  const shouldShowConfirmButton = () => {
    if (!isKeyboardVisible) return false;

    switch (currentStep) {
      case 1: // 이름 입력
        return form.name.trim().length > 0;
      case 2: // 성별 선택
        return form.gender !== '';
      case 3: // 전화번호 입력
        return form.phoneNumber.length >= 10;
      case 4: // SNS 입력
        return (
          form.snsType === 'None' ||
          (form.snsType === 'Instagram' && form.snsId.trim().length > 0) ||
          (form.snsType === 'Facebook' && form.snsId.trim().length > 0)
        );
      default:
        return false;
    }
  };

  console.log(
    '🟢 렌더링 상태 - showGender:',
    showGender,
    'showPhone:',
    showPhone,
    'showSNS:',
    showSNS,
    'showPeople:',
    showPeople,
    'isLastStep:',
    isLastStep,
  );

  // 신청 버튼 표시 조건 - 마지막 단계에서만 표시
  const canSubmit =
    isLastStep && // 마지막 단계여야 함
    form.name.trim().length > 0 && // 이름 입력됨
    form.gender !== '' && // 성별 선택됨
    form.phoneNumber.length >= 10 && // 연락처 입력됨 (10자리 이상)
    (form.snsType === '' || // SNS 없음 선택
      (form.snsType === 'Instagram' && form.snsId.trim().length > 0) || // 인스타그램 + 아이디 입력됨
      (form.snsType === 'Facebook' && form.snsId.trim().length > 0)) && // 페이스북 + 아이디 입력됨
    form.totalNumber > 0 && // 동행인원 선택됨
    (event?.receiveMoney !== true || form.isPaid); // 사전예약금이 필요하지 않거나 입금 확인됨

  return (
    <>
      {/* 참석 완료 모달 */}
      <AnimatePresence>
        {showCompletionModal && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={handleCloseModal}
            />

            {/* 모달 */}
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
          <NameInput
            value={form.name}
            onChange={(val) => updateForm('name', val)}
            onConfirm={handleNameConfirm}
            disabled={mode === 'edit'}
          />
        )}

        {/* 성별 */}
        <AnimatePresence mode="wait">
          {showGender && (
            <motion.div
              key="gender"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.3 }}>
              <GenderSelector
                value={form.gender}
                onChange={(val) => updateForm('gender', val)}
                onComplete={handleGenderComplete}
                disabled={mode === 'edit'}
              />
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
              <PhoneInput
                value={form.phoneNumber}
                onChange={(val) => updateForm('phoneNumber', val)}
                onConfirm={handlePhoneConfirm}
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
              <SNSInput2
                snsType={form.snsType}
                snsId={form.snsId}
                onTypeChange={(val) => updateForm('snsType', val)}
                onIdChange={(val) => updateForm('snsId', val)}
                onConfirm={handleSNSComplete}
                disabled={mode === 'edit'}
              />
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
              <PeopleCounter
                value={form.totalNumber}
                onChange={(val) => updateForm('totalNumber', val)}
                onComplete={handlePeopleComplete}
                disabled={mode === 'edit'}
              />
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
              <DepositInfo
                value={form.isPaid}
                onChange={(val) => updateForm('isPaid', val)}
                disabled={mode === 'edit'}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* 하단 고정 참석하기 버튼 */}
      {canSubmit && mode !== 'edit' && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-BG-black p-4 shadow-lg">
          <div className="mx-auto w-full max-w-[600px]">
            <motion.button
              onClick={handleSubmit}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90">
              참석하기
            </motion.button>
          </div>
        </div>
      )}

      {/* 중앙 확인 버튼 - 키보드 위에 표시 */}
      {shouldShowConfirmButton() && (
        <div
          className="fixed left-0 right-0 z-50 flex justify-center bg-BG-black p-4 shadow-lg"
          style={{
            bottom: `${keyboardHeight}px`,
            transition: 'bottom 0.3s ease-out',
          }}>
          <div className="w-full max-w-[600px]">
            <motion.button
              onClick={handleConfirmButtonClick}
              disabled={mode === 'edit'}
              whileHover={mode !== 'edit' ? { scale: 1.02 } : {}}
              whileTap={mode !== 'edit' ? { scale: 0.98 } : {}}
              className="w-full rounded-lg bg-main py-4 text-button-16-semibold text-sub2 transition-colors hover:bg-main/90 disabled:cursor-not-allowed disabled:opacity-50">
              확인
            </motion.button>
          </div>
        </div>
      )}
    </>
  );
}
