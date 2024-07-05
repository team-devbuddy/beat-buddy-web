import Image from 'next/image';
import Link from 'next/link';

export default function MyPageOption() {
  return (
    <div className="flex flex-col">
      <div className="px-4 py-2">
        <p className="text-2xl font-bold text-white">설정</p>
      </div>

      <div className="flex flex-col pt-7">
        <Link href="/mypage/option/nickname">
          <div className="flex cursor-pointer items-center justify-between px-4 py-5">
            <div className="font-bold text-white">닉네임 수정</div>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        <Link href="/mypage/option/notice">
          <div className="flex cursor-pointer items-center justify-between px-4 py-5">
            <div className="font-bold text-white">공지사항</div>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        <div className="flex cursor-pointer items-center justify-between px-4 py-5">
          <div className="font-bold text-white">로그아웃</div>
          <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
        </div>

        <div className="flex cursor-pointer items-center justify-between px-4 py-5">
          <div className="font-bold text-white">회원 탈퇴</div>
          <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
        </div>
      </div>
    </div>
  );
}
