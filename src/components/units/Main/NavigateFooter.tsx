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
    <footer className="text-navigate-queen fixed bottom-0 left-0 right-0 mx-auto max-w-[600px] bg-black py-[1rem] font-queensides">
      <div className="flex items-center justify-around">
        <Link href="/">
          <div
            onClick={() => setActivePage('home')}
            className={`flex transform flex-col items-center transition-transform active:scale-95 ${activePage === 'home' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('home', '/icons/footerHome.svg', '/icons/home-clicked.svg')}
              alt="Home icon"
              width={32}
              height={32}
            />
            <span className="mt-[0.12rem] text-sm font-bold">Home</span>
          </div>
        </Link>

        <Link href="/board">
          <div
            onClick={() => setActivePage('board')}
            className={`flex transform flex-col items-center transition-transform active:scale-95 ${activePage === 'board' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('board', '/icons/board.svg', '/icons/board-clicked.svg')}
              alt="Board icon"
              width={32}
              height={32}
            />
            <span className="mt-[0.12rem] text-sm font-medium">Board</span>
          </div>
        </Link>

        <Link href="/venue">
          <div
            onClick={() => setActivePage('venue')}
            className={`flex transform flex-col items-center transition-transform active:scale-95 ${activePage === 'venue' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('venue', '/icons/map.svg', '/icons/map-clicked.svg')}
              alt="Venue icon"
              width={32}
              height={32}
            />
            <span className="mt-[0.12rem] text-sm font-medium">Venue</span>
          </div>
        </Link>

        <Link href="/news">
          <div
            onClick={() => setActivePage('news')}
            className={`flex transform flex-col items-center transition-transform active:scale-95 ${activePage === 'news' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('news', '/icons/news.svg', '/icons/news-clicked.svg')}
              alt="News icon"
              width={32}
              height={32}
            />
            <span className="mt-[0.12rem] text-sm font-medium">News</span>
          </div>
        </Link>

        <Link href="/mypage">
          <div
            onClick={() => setActivePage('mypage')}
            className={`flex transform flex-col items-center transition-transform active:scale-95 ${activePage === 'mypage' ? 'text-main' : 'text-gray-500'}`}>
            <Image
              src={getIconSrc('mypage', '/icons/mypage.svg', '/icons/mypage-clicked.svg')}
              alt="My Page icon"
              width={32}
              height={32}
            />
            <span className="mt-[0.12rem] text-sm font-medium">My Page</span>
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default NavigateFooter;
