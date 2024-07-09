import React from 'react';
import MainHeader from '@/components/units/Main/MainHeader';
import Footer from '@/components/units/Main/MainFooter';
import SearchBoth from '@/components/units/Search/SearchBoth';
import HotClubsList from '@/components/units/Search/HotClubLists';
function SearchPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <MainHeader />
      <SearchBoth />
      <HotClubsList />
      <Footer />
    </div>
  );
}

export default SearchPage;
