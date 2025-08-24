'use client';

import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  const router = useRouter();

  const handleCreateProfile = () => {
    onClose();
    router.push('/board/profile/create');
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-5" onClick={onClose}>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        transition={{ duration: 0.2 }}
        className="w-full rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-6 text-center"
        onClick={(e) => e.stopPropagation()}>
        <h3 className="mb-[0.37rem] text-subtitle-20-bold text-white">아직 게시판 프로필이 없어요!</h3>
        <p className="mb-5 text-center text-body-14-medium text-gray300">게시판에서 활동하려면 프로필이 필요해요</p>
        <div className="flex justify-between gap-3">
          <button
            onClick={handleCreateProfile}
            className="w-full rounded-[0.5rem] bg-gray700 px-[0.5rem] py-3 text-button-bold text-main">
            프로필 만들기
          </button>
        </div>
      </motion.div>
    </div>,
    document.body,
  );
}
