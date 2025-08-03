'use client';

import Image from 'next/image';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState } from 'react';
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

  const handleCancel = async () => {
    if (!eventId) return;

    try {
      await deleteParticipate(eventId, accessToken);
      toast.success('참석이 취소되었습니다');
      router.push(`/event/${eventId}`);
    } catch (error) {
      console.error('참석 취소 실패:', error);
      toast.error('참석 취소에 실패했습니다');
    }
  };

  return (
    <>
      <div className="relative mx-auto flex max-w-[600px] items-center justify-between px-5 pb-[0.88rem] pt-[0.62rem]">
        {/* 왼쪽: 백버튼 */}
        <Image
          src="/icons/arrow_back_ios.svg"
          alt="뒤로가기"
          width={24}
          height={24}
          onClick={() => router.back()}
          className="cursor-pointer"
        />

        {/* 오른쪽: 취소 버튼 (취소 모드일 때만) */}
        {mode === 'edit' && (
          <button onClick={() => setShowModal(true)} className="text-[0.875rem] text-gray200 underline">
            참석 취소하기
          </button>
        )}
      </div>

      {/* 확인 모달 */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60"
            onClick={() => setShowModal(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}>
            <motion.div
              className="mx-6 rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-8 text-center"
              onClick={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}>
              <h2 className="mb-2 text-[1.25rem] font-bold text-white">참석을 취소하시겠습니까?</h2>
              <p className="mb-[1.56rem] text-[0.875rem] text-gray300">
                취소 시, 입력한 명단 정보는 자동으로 삭제됩니다.
              </p>
              <button
                onClick={handleCancel}
                className="w-full rounded-[0.5rem] bg-gray700 py-3 text-[0.875rem] font-bold text-main">
                참석 취소하기
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
