import React from 'react';
import MainHeader from '@/components/units/Main/MainHeader';
import Footer from '@/components/units/Main/MainFooter';
import SearchBar from '@/components/units/Main/SearchBar';

function SearchPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <MainHeader />
      <SearchBar isInputMode />
      <div className="grid grid-cols-1 gap-x-[1rem] gap-y-[2.5rem] md:grid-cols-2"></div>
      <Footer />
    </div>
  );
}

export default SearchPage;
