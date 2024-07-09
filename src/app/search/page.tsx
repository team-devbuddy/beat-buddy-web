import React from 'react';
import MainHeader from '@/components/units/Main/MainHeader';
import Footer from '@/components/units/Main/MainFooter';
import SearchBar from '@/components/units/Main/SearchBar';
import GenreSelector from '@/components/units/Search/GenreSelector';

function SearchPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <MainHeader />
      <SearchBar isInputMode />
      <GenreSelector />
      <Footer />
    </div>
  );
}

export default SearchPage;
