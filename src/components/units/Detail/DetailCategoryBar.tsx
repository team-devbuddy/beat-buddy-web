const DetailCategoryBar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: string;
  setActiveTab: (tabId: string) => void;
}) => {
  const tabs = [
    { id: 'info', label: '정보' },
    { id: 'review', label: '리뷰' },
    { id: 'news', label: '뉴스' },
    { id: 'board', label: '게시판' },
  ];

  return (
    <div className="w-full bg-BG-black py-2">
      <div className="mx-auto grid max-w-[600px] grid-cols-4">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center py-2 transition-all duration-500 ${
              activeTab === tab.id ? 'border-b-2 border-main text-main' : 'border-b-2 border-transparent text-gray-100'
            }`}>
            <span className="text-sm font-bold">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DetailCategoryBar;
