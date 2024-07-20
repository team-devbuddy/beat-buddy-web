import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function Cert() {
  return (
    <>
      <div className="flex w-full flex-col px-4">
        <h1 className="py-5 text-2xl font-bold leading-9 text-white">성인 인증이 필요해요</h1>
        <div className="text-[0.93rem] text-[#7C7F83]">
          비트버디는 안전한 서비스 제공을 위해
          <br />
          19세 이상만 이용가능해요
        </div>
      </div>
      <div className="mt-[5.12rem] flex w-full justify-center">
        <Image src="/icons/19.png" width={224} height={224} alt="19" />
      </div>

      <button
        className={`absolute bottom-0 flex w-full justify-center bg-[#EE1171] py-4 text-lg font-bold text-BG-black`}>
        인증하기
      </button>
    </>
  );
}
