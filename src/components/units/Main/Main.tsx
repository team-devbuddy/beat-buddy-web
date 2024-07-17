'use client';
import SearchBar from './SearchBar';
import TrendBar from './TrendBar';
import BeatBuddyPick from './BeatBuddyPick';
import LoggedOutBanner from './LoggedOutBanner';
import HotVenues from './HotVenues';
import Footer from './MainFooter';
import { clubs } from '@/lib/data';
import dynamic from 'next/dynamic';
import { useRecoilValue } from 'recoil';
import { authState } from '@/context/recoil-context';

const MainHeader = dynamic(() => import('./MainHeader'), { ssr: false });
export default function Main() {
  const isAuth = useRecoilValue(authState);

  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col bg-BG-black">
        <MainHeader />
        <SearchBar />
        <TrendBar />
        <BeatBuddyPick />
        {!isAuth && <LoggedOutBanner />}
        <HotVenues clubs={clubs} />
        <Footer />
      </div>
    </div>
  );
}
