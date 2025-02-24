'use client';

import { accessTokenState } from '@/context/recoil-context';
import { CertAdult } from '@/lib/actions/cert/cert-action';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { useRecoilValue } from 'recoil';

declare global {
  interface Window {
    IMP?: any;
  }
}

export default function Cert() {
  const access = useRecoilValue(accessTokenState) || '';
  const router = useRouter();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const initializeIAMPORT = () => {
      if (window.IMP) {
        window.IMP.init('imp25440561'); // 가맹점 식별코드를 입력하세요.
        console.log('IAMPORT loaded:', window.IMP); // IAMPORT 객체 확인
        setIsLoaded(true); // 스크립트 로드 상태 업데이트
      } else {
        console.error('IAMPORT is not loaded.');
      }
    };

    if (typeof window !== 'undefined') {
      if (!window.IMP) {
        const script = document.createElement('script');
        script.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';
        script.onload = initializeIAMPORT;
        document.body.appendChild(script);
      } else {
        initializeIAMPORT();
      }
    }
  }, []);

  const handleCertify = () => {
    if (!isLoaded || !window.IMP) {
      console.error('IAMPORT is not available.');
      return;
    }

    const { IMP } = window;

    /* 본인인증 데이터 정의하기 */
    const data = {
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      company: '아임포트', // 회사명 또는 URL
      carrier: 'SKT', // 통신사
      name: '홍길동', // 이름
      phone: '01012341234', // 전화번호
    };

    /* 본인인증 창 호출하기 */
    IMP.certification(data, async (response: any) => {
      const { success, merchant_uid, error_msg } = response;

      if (success) {
        const certResponse = await CertAdult(access, merchant_uid);

        if (certResponse.ok) {
          alert('본인인증 성공하였습니다.');
          router.push('/onBoarding/cert/complete');
        }
      } else {
        alert(`본인인증 실패: ${error_msg}`);
      }
    });
  };

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
        onClick={handleCertify}
        className="absolute bottom-0 flex w-full justify-center bg-[#EE1171] py-4 text-lg font-bold text-BG-black">
        인증하기
      </button>
    </>
  );
}
