'use client';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative bg-FooterBlack text-gray100 px-[1rem] py-[1.25rem]">
      <div className="flex flex-col items-start relative z-10">
        <span className="text-body2-15-medium">이용약관</span>
        <div className="w-[1rem] h-[0.15rem] my-4 relative">
          <Image src="/icons/FooterVector.svg" alt="Footer Vector" layout="fill" objectFit="cover" />
        </div>
        <div className="flex flex-col items-start">
          <span className="text-gray100 font-poppins font-bold text-lg leading-[1.40625rem] tracking-[-0.09375rem]">Beat Buddy</span>
          <span className="text-gray100 text-body3-12-medium mt-[0.25rem]">Copyright © 2024 BeatBuddy. All rights reserved.</span>
        </div>
        <div className="mt-4">
          <Image src="/icons/instagram.svg" alt="Instagram icon" width={24} height={24} />
        </div>
      </div>
    </footer>
  );
}
