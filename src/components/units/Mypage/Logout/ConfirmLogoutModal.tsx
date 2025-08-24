import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfirmLogoutModalProps {
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ isOpen, onConfirm, onCancel }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onCancel();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onCancel]);

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onCancel();
    }
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleBackgroundClick}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}>
          <motion.div
            className="mx-5 flex w-full flex-col items-center rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-[1.5rem]"
            initial={{ scale: 0.8, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.8, opacity: 0, y: 30 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}>
            <p className="text-subtitle-20-bold text-white">로그아웃</p>
            <p className="mt-[0.38rem] text-body-14-medium text-gray300">로그아웃 하시겠어요?</p>
            <div className="mt-5 flex w-full items-center gap-3">
              <button
                onClick={onCancel}
                className="w-full rounded-[0.5rem] bg-gray700 py-3 text-button-16-semibold text-gray200">
                아니요
              </button>
              <button
                onClick={onConfirm}
                className="w-full rounded-[0.5rem] bg-gray700 py-3 text-button-16-semibold text-main">
                네
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmLogoutModal;
