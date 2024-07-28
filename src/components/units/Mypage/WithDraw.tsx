'use client';
import Prev from '@/components/common/Prev';
import { accessTokenState, authState } from '@/context/recoil-context';
import { PostWithdrawal } from '@/lib/action';
import { useRouter } from 'next/navigation';
import React from 'react';
import { set } from 'react-hook-form';
import { useRecoilState } from 'recoil';

export default function WithDraw() {
  const [access, setAccess] = useRecoilState(accessTokenState);
  const router = useRouter();
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const onClickWithdraw = async () => {
    // 회원 탈퇴 API 요청
    if (access) {
      const response = await PostWithdrawal(access);
      if (response.ok) {
        alert('회원 탈퇴가 완료되었습니다.');
        setAccess(null);
        setIsAuth(false);
        router.push('/');
      } else {
      }
    }
  };

  return (
    <div className="relative flex h-screen w-full flex-col">
      <Prev url="/mypage/option" />

      <div className="flex flex-col px-4">
        <h1 className="py-2 text-2xl font-bold leading-9 text-white">
          비트버디 회원을
          <br />
          탈퇴하시겠습니까?
        </h1>

        <div className="mt-[2.5rem] flex flex-col gap-3 text-[0.93rem]">
          <p className="text-gray100">회원 탈퇴 시,</p>
          <p className="pt-5 text-gray400">비트버디에서의 모든 활동 내역이 삭제됩니다.</p>
          <p className="text-gray400">삭제된 정보는 다시 복구할 수 없습니다.</p>
          <p className="text-gray400">
            비트버디에 재가입하셔도, 정보는 자동으로 복구되지
            <br /> 않습니다.
          </p>
          <p className="text-gray400">
            문의 사항이 있으시다면, beatbuddykr@gmail.com으로
            <br /> 연락 부탁드립니다.
          </p>

          <p className="mt-[5rem] text-gray400">더 나은 비트버디가 되도록 노력하겠습니다. 감사합니다.</p>
        </div>
      </div>

      <button
        onClick={onClickWithdraw}
        className="absolute bottom-0 flex w-full justify-center bg-main py-4 text-center text-lg font-bold">
        탈퇴하기
      </button>
    </div>
  );
}
