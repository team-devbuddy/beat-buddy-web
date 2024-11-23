const DetailFooter = ({ activeTab, venueName }: { activeTab: string; venueName: string }) => {
  const renderFooterContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <>
            <button className="flex-[4] bg-gray-100 text-center text-body1-16-bold text-black">조각모집</button>
            <button className="flex-[6] bg-main text-center text-body1-16-bold text-white">예약하기</button>
          </>
        );
      case 'review':
        return (
          <button className="w-full bg-main text-center text-body1-16-bold text-white">
            {venueName} 리뷰 작성하기
          </button>
        );
      case 'news':
        return <button className="w-full bg-main text-center text-body1-16-bold text-white">글 작성하기</button>;
      case 'board':
        return (
          <button className="w-full bg-main text-center text-body1-16-bold text-white">
            {venueName} 게시판에 글쓰기
          </button>
        );
      default:
        return null;
    }
  };

  return <div className="fixed bottom-0 left-0 right-0 flex h-14 bg-white shadow-lg">{renderFooterContent()}</div>;
};

export default DetailFooter;
