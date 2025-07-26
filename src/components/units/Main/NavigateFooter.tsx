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
      case '/event':
        setActivePage('event');
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
    <footer
      className="safari-icon-fix safari-padding-fix fixed bottom-0 left-0 right-0 z-50 mx-auto w-full max-w-[600px] rounded-t-[1.25rem] border-t border-gray500 bg-BG-black font-queensides text-navigate-queen"
      style={{
        minHeight: '2rem',
        paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))',
        paddingTop: '0.25rem',
      }}>
      <div className="flex h-full items-center justify-around">
        <Link href="/">
          <div
            onClick={() => setActivePage('home')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'home' ? 'text-main' : 'text-gray-500'}`}
            style={{ minHeight: '2rem' }}>
            <Image
              src={getIconSrc('home', '/icons/footerHome.svg', '/icons/footerHome-clicked.svg')}
              alt="Home icon"
              width={32}
              height={32}
              className="safari-icon-fix"
            />
          </div>
        </Link>

        <Link href="/board">
          <div
            onClick={() => setActivePage('board')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'board' ? 'text-main' : 'text-gray-500'}`}
            style={{ minHeight: '2rem' }}>
            <Image
              src={getIconSrc('board', '/icons/footerBoard.svg', '/icons/footerBoard-clicked.svg')}
              alt="Board icon"
              width={32}
              height={32}
              className="safari-icon-fix"
            />
          </div>
        </Link>

        <Link href="/venue">
          <div
            onClick={() => setActivePage('venue')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'venue' ? 'text-main' : 'text-gray-500'}`}
            style={{ minHeight: '2rem' }}>
            <Image
              src={getIconSrc('venue', '/icons/footerMap.svg', '/icons/footerMap-clicked.svg')}
              alt="Venue icon"
              width={32}
              height={32}
              className="safari-icon-fix"
            />
          </div>
        </Link>

        <Link href="/event">
          <div
            onClick={() => setActivePage('event')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'event' ? 'text-main' : 'text-gray-500'}`}
            style={{ minHeight: '2rem' }}>
            <Image
              src={getIconSrc('event', '/icons/footerEvent.svg', '/icons/footerEvent-clicked.svg')}
              alt="Event icon"
              width={32}
              height={32}
              className="safari-icon-fix"
            />
          </div>
        </Link>

        <Link href="/mypage">
          <div
            onClick={() => setActivePage('profile')}
            className={`flex transform flex-col items-center px-2 py-1 transition-transform active:scale-95 ${activePage === 'profile' ? 'text-main' : 'text-gray-500'}`}
            style={{ minHeight: '2rem' }}>
            <Image
              src={getIconSrc('profile', '/icons/footerProfile.svg', '/icons/footerProfileClicked.svg')}
              alt="Profile icon"
              width={32}
              height={32}
              className="safari-icon-fix"
            />
          </div>
        </Link>
      </div>
    </footer>
  );
};

export default NavigateFooter;
