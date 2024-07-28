'use client';
import { accessTokenState, authState } from '@/context/recoil-context';
import { PostLogout } from '@/lib/action';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecoilState } from 'recoil';
import { useState } from 'react';
import ConfirmLogoutModal from './Logout/ConfirmLogoutModal';
import LogoutCompleteModal from './Logout/LogoutCompleteModal';

export default function MyPageOption() {
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [access, setAccess] = useRecoilState(accessTokenState);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showLogoutComplete, setShowLogoutComplete] = useState(false);
  const router = useRouter();

  const onClickLogout = () => {
    setShowConfirmLogout(true);
  };

  const handleLogout = async () => {
    if (access) {
      const response = await PostLogout(access);
      if (response.ok) {
        setIsAuth(false);
        setAccess(null);
        setShowConfirmLogout(false);
        setShowLogoutComplete(true);
      }
    }
  };

  const handleCloseLogoutComplete = () => {
    setShowLogoutComplete(false);
    router.push('/');
  };

  return (
    <div className="flex flex-col">
      <div className="px-4 py-2">
        <p className="text-2xl font-bold text-white">설정</p>
      </div>

      <div className="flex flex-col pt-7">
        <Link href="/mypage/option/nickname">
          <div className="flex cursor-pointer items-center justify-between px-4 py-5 hover:bg-gray700">
            <div className="font-bold text-white">닉네임 수정</div>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        <Link href="/mypage/option/notice">
          <div className="flex cursor-pointer items-center justify-between px-4 py-5 hover:bg-gray700">
            <div className="font-bold text-white">공지사항</div>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        <div
          onClick={onClickLogout}
          className="flex cursor-pointer items-center justify-between px-4 py-5 hover:bg-gray700">
          <div className="font-bold text-white">로그아웃</div>
          <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
        </div>

        <Link href="/mypage/option/withdrawal">
          <div className="flex cursor-pointer items-center justify-between px-4 py-5 hover:bg-gray700">
            <div className="font-bold text-white">회원 탈퇴</div>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>
      </div>

      {showConfirmLogout && (
        <ConfirmLogoutModal onConfirm={handleLogout} onCancel={() => setShowConfirmLogout(false)} />
      )}

      {showLogoutComplete && <LogoutCompleteModal onClose={handleCloseLogoutComplete} />}
    </div>
  );
}
