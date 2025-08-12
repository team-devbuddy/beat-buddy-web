'use client';

import Image from 'next/image';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { deleteParticipate } from '@/lib/actions/event-controller/participate-controller/deleteParticipate';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

export default function EventWriteHeader() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const params = useParams();
  const mode = searchParams.get('mode');
  const eventId = params?.eventId?.toString();
  const accessToken = useRecoilValue(accessTokenState) || '';
  const [showModal, setShowModal] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  // 디버깅을 위한 로그
  console.log('🔵 EventWriteHeader 렌더링');
  console.log('🔵 mode:', mode);
  console.log('🔵 eventId:', eventId);
  console.log('🔵 showModal:', showModal);

  const handleShowModal = () => {
    console.log('🔵 handleShowModal 호출됨');
    setShowModal(true);
    console.log('🔵 setShowModal(true) 호출됨');
  };

  const handleCancel = async () => {
    if (!eventId) return;

    console.log('🔴 handleCancel 호출됨, eventId:', eventId);
    console.log('🔴 현재 showModal 상태:', showModal);
    console.log('🔴 현재 showCompletionModal 상태:', showCompletionModal);

    try {
      console.log('🔴 deleteParticipate API 호출 시작');
      await deleteParticipate(eventId, accessToken);
      console.log('🔴 deleteParticipate API 호출 성공');

      // 확인 모달 닫고 바로 완료 모달 표시
      console.log('🔴 확인 모달 닫기 시작');
      setShowModal(false);
      console.log('🔴 setShowModal(false) 호출됨');

      // 약간의 지연 후 완료 모달 표시 (상태 업데이트가 완료된 후)
      setTimeout(() => {
        console.log('🔴 완료 모달 표시 시작');
        setShowCompletionModal(true);
        console.log('🔴 setShowCompletionModal(true) 호출됨');
      }, 100);

      // 2초 후 이벤트 상세 페이지로 이동
      setTimeout(() => {
        console.log('🔴 2초 후 자동 이동');
        router.push(`/event/${eventId}`);
      }, 2000);
    } catch (error) {
      console.error('🔴 참석 취소 실패:', error);
      toast.error('참석 취소에 실패했습니다.');
    }
  };

  const handleCloseCompletionModal = () => {
    setShowCompletionModal(false);
    router.push(`/event/${eventId}`);
  };

  // 모달 상태 변화 추적
  useEffect(() => {
    console.log('🟡 showModal 상태:', showModal);
  }, [showModal]);

  useEffect(() => {
    console.log('🟡 showCompletionModal 상태:', showCompletionModal);
  }, [showCompletionModal]);

  return (
    <>
      <div className="relative mx-auto flex max-w-[600px] items-center justify-between pb-[0.53rem] pl-[0.63rem] pr-4 pt-[0.53rem]">
        {/* 왼쪽: 백버튼 */}
        <Image
          src="/icons/line-md_chevron-left.svg"
          alt="뒤로가기"
          width={35}
          height={35}
          onClick={() => router.back()}
          className="cursor-pointer"
        />

        {/* 오른쪽: 취소 버튼 (취소 모드일 때만) */}
        {mode === 'edit' && (
          <button onClick={handleShowModal} className="text-body-14-medium text-gray200 underline">
            참석 취소하기
          </button>
        )}
      </div>

      {/* 확인 모달 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 p-5"
            onClick={() => setShowModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <motion.div
              className="w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-8 text-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}>
              <h2 className="mb-2 text-subtitle-20-bold text-white">참석을 취소하시겠습니까?</h2>
              <p className="mb-[1.25rem] text-body-14-medium text-gray300">
                취소 시, 입력한 명단 정보는 자동으로 삭제됩니다
              </p>
              <button
                onClick={handleCancel}
                className="w-full rounded-[0.5rem] bg-gray700 py-3 text-button-16-semibold text-main">
                참석 취소하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 참석 취소 완료 모달 */}
      <AnimatePresence>
        {showCompletionModal && (
          <>
            {/* 배경 오버레이 */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black bg-opacity-50"
              onClick={handleCloseCompletionModal}
            />

            {/* 모달 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 flex items-center justify-center">
              <div
                className="mx-5 w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
                onClick={(e) => e.stopPropagation()}>
                <h3 className="mb-6 text-subtitle-20-bold text-white">참석이 취소되었어요</h3>

                <button
                  onClick={handleCloseCompletionModal}
                  className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-16-semibold text-gray200">
                  닫기
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
