'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CustomerService = () => {
  return (
    <Link
      href="https://forms.gle/rcSfxUegbNykLnZD7"
      className="flex cursor-pointer items-center justify-between border-t border-gray500 bg-BG-black px-[1rem] pt-[1.25rem] pb-[3.75rem] text-white">
      <div>
        <span className="block text-body2-15-bold">잘못된 정보가 있나요?</span>
        <span className="mt-1 block text-body3-12-medium text-gray300">
          수정이 필요하거나 제정된 항목이라면 알려주세요!
        </span>
      </div>
      <Image src="/icons/ArrowHeadRight.svg" alt="Arrow Head right icon" width={24} height={24} />
    </Link>
  );
};

export default CustomerService;
