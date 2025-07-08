'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
interface BoardHeaderProps {
  profileImageUrl?: string;
}

const BoardHeader = ({ profileImageUrl }: BoardHeaderProps) => {
  const router = useRouter();
  const defaultProfileImage = '/icons/mask Group.svg';

  return (
    <div className="flex items-center justify-between px-[1.25rem] py-[1rem] bg-BG-black">
      <h1 className="text-white text-[1.125rem] font-bold">게시판</h1>
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
  <div className="relative w-[26px] h-[26px]">
    <Image
      src={profileImageUrl || defaultProfileImage}
      alt="프로필 이미지"
      width={26}
      height={26}
      className="rounded-full object-cover"
    />
    {/* 비즈니스 유저인 경우 마크 표시 */}
    {profileImageUrl && (
      <Image
        src="/icons/businessMark.svg"
        alt="business-mark"
        width={9}
        height={9}
        className="absolute -top-[-1px] -right-[1px]"
      />
    )}
  </div>
</Link>

      </div>
    </div>
  );
};

export default BoardHeader;
