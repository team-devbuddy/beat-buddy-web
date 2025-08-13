import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface LogoutCompleteModalProps {
  onClose: () => void;
}

const LogoutCompleteModal: React.FC<LogoutCompleteModalProps> = ({ onClose }) => {
  const router = useRouter();

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

  const onClickLogout = () => {
    onClose();
    router.push('/');
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}>
      <div className="flex w-[20.9375rem] flex-col items-center rounded-[0.5rem] bg-BG-black px-4 pb-5 pt-[1.75rem]">
        <p className="text-[1.25rem] font-bold text-white">로그아웃 완료</p>
        <p className="mt-3 text-[0.875rem] text-gray300">다시 로그인해주세요</p>
        <button
          onClick={onClickLogout}
          className="mt-[1.56rem] w-full rounded-[0.5rem] bg-gray700 py-[0.99rem] font-bold text-main">
          로그인하기
        </button>
      </div>
    </div>
  );
};

export default LogoutCompleteModal;
