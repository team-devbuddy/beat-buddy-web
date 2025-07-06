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
              <Link href="/mypage">
        <Image
          src={profileImageUrl || defaultProfileImage}
          alt="프로필 이미지"
          width={26}
          height={26}
          className="rounded-full"
        />
        </Link>
      </div>
    </div>
  );
};

export default BoardHeader;
