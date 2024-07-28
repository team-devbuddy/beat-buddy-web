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
      <div className="flex w-[21rem] flex-col items-center rounded-lg bg-BG-black pt-[3.75rem]">
        <p className="text-xl font-bold text-white">로그아웃 완료</p>
        <p className="mt-3 text-[0.93rem] text-gray300">다시 로그인해주세요.</p>
        <button
          onClick={onClickLogout}
          className="mt-10 w-full bg-main py-4 font-bold text-BG-black hover:brightness-90">
          로그인하기
        </button>
      </div>
    </div>
  );
};

export default LogoutCompleteModal;
