'use client';
import { accessTokenState, authState, userProfileState } from '@/context/recoil-context';
import { PostLogout } from '@/lib/action';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useRecoilState, useRecoilValue } from 'recoil';
import { useState } from 'react';
import ConfirmLogoutModal from './Logout/ConfirmLogoutModal';
import LogoutCompleteModal from './Logout/LogoutCompleteModal';

export default function MyPageManage() {
  const [isAuth, setIsAuth] = useRecoilState(authState);
  const [access, setAccess] = useRecoilState(accessTokenState);
  const [showConfirmLogout, setShowConfirmLogout] = useState(false);
  const [showLogoutComplete, setShowLogoutComplete] = useState(false);
  const router = useRouter();
  const userProfile = useRecoilValue(userProfileState);
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
      <div className="flex flex-col">
        <Link href={`/mypage/option/nickname?edit=true&nickname=${userProfile?.nickname}`}>
          <div className="flex items-center justify-between p-5">
            <div className="flex cursor-pointer flex-col">
              <div className="text-body-14-bold text-white">닉네임 수정</div>
              <div className="text-body3-12-medium text-gray300">나만의 유니크한 닉네임으로 활동하세요!</div>
            </div>
            <Image src="/icons/Headers/Frame60Gray.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        <div onClick={onClickLogout} className="flex cursor-pointer items-center justify-between p-5 hover:bg-gray700">
          <div className="flex cursor-pointer flex-col">
            <div className="text-body-14-bold text-white">로그아웃</div>
            <div className="text-body3-12-medium text-gray300">잠시 로그아웃하고 싶다면?</div>
          </div>
          <Image src="/icons/Headers/Frame60Gray.svg" alt="edit" width={24} height={24} />
        </div>

        <Link href="/mypage/option/withdrawal">
          <div className="flex cursor-pointer items-center justify-between p-5 hover:bg-gray700">
            <div className="flex cursor-pointer flex-col">
              <div className="text-body-14-bold text-white">회원 탈퇴</div>
              <div className="text-body3-12-medium text-gray300">비트버디를 떠나신다면...</div>
            </div>
            <Image src="/icons/Headers/Frame60Gray.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>
      </div>

      {showConfirmLogout && (
        <ConfirmLogoutModal isOpen={showConfirmLogout} onConfirm={handleLogout} onCancel={() => setShowConfirmLogout(false)} />
      )}

      {showLogoutComplete && <LogoutCompleteModal onClose={handleCloseLogoutComplete} />}
    </div>
  );
}
