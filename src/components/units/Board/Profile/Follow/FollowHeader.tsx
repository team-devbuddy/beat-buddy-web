'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface FollowHeaderProps {
  postProfileNickname: string;
}

export default function FollowHeader({ postProfileNickname }: FollowHeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center justify-between bg-BG-black px-[1.25rem] py-[0.87rem]">
      <button onClick={handleBack} className="flex items-center justify-center" title="뒤로가기">
        <Image src="/icons/arrow_back_ios.svg" alt="back" width={24} height={24} />
      </button>
      <h1 className="text-button-bold text-white">{postProfileNickname}</h1>
      <div className="w-6"></div> {/* 균형을 위한 빈 공간 */}
    </div>
  );
}
