import Prev from '@/components/common/Prev';
import Cert from '@/components/units/OnBoarding/Cert/Cert';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function CertPage() {
  return (
    <div className="flex w-full flex-col">
      <Prev url={'/onBoarding/name'} />
      <Cert />
    </div>
  );
}
