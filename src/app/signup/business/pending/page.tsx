'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useRecoilValue } from 'recoil';
import { accessTokenState } from '@/context/recoil-context';
import { getUserProfile } from '@/lib/actions/member-controller/getUserProfile';
import Image from 'next/image';

export default function BusinessPendingPage() {
  const router = useRouter();
  const accessToken = useRecoilValue(accessTokenState);

  useEffect(() => {
    const checkUserRole = async () => {
      if (!accessToken) {
        router.push('/login');
        return;
      }

      try {
        const profileData = await getUserProfile(accessToken);

        // BUSINESS_NOT가 아닌 경우 메인 페이지로 리다이렉트
        if (profileData?.role !== 'BUSINESS_NOT') {
          router.push('/');
          return;
        }
      } catch (error) {
        console.error('프로필 정보 조회 실패:', error);
        router.push('/login');
      }
    };

    checkUserRole();
  }, [accessToken, router]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-BG-black px-5 text-white">
      <div className="max-w-md text-center">
        {/* 로고 */}
        <div className="mb-8">
          <Image
            src="/icons/로그인/BeatBuddyBlackLogo.svg"
            alt="BeatBuddy Logo"
            width={120}
            height={40}
            className="mx-auto"
          />
        </div>

        {/* 심사중 아이콘 */}
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-800">
            <svg className="h-10 w-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        {/* 메시지 */}
        <h1 className="mb-[0.06rem] text-body1-16-bold text-main">관리자 심사 진행 중이에요!</h1>
        <p className="text-body-11-medium text-gray300">
          가입이 승인되면 곧바로 알려드릴게요
          <br />
          심사 기간은 보통 1-3일 소요됩니다.
        </p>

        {/* 안내사항 */}
        <div className="mb-6 mt-6 rounded-lg bg-gray-900 p-4 text-left">
          <h3 className="mb-2 font-semibold text-gray-200">심사 진행 상황</h3>
          <ul className="space-y-1 text-sm text-gray-400">
            <li>• 서류 검토 중</li>
            <li>• 사업자 등록 정보 확인</li>
            <li>• 계정 승인 대기</li>
          </ul>
        </div>

        {/* 문의 안내 */}
        <p className="text-sm text-gray-400">
          문의사항이 있으시면 <span className="text-blue-400">support@beatbuddy.world</span>로 연락해주세요.
        </p>
      </div>
    </div>
  );
}
