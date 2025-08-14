'use client';
import { useRouter } from 'next/navigation';
import Prev from './common/Prev';
import { accessTokenState, authState } from '@/context/recoil-context';
import { useRecoilState } from 'recoil';
import { useState } from 'react';
import { GetOnBoardingStatus } from '@/lib/action';

export default function AdminLogin() {
  const router = useRouter();
  const [id, setId] = useState('');
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [access, setAccess] = useRecoilState(accessTokenState);

  const onClickSubmit = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setAccess(data.access);
        setIsAuth(true);
        if (access) {
          const response2 = await GetOnBoardingStatus(access);
          if (response2.ok) {
            const responseJson = await response2.json();
            if (responseJson.adultCert === false) {
              router.push('/onBoarding');
            }
            // 성인 인증 X && 장르, 분위기, 지역 선택 X
            else if (responseJson.genre === false || responseJson.mood === false || responseJson.region === false) {
              router.push('/onBoarding');
            }
            // 성인 인증 O && 장르, 분위기, 지역 선택 O %responseJson.adultCert &&
            else if (responseJson.genre && responseJson.mood && responseJson.region) {
              setIsAuth(true);
              router.push('/');
            }
            // 성인 인증 O && 장르, 분위기, 지역 선택 X
            // else if (responseJson.adultCert && (!responseJson.genre || !responseJson.mood || !responseJson.region)) {
            //   router.push('/onBoarding');
            // }
          }
        }
      }
    } catch (error) {
      console.error('Admin login failed:', error);
      // 에러 처리 로직 추가 가능
    }
  };

  const onChangeId = (e: React.ChangeEvent<HTMLInputElement>) => {
    setId(e.target.value);
  };

  return (
    <>
      <div className="flex h-screen w-full flex-col items-center">
        <Prev url="/" />

        <div className="0 mt-28 flex w-[90%] flex-col items-center rounded-lg py-8 pb-4 pt-12">
          <div className="w-[80%]">
            <h1 className="text-[1.5rem] text-white">어드민 로그인</h1>
          </div>
          <input
            placeholder="비밀버디"
            onChange={onChangeId}
            className="mt-[2.75rem] w-[80%] rounded-sm border-b border-white bg-BG-black px-2 py-4 text-white outline-none"
          />
          <button onClick={onClickSubmit} className="mt-3 w-[80%] bg-main py-3 text-xs font-semibold">
            로그인
          </button>
        </div>
      </div>
    </>
  );
}
