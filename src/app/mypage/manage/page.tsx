
import MyPageManage from '@/components/units/Mypage/MyPageManage';
import Link from 'next/link';
import Image from 'next/image';

export default function MyPageManagePage() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex items-center px-5 pt-[0.62rem] pb-[0.88rem]">
        <Link href={'/mypage'}>
          <Image src="/icons/arrow_back_ios.svg" alt="back" width={24} height={24} />
        </Link>
        <span className="text-[1.25rem] font-bold text-white">내 프로필 관리</span>
      </div>
      <MyPageManage />
    </div>
  );
}
