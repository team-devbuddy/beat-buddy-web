import React from 'react';
import MainHeader from './MainHeader';
import SearchBar from './SearchBar';
import TrendBar from './TrendBar';
import BeatBuddyPick from './BeatBuddyPick';
import LoggedOutBanner from './LoggedOutBanner';
import HotVenues from './HotVenues';

export default function Main() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col bg-BG-black">
        {/* Header */}
        <MainHeader />

        {/* SearchBar */}
        <SearchBar />
        <TrendBar />
        <BeatBuddyPick />
        <LoggedOutBanner />
        <HotVenues/>
      </div>
    </div>
  );
}
