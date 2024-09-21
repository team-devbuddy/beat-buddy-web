import { useRecoilState } from 'recoil';
import { activePageState } from '@/context/recoil-context';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

const NavigateFooter = () => {
  const [activePage, setActivePage] = useRecoilState(activePageState);
  const pathname = usePathname();

  const getIconSrc = (page: string, defaultIcon: string, clickedIcon: string) => {
    return activePage === page ? clickedIcon : defaultIcon;
  };

  useEffect(() => {
    switch (pathname) {
      case '/':
        setActivePage('home');
        break;
      case '/board':
        setActivePage('board');
        break;
      case '/venue':
        setActivePage('venue');
        break;
      case '/news':
        setActivePage('news');
        break;
      case '/mypage':
        setActivePage('mypage');
        break;
      default:
        setActivePage('home');
        break;
    }
  }, [pathname, setActivePage]);

  return (
    <footer className="fixed bottom-0 left-0 right-0 mx-auto max-w-[600px] bg-BG-black py-[1rem]">
      <div className="flex items-center justify-around">
        <Link href="/">
          <div
            onClick={() => setActivePage('home')}
            className={`flex flex-col items-center transition-transform transform active:scale-95 ${activePage === 'home' ? 'text-main' : 'text-[#7C7F83]'}`}>
            <div className={`rounded-full p-2 transition-transform transform active:scale-95 ${activePage === 'home' ? 'bg-main' : 'bg-[#7C7F83]'}`}>
              <Image
                src={getIconSrc('home', '/icons/home.svg', '/icons/home-clicked.svg')}
                alt="Home icon"
                width={24}
                height={24}
              />
            </div>
            <span className="mt-1 text-xs">Home</span>
          </div>
        </Link>

        <Link href="/board">
          <div
            onClick={() => setActivePage('board')}
            className={`flex flex-col items-center transition-transform transform active:scale-95 ${activePage === 'board' ? 'text-main' : 'text-[#7C7F83]'}`}>
            <div className={`rounded-full p-2 transition-transform transform active:scale-95 ${activePage === 'board' ? 'bg-main' : 'bg-[#7C7F83]'}`}>
              <Image
                src={getIconSrc('board', '/icons/file-05.svg', '/icons/board-clicked.svg')}
                alt="Board icon"
                width={24}
                height={24}
              />
            </div>
            <span className="mt-1 text-xs">Board</span>
          </div>
        </Link>

        <Link href="/venue">
          <div
            onClick={() => setActivePage('venue')}
            className={`flex flex-col items-center transition-transform transform active:scale-95 ${activePage === 'venue' ? 'text-main' : 'text-[#7C7F83]'}`}>
            <div className={`rounded-full p-2 transition-transform transform active:scale-95 ${activePage === 'venue' ? 'bg-main' : 'bg-[#7C7F83]'}`}>
              <Image
                src={getIconSrc('venue', '/icons/map-03.svg', '/icons/venue-clicked.svg')}
                alt="Venue icon"
                width={24}
                height={24}
              />
            </div>
            <span className="mt-1 text-xs">Venue</span>
          </div>
        </Link>

        <Link href="/news">
          <div
            onClick={() => setActivePage('news')}
            className={`flex flex-col items-center transition-transform transform active:scale-95 ${activePage === 'news' ? 'text-main' : 'text-[#7C7F83]'}`}>
            <div className={`rounded-full p-2 transition-transform transform active:scale-95 ${activePage === 'news' ? 'bg-main' : 'bg-[#7C7F83]'}`}>
              <Image
                src={getIconSrc('news', '/icons/news.svg', '/icons/news-clicked.svg')}
                alt="News icon"
                width={24}
                height={24}
              />
            </div>
            <span className="mt-1 text-xs">News</span>
          </div>
        </Link>

        <Link href="/mypage">
          <div
            onClick={() => setActivePage('mypage')}
            className={`flex flex-col items-center transition-transform transform active:scale-95 ${activePage === 'mypage' ? 'text-main' : 'text-[#7C7F83]'}`}>
            <div className={`rounded-full p-2 transition-transform transform active:scale-95 ${activePage === 'mypage' ? 'bg-main' : 'bg-[#7C7F83]'}`}>
              <Image
                src={getIconSrc('mypage', '/icons/mypage.svg', '/icons/mypage-clicked.svg')}
                alt="My Page icon"
                width={24}
                height={24}
              />
            </div>
            <span className="mt-1 text-xs">My Page</span>
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default NavigateFooter;
