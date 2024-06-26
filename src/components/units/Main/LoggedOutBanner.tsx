import React from 'react';
import Image from 'next/image';

export default function LoggedOutBanner() {
  return (
    <div className="flex items-center justify-between bg-main-active text-white rounded-md px-[1.25rem] py-[1.56rem] border border-main mt-[1.5rem] mx-[1rem]">
      <span className="text-body2">로그인하고 내 취향에 맞는 <br/>베뉴를 추천 받으세요!</span>
      <Image src="/icons/ArrowRight.svg" alt="Arrow right icon" width={44} height={44} />
    </div>
  );
}
