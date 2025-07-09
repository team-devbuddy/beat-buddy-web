'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function BoardProfileHeader() {
  const router = useRouter();

  return (
    <header className="flex items-center bg-BG-black py-[1rem] pl-[0.62rem] pr-4 text-white">
      <Image
        src="/icons/line-md_chevron-left.svg"
        alt="뒤로가기"
        width={24}
        height={24}
        onClick={() => router.back()}
        className="cursor-pointer"
      />
    </header>
  );
}
