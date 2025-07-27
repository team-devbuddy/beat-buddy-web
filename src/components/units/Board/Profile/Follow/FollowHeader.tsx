'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FollowHeaderProps {
  nickname: string;
}

export default function FollowHeader({ nickname }: FollowHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between bg-BG-black px-[1.25rem] pb-[0.88rem] pt-[0.62rem]">
      <button onClick={handleBack} className="flex items-center justify-center" title="뒤로가기">
        <Image src="/icons/arrow_back_ios.svg" alt="back" width={24} height={24} />
      </button>
      <h1 className="text-[1rem] font-bold text-white">{nickname}</h1>
      <div className="w-6"></div> {/* 균형을 위한 빈 공간 */}
    </div>
  );
}
