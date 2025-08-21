'use client';
import { authState, accessTokenState, isBusinessState } from '@/context/recoil-context';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { GetOnBoardingStatus, PostRefresh } from '@/lib/action';
import { getProfileinfo } from '@/lib/actions/boardprofile-controller/getProfileinfo';

const GoogleRedirect: React.FC = () => {
  const searchParams = useSearchParams();
  const access = searchParams.get('access');
  const router = useRouter();
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [accessToken, setAccessToken] = useRecoilState(accessTokenState);
  const isBusiness = useRecoilValue(isBusinessState); // 비즈니스 상태 확인
  const setIsBusiness = useSetRecoilState(isBusinessState); // 비즈니스 상태 설정

  // 사용자 프로필에서 role을 확인하여 isBusinessState 업데이트
  const updateBusinessState = async (token: string) => {
    try {
      const profileData = await getProfileinfo(token);
      console.log('🔍 사용자 프로필 데이터:', profileData);
      console.log('🔍 profileData.role:', profileData?.role);
      console.log('🔍 profileData.role 타입:', typeof profileData?.role);

      // role이 ADMIN 또는 BUSINESS인지 확인
      const isBusinessUser =
        profileData?.role === 'ADMIN' || profileData?.role === 'BUSINESS' || profileData?.role === 'BUSINESS_NOT';
      console.log('🔍 비즈니스 사용자 여부:', isBusinessUser, 'role:', profileData?.role);
      console.log('🔍 ADMIN 비교:', profileData?.role === 'ADMIN');
      console.log('🔍 BUSINESS 비교:', profileData?.role === 'BUSINESS');
      console.log('🔍 BUSINESS_NOT 비교:', profileData?.role === 'BUSINESS_NOT');

      // isBusinessState 업데이트
      setIsBusiness(isBusinessUser);
      console.log('🔍 isBusinessState 설정 완료:', isBusinessUser);
    } catch (error) {
      console.error('❌ 사용자 프로필 조회 실패:', error);
    }
  };

  // 이 컴포넌트 진입시 access token이 있으면 recoil state에 저장 후 auth state를 true로 변경
  useEffect(() => {
    const fetchUserData = async () => {
      if (access) {
        // 리프레쉬 발급
        // const refreshTokenResponse = PostRefresh(access);
        // console.log(refreshTokenResponse);

        console.log('GoogleRedirect - isBusiness 상태:', isBusiness);

        const response = await GetOnBoardingStatus(access);
        if (response.ok) {
          // 임시;
          // setIsAuth(true);
          // router.push('/');
          // Onboarding status에 따라 다른 페이지로 리디렉션
          setAccessToken(access);
          const responseJson = await response.json();

          // 사용자 프로필에서 role을 확인하여 isBusinessState 업데이트
          await updateBusinessState(access);

          // 비즈니스 쿼리 파라미터 준비 (업데이트된 isBusinessState 사용)
          const updatedIsBusiness = await getProfileinfo(access)
            .then((data) => data?.role === 'ADMIN' || data?.role === 'BUSINESS' || data?.role === 'BUSINESS_NOT')
            .catch(() => false);

          const businessQuery = updatedIsBusiness ? '?userType=business' : '';

          // 성인 인증 X
          // if (responseJson.adultCert === false) {
          //   router.push('/onBoarding/cert');
          // }
          // 성인 인증 X && 장르, 분위기, 지역 선택 X
          if (responseJson.genre === false || responseJson.mood === false || responseJson.region === false) {
            console.log(`리다이렉트: /onBoarding${businessQuery}`);
            router.push(`/onBoarding${businessQuery}`);
          }
          // 성인 인증 O && 장르, 분위기, 지역 선택 O responseJson.adultCert &&
          else if (responseJson.genre && responseJson.mood && responseJson.region) {
            if (updatedIsBusiness) {
              console.log('비즈니스 사용자 -> /onBoarding?userType=business로 이동');
              router.push(`/onBoarding?userType=business`);
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
  }, [access, setAccessToken, setIsAuth, router, isBusiness, setIsBusiness]);

  return <></>;
};

export default GoogleRedirect;
