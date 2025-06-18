'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface PrevProps {
  url?: string;
  onBack?: () => void;
}

export default function Prev({ url, onBack }: PrevProps) {
  const router = useRouter();

  return (
    <nav className="w-full p-4">
      <button
        type="button"
        title="뒤로가기"
        onClick={() => {
          if (onBack) {
            onBack(); // step 제어 함수 실행
          } else if (url) {
            router.push(url); // fallback URL 이동
          } else {
            router.back(); // 또는 브라우저 history 뒤로가기
          }
        }}
        className="cursor-pointer"
      >
        <Image src="/icons/backward.svg" alt="뒤로가기" width={24} height={24} />
      </button>
    </nav>
  );
}
