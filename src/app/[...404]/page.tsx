import MainHeader from '@/components/units/Main/MainHeader';
import SearchBar from '@/components/units/Main/SearchBar';
import TrendBar from '@/components/units/Main/TrendBar';
import Image from 'next/image';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col">
      <MainHeader />
      <SearchBar />
      <TrendBar />

      <div className="flex w-full flex-col items-center justify-center">
        <Image src="/icons/blackLogo.svg" width={120} height={120} alt="logo" />
        <p className="mt-4 text-[0.93rem] text-gray300">해당 페이지를 찾을 수 없습니다.</p>
      </div>
    </div>
  );
}
