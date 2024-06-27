"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CustomerService = () => {
  return (
    <Link href="/customer-service">
      <div className="flex items-center justify-between px-[1rem] py-[1.25rem] text-white cursor-pointer border-t border-gray500">
        <div>
          <span className="block text-body2-15-bold">잘못된 정보가 있나요?</span>
          <span className="block text-gray300 text-body3-12-medium mt-1">수정이 필요하거나 제정된 항목이라면 알려주세요!</span>
        </div>
        <Image src="/icons/ArrowHeadRight.svg" alt="Arrow Head right icon" width={24} height={24} />
      </div>
    </Link>
  );
};

export default CustomerService;
