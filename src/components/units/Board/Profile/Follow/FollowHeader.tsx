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
    <div className="flex items-center justify-between bg-BG-black px-[1.25rem] py-[1rem]">
      <button onClick={handleBack} className="flex items-center justify-center" title="뒤로가기">
        <Image src="/icons/chevron-left.svg" alt="back" width={24} height={24} />
      </button>
      <h1 className="text-[1.125rem] font-bold text-white">{nickname}</h1>
      <div className="w-6"></div> {/* 균형을 위한 빈 공간 */}
    </div>
  );
}
