'use client';
import Prev from '@/components/common/Prev';
import { accessTokenState, authState } from '@/context/recoil-context';
import { PostWithdrawal } from '@/lib/action';
import { useRouter } from 'next/navigation';
import React from 'react';
import { set } from 'react-hook-form';
import { useRecoilState } from 'recoil';
import Link from 'next/link';
import Image from 'next/image';

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
      <div className="flex items-center px-5 pb-[0.88rem] pt-[0.62rem]">
        <Link href={'/mypage/manage'}>
          <Image src="/icons/arrow_back_ios.svg" alt="back" width={24} height={24} />
        </Link>
      </div>
      <div className="flex flex-col px-5">
        <h1 className="py-2 text-[1.5rem] font-bold leading-9 text-white">
          비트버디 회원을
          <br />
          탈퇴하시겠습니까?
        </h1>

        <div className="mt-[2.5rem] flex flex-col gap-3 text-[0.875rem]">
          <p className="text-gray100">회원 탈퇴 시,</p>
          <p className="pt-5 text-gray300 text-[0.8125rem]">비트버디에서의 모든 활동 내역이 삭제됩니다.</p>
          <p className="text-gray300 text-[0.8125rem]">삭제된 정보는 다시 복구할 수 없습니다.</p>
          <p className="text-gray300 text-[0.8125rem]">
            비트버디에 재가입하셔도, 정보는 자동으로 복구되지
            <br /> 않습니다.
          </p>
          <p className="text-gray300 text-[0.8125rem]">
            문의 사항이 있으시다면, beatbuddykr@gmail.com으로
            <br /> 연락 부탁드립니다.
          </p>

          <p className="mt-[2.5rem] text-gray300 text-[0.8125rem]">더 나은 비트버디가 되도록 노력하겠습니다. 감사합니다.</p>
        </div>
      </div>

      <div className="fixed bottom-5 flex w-full justify-center px-5">
        <button
          onClick={onClickWithdraw}
          className="flex w-full justify-center rounded-[0.5rem] bg-main py-4 text-center text-[1rem] text-sub2 font-bold">
          탈퇴하기
        </button>
      </div>
    </div>
  );
}
