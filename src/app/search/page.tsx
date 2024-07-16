import dynamic from 'next/dynamic';
import MainHeader from '@/components/units/Main/MainHeader';
import Footer from '@/components/units/Main/MainFooter';
import SearchGenre from '@/components/units/Search/SearchGenre';
import HotClubsList from '@/components/units/Search/HotClubLists';
import SearchBar from '@/components/units/Main/SearchBar';

const RecentTerm = dynamic(() => import('@/components/units/Search/RecentTerm'), { ssr: false });

function SearchPage() {
  return (
    <div className="flex min-h-screen w-full flex-col bg-BG-black text-white">
      <MainHeader />
      <SearchBar />
      <RecentTerm />
      <SearchGenre />
      <HotClubsList />
      <Footer />
    </div>
  );
}

export default SearchPage;
