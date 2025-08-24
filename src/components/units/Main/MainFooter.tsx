import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function MainFooter() {
  return (
    <footer className="relative px-5 pb-[0.62rem] pt-[1.5rem] text-gray100">
      <div className="relative flex flex-col items-start">
        <Image src="/icons/FooterLogo.svg" alt="Footer Vector" width={77} height={16} />
        <p className="text-[0.6875rem] tracking-[-0.01375rem] text-gray300">
          Copyright © 2025 BeatBuddy. All rights reserved.{' '}
        </p>

        <div className="pt-[0.62rem]" />
        <div className="h-[0.0625rem] w-full bg-gray300" />
        <div />
        <div className="mt-[0.62rem]">
          <p className="text-[0.6875rem] tracking-[-0.01375rem] text-gray300">
            상호명 비트버디 (BeatBuddy) | 대표이사 안수빈 | 사업자등록번호 587-04-03536 | 고객센터 070-8098-6747 |
            이메일 beatbuddykr@gmail.com | 주소 서울특별시 동대문구 서울시립대로117 청년UP플랫폼 205호
          </p>
        </div>
      </div>
    </footer>
  );
}
