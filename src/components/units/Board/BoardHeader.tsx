'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useRecoilValue } from 'recoil';
import { userProfileState } from '@/context/recoil-context';

interface BoardHeaderProps {
  profileImageUrl?: string;
}

const BoardHeader = ({ profileImageUrl }: BoardHeaderProps) => {
  const router = useRouter();
  const userProfile = useRecoilValue(userProfileState);
  const defaultProfileImage = '/icons/default-profile.svg';

  return (
    <div className="flex items-center justify-between bg-BG-black px-[1.25rem] pb-[0.88rem] pt-[0.62rem]">
      <h1 className="text-[1.25rem] font-bold text-white">게시판</h1>
      <div className="flex items-center gap-[0.88rem]">
        <Image
          src="/icons/search-01-gray.svg"
          alt="search icon"
          width={24}
          height={24}
          className="cursor-pointer"
          onClick={() => router.push('/board/search')}
        />
        <Link href="/board/profile">
          <div className="relative h-[26px] w-[26px]">
            <Image
              src={profileImageUrl || defaultProfileImage}
              alt="프로필 이미지"
              width={26}
              height={26}
              className="rounded-full object-cover"
              style={{ aspectRatio: '1/1' }}
            />
            {/* 비즈니스 유저인 경우 마크 표시 */}
            {userProfile?.role === 'BUSINESS' && (
              <Image
                src="/icons/businessMark.svg"
                alt="business-mark"
                width={9}
                height={9}
                className="absolute -right-[1px] -top-[-1px] z-10 safari-icon-fix"
              />
            )}
          </div>
        </Link>
      </div>
    </div>
  );
};

export default BoardHeader;
