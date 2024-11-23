import Link from 'next/link';

const DetailFooter = ({ activeTab, venueName }: { activeTab: string; venueName: string }) => {
  const renderFooterContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <>
            <Link
              href="/recruit"
              className="flex flex-[4] items-center justify-center bg-gray-100 text-center text-body1-16-bold text-black">
              조각모집
            </Link>
            <Link
              href="/reservate"
              className="flex flex-[6] items-center justify-center bg-main text-center text-body1-16-bold text-white">
              예약하기
            </Link>
          </>
        );
      case 'review':
        return (
          <Link
            href={{
              pathname: '/review/write',
              query: { venueName }, // 클럽 이름을 쿼리로 전달
            }}
            className="flex w-full items-center justify-center bg-main text-center text-body1-16-bold text-white">
            {venueName} 리뷰 작성하기
          </Link>
        );
      case 'news':
        return (
          <Link
            href="/news/write"
            className="flex w-full items-center justify-center bg-main text-center text-body1-16-bold text-white">
            글 작성하기
          </Link>
        );
      case 'board':
        return (
          <Link
            href="/board/write"
            className="flex w-full items-center justify-center bg-main text-center text-body1-16-bold text-white">
            {venueName} 게시판에 글쓰기
          </Link>
        );
      default:
        return null;
    }
  };

  return <div className="fixed bottom-0 left-0 right-0 flex h-14 bg-white shadow-lg">{renderFooterContent()}</div>;
};

export default DetailFooter;
