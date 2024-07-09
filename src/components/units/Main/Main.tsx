import React from 'react';
import MainHeader from './MainHeader';
import SearchBar from './SearchBar';
import TrendBar from './TrendBar';
import BeatBuddyPick from './BeatBuddyPick';
import LoggedOutBanner from './LoggedOutBanner';
import HotVenues from './HotVenues';
import Footer from './MainFooter';
import { clubs } from '@/lib/data';
export default function Main() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col bg-BG-black">
        <MainHeader />
        <SearchBar />
        <TrendBar />
        <BeatBuddyPick />
        <LoggedOutBanner />
        <HotVenues clubs={clubs} />
        <Footer />
      </div>
    </div>
  );
}
