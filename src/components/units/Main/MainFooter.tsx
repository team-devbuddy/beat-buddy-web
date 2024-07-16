import Image from 'next/image';

export default function MainFooter() {
  return (
    <footer className="relative mt-10 bg-FooterBlack px-[1rem] py-[1.25rem] text-gray100">
      <div className="relative z-10 flex flex-col items-start">
        <span className="text-body2-15-medium">이용약관</span>
        <div className="relative my-4 h-[0.15rem] w-[1rem]">
          <Image src="/icons/FooterVector.svg" alt="Footer Vector" fill />
        </div>
        <div className="flex flex-col items-start">
          <span className="font-poppins text-lg font-bold leading-[1.40625rem] tracking-[-0.09375rem] text-gray100">
            Beat Buddy
          </span>
          <span className="mt-[0.25rem] text-body3-12-medium text-gray100">
            Copyright © 2024 BeatBuddy. All rights reserved.
          </span>
        </div>
        <div className="mt-4">
          <Image src="/icons/instagram.svg" alt="Instagram icon" width={24} height={24} />
        </div>
      </div>
    </footer>
  );
}
