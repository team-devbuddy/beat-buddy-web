'use client';
import { authState, accessTokenState, isBusinessState } from '@/context/recoil-context';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { GetOnBoardingStatus, PostRefresh } from '@/lib/action';

const AppleRedirect: React.FC = () => {
  const searchParams = useSearchParams();
  const access = searchParams.get('access');
  const router = useRouter();
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const isBusiness = useRecoilValue(isBusinessState); // 비즈니스 상태 확인
  // 이 컴포넌트 진입시 access token이 있으면 recoil state에 저장 후 auth state를 true로 변경
  useEffect(() => {
    const fetchUserData = async () => {
      if (access) {
        // 리프레쉬 발급
        // const refreshTokenResponse = PostRefresh(access);
        // console.log(refreshTokenResponse);

        const response = await GetOnBoardingStatus(access);
        if (response.ok) {
          // 임시;
          // setIsAuth(true);
          // router.push('/');
          // Onboarding status에 따라 다른 페이지로 리디렉션
          setAccessToken(access);
          const responseJson = await response.json();
          // 성인 인증 X
          // if (responseJson.adultCert === false) {
          //   router.push('/onBoarding/cert');
          // }
          // 성인 인증 X && 장르, 분위기, 지역 선택 X
          if (responseJson.genre === false || responseJson.mood === false || responseJson.region === false) {
            alert('온보딩을 진행해주세요');
            const businessQuery = isBusiness ? '?userType=business' : '';
            router.push(`/onBoarding${businessQuery}`);
          }
          // 성인 인증 O && 장르, 분위기, 지역 선택 O responseJson.adultCert &&
          else if (responseJson.genre && responseJson.mood && responseJson.region) {
            setIsAuth(true);
            if (isBusiness) {
              console.log('비즈니스 사용자 -> /signup/business로 이동');
              router.push('/signup/business');
            } else {
              setIsAuth(true);
              router.push('/');
            }
          }
          // 성인 인증 O && 장르, 분위기, 지역 선택 X
          // else if (responseJson.adultCert && (!responseJson.genre || !responseJson.mood || !responseJson.region)) {
          //   router.push('/onBoarding');
          // }
        } else {
          // Onboarding 상태를 가져오는 데 실패하면 홈으로 리디렉션
          // router.push('/');
        }
      } else {
        // router.push('/');
      }
    };
    fetchUserData();
  }, [access, setAccessToken, setIsAuth, router, isBusiness]);

  return <></>;
};

export default AppleRedirect;
