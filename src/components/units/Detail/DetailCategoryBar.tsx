'use client';

import { motion } from 'framer-motion';

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
    { id: 'event', label: '이벤트' },
  ];

  const activeIndex = tabs.findIndex((tab) => tab.id === activeTab);

  return (
    <div className="w-full bg-BG-black">
      <div className="relative mx-auto grid max-w-[600px] grid-cols-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={` py-3 text-center text-sm ${
              activeTab === tab.id ? 'font-bold text-main' : 'font-medium text-gray100'
            }`}>
            {tab.label}
          </button>
        ))}

        {/* 밑줄 애니메이션 */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-0 h-[2px] w-1/3 bg-main"
          style={{
            left: `${activeIndex * 33.3333}%`,
          }}
        />
      </div>
    </div>
  );
};

export default DetailCategoryBar;
