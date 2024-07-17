'use client';

import Image from 'next/image';

export default function LoggedOutBanner() {
  return (
    <div className="mx-[1rem] mt-[1.5rem] flex items-center justify-between rounded-md border border-main px-[1.25rem] py-[1.56rem] text-white bg-main-active">
      <span className="text-body2-15-medium">
        로그인하고 내 취향에 맞는 <br />
        베뉴를 추천 받으세요!
      </span>
      <Image src="/icons/ArrowRight.svg" alt="Arrow right icon" width={44} height={44} />
    </div>
  );
}
