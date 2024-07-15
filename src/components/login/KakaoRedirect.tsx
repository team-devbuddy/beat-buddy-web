'use client';
import { authState, accessTokenState } from '@/context/recoil-context';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { motion } from 'framer-motion';

const KakaoRedirect: React.FC = () => {
  const searchParams = useSearchParams();
  const access = searchParams.get('access');
  const router = useRouter();
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);

  // 이 컴포넌트 진입시 access token이 있으면 recoil state에 저장 후 auth state를 true로 변경
  useEffect(() => {
    // 0.5초 뒤에 실행

    if (access) {
      setTimeout(() => {
        setAccessToken(access);
        setIsAuth(true);
        router.push('/');
      }, 500);
    }
  }, [access, setAccessToken, setIsAuth, router]);

  return <></>;
};

export default KakaoRedirect;
