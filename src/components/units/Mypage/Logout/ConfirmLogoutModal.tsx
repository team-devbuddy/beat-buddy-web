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
      <div className="flex w-[21rem] flex-col items-center rounded-lg bg-BG-black pt-[3.75rem]">
        <p className="text-xl font-bold text-white">로그아웃</p>
        <p className="mt-3 text-[0.93rem] text-gray300">로그아웃 하시겠어요?</p>
        <div className="mt-10 flex w-full">
          <button onClick={onCancel} className="flex-1 bg-gray300 py-4 font-bold text-BG-black hover:brightness-90">
            아니요
          </button>
          <button onClick={onConfirm} className="flex-1 bg-main py-4 font-bold text-BG-black hover:brightness-90">
            네
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmLogoutModal;
