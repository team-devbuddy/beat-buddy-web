import Image from 'next/image';
import Link from 'next/link';
import History from './History/History';

export default function MyPageComponent() {
  return (
    <>
      <div className="flex flex-col">
        <Link href="/mypage/option">
          <div className="flex gap-1 px-4 py-5">
            <p className="text-xl font-bold text-white">동혁</p>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        {/* 구분선 */}
        <div className="flex justify-center py-2">
          <div className="w-[90%] border-b border-gray500"></div>
        </div>

        {/* My Heart Beat */}
        <Link href="/my-heart-beat">
          <div className="flex justify-between px-4 py-2 font-queensides text-xl text-main2">
            <p>My Heart Beat</p>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>

        {/* My Heart Beat Icon*/}
        <div className="my-6 flex gap-3 overflow-x-auto px-4 hide-scrollbar">
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
          <div className="h-14 w-14 flex-shrink-0 rounded-full border border-white bg-black"></div>
        </div>

        {/* History */}
        <Link href="/my-heart-beat" className="mb-6">
          <div className="flex justify-between px-4 py-2">
            <p className="font-queensides text-xl text-main2">History</p>
            <button className="rounded-[0.13rem] bg-gray500 px-3 py-[0.38rem] text-gray200">취향 수정하기</button>
          </div>
        </Link>

        {/* MyHistoy Card */}
        <History />

        {/* 구분선 */}
        <div className="flex justify-center pt-[2.5rem]">
          <div className="w-full border-b border-gray500"></div>
        </div>

        {/* 정보 수정 */}
        <Link href="/" className="mt-6">
          <div className="flex justify-between px-4 py-5">
            <div className="flex flex-col gap-1">
              <div className="text-[0.93rem] font-bold text-white">잘못된 정보가 있나요?</div>
              <div className="text-xs text-gray300">수정이 필요하거나 폐점한 매장이라면 알려주세요!</div>
            </div>
            <Image src="/icons/gray-right-arrow.svg" alt="edit" width={24} height={24} />
          </div>
        </Link>
      </div>
    </>
  );
}
