'use client';
import { accessTokenState, authState } from '@/context/recoil-context';
import { useRecoilValue } from 'recoil';
import Main from '../Main/Main';
import CustomerMain from './CustomerMain';
import LoginMain from '../Login/LoginMain';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function HomeSelect() {
  const access = useRecoilValue(accessTokenState);
  const isAuth = useRecoilValue(authState);
  const router = useRouter();

  // 인증되지 않은 사용자를 로그인 페이지로 리다이렉트
  useEffect(() => {
    if (!isAuth) {
      router.push('/login');
    }
  }, [isAuth, router]);

  // 인증된 사용자만 Main 컴포넌트 렌더링
  if (!isAuth) {
    return <div>로그인 페이지로 이동 중...</div>;
  }

  return (
    <div>
      <Main />
    </div>
  );
}
