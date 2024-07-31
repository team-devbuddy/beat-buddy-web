import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface RecommendationModalProps {
  archiveId: number;
  onClose: () => void;
  onConfirm: () => void;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({ archiveId, onClose, onConfirm }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="rounded-lg bg-gray700">
        <p className="px-6 py-[3.75rem] text-center text-xl font-bold text-white">해당 취향으로 다시 추천해드릴까요?</p>
        <div className="flex w-full">
          <button onClick={onClose} className="flex-1 bg-gray300 py-4 font-bold text-BG-black hover:brightness-90">
            아니요
          </button>
          <button onClick={onConfirm} className="flex-1 bg-main py-4 font-bold text-BG-black hover:brightness-90">
            네, 추천해주세요
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecommendationModal;
