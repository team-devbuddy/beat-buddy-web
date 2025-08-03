import React, { useEffect } from 'react';

interface ConfirmLogoutModalProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmLogoutModal: React.FC<ConfirmLogoutModalProps> = ({ onConfirm, onCancel }) => {
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
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}>
      <div className="flex w-[20.9375rem] flex-col items-center rounded-lg bg-BG-black px-4 pb-5 pt-[1.75rem]">
        <p className="text-[1.25rem] font-bold text-white">로그아웃</p>
        <p className="mt-3 text-[0.875rem] text-gray300">로그아웃 하시겠어요?</p>
        <div className="mt-[1.56rem] flex w-full items-center gap-3">
          <button onClick={onCancel} className="w-full rounded-[0.5rem] bg-gray700 py-[0.99rem] font-bold text-gray200">
            아니요
          </button>
          <button onClick={onConfirm} className="w-full rounded-[0.5rem] bg-gray700 py-[0.99rem] font-bold text-main">
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
