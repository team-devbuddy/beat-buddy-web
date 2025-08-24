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
      <div className="mx-5 flex w-full flex-col items-center rounded-[0.75rem] bg-BG-black px-5 pb-5 pt-[1.5rem]">
        <p className="text-subtitle-20-bold text-white">로그아웃 완료</p>
        <p className="mt-[0.38rem] text-body-14-medium text-gray300">다시 로그인해주세요</p>
        <button
          onClick={onClickLogout}
          className="mt-5 w-full rounded-[0.5rem] bg-gray700 py-3 text-button-16-semibold text-main">
          로그인하기
        </button>
      </div>
    </div>
  );
};

export default LogoutCompleteModal;
