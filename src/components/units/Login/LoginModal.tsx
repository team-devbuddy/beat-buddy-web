import { useEffect } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// window 객체의 타입을 확장하여 Kakao 객체를 선언합니다.
declare global {
  interface Window {
    Kakao: any;
  }
}

interface LoginModalProps {
  onClose: () => void;
}

const LoginModal: React.FC<LoginModalProps> = ({ onClose }) => {
  const handleBackgroundClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (event.currentTarget === event.target) {
      onClose();
    }
  };

  return (
    <div
      className="absolute inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleBackgroundClick}>
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ ease: 'easeInOut', duration: 0.5 }}
        className="relative w-[342px] max-w-[600px] rounded-lg bg-BG-black pb-[2.5rem] pt-[5.25rem]">
        <button className="absolute right-7 top-7 text-white" onClick={onClose} aria-label="Close">
        <Image src="/icons/grayDelete.svg" alt="close" width={20} height={20} />
        </button>
        <div className="flex flex-col items-center justify-center">
          <h2 className="mb-3 text-center text-xl font-bold text-white">
            <p className="pb-1">버디님의 취향을</p>
            <p>저장할 계정이 필요해요</p>
          </h2>
          <p className="mb-10 text-center text-[0.9375rem] text-gray300">
            간편로그인하고 나만을 위한
            <br /> 베뉴를 추천 받아보세요
          </p>

          <Link href="https://api.beatbuddy.world/oauth2/authorization/kakao">
            <button
              // onClick={kakaoLoginHandler}
              className="flex items-center rounded-[0.38rem] bg-[#FEE500] py-[1.19rem] pl-[1.25rem] pr-20 text-black">
              <Image src="/icons/kakao.svg" alt="kakao" width={22} height={22} className="mr-8" />
              카카오톡으로 계속하기
            </button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginModal;
