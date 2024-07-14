// KakaoRedirect.tsx
'use client';
import { authState, accessTokenState } from '@/context/recoil-context';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useRecoilState } from 'recoil';
import { motion } from 'framer-motion';

const KakaoRedirect: React.FC = () => {
  const params = useSearchParams();
  const code = params.get('code');
  const router = useRouter();
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const kakaoLogin = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_LINKIT_SERVER_URL}/login/kakao`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json;charset=utf-8' },
          credentials: 'include',
          body: JSON.stringify({ code }),
        });
        if (response.ok) {
          const responseData = await response.json();
          setAccessToken(responseData.accessToken);
          // setIsAuth(true)

          if (responseData.existMemberBasicInform === true && responseData.existDefaultProfile === true) {
            router.push('/');
          } else if (responseData.existMemberBasicInform === true && responseData.existDefaultProfile === false) {
            router.push(`/onBoarding/select`);
          } else {
            router.push(`/onBoarding`);
          }
        }
      } catch (error) {
        console.log('로그인 요청에 실패했습니다.', error);
      } finally {
        setLoading(false);
      }
    };
    if (code) {
      kakaoLogin();
    }
  }, [code, router, setIsAuth, setAccessToken]);

  return loading ? (
    <div className="flex h-screen flex-col items-center justify-center">
      <motion.div
        className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200 border-t-blue-500"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1 }}
      />
      <p className="mt-4 text-lg">Loading...</p>
    </div>
  ) : null;
};

export default KakaoRedirect;
