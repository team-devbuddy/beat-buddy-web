'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getUserProfile } from '@/lib/actions/member-controller/getUserProfile';
import Image from 'next/image';

export default function BusinessPendingPage() {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState) || '';

  useEffect(() => {
    const checkUserRole = async () => {
      try {
        const profileData = await getUserProfile(accessToken);

        // BUSINESS_NOT가 아닌 경우에만 메인 페이지로 리다이렉트
        if (profileData?.role && profileData.role !== 'BUSINESS_NOT') {
          console.log('🔍 pending 페이지 - BUSINESS_NOT가 아님, /로 이동:', profileData.role);
          router.push('/');
          return;
        }

        console.log('🔍 pending 페이지 - BUSINESS_NOT 확인됨, 페이지 유지');
      } catch (error) {
        console.error('🔍 pending 페이지 - 프로필 정보 조회 실패:', error);
        router.push('/login');
      }
    };

    checkUserRole();
  }, [accessToken, router]);

  return (
    <div className="flex h-screen items-center justify-center text-center">
      <div className="flex flex-col items-center">
        <Image src="/icons/MainLogo.svg" alt="check" width={69} height={64.69} className="mb-2" />
        <h1 className="mb-[0.06rem] text-body1-16-bold text-main">비지니스 계정 관리자 심사 진행 중이에요!</h1>
        <p className="text-body-11-medium text-gray300">심사 기간은 보통 1-3일 정도 걸려요</p>
      </div>
    </div>
  );
}
