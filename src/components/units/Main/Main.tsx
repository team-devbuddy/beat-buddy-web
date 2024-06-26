import React from 'react';
import MainHeader from './MainHeader';
import SearchBar from './SearchBar';
import TrendBar from './TrendBar';
import BeatBuddyPick from './BeatBuddyPick';

export default function Main() {
  return (
    <div className="flex w-full flex-col">
      <div className="flex flex-col bg-main">
        {/* Header */}
        <MainHeader />

        {/* SearchBar */}
        <SearchBar />
        <TrendBar />
        <BeatBuddyPick />
      </div>
    </div>
  );
}
