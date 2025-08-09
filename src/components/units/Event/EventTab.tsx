'use client';

import { motion } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { eventTabState } from '@/context/recoil-context'; // 경로 맞게 수정

export default function EventTab() {
  const tabs: { label: string; key: 'now' | 'upcoming' | 'past' }[] = [
    { label: 'Now', key: 'now' },
    { label: 'Upcoming', key: 'upcoming' },
    { label: 'Past', key: 'past' },
  ];

  const [activeTab, setActiveTab] = useRecoilState(eventTabState); // ✅ 리코일 상태로 관리
  const activeIndex = tabs.findIndex((tab) => tab.key === activeTab);

  return (
    <div className="relative flex w-full">
      {tabs.map(({ label, key }) => (
        <button
          key={key}
          onClick={() => setActiveTab(key)}
          className={`flex-1 py-[0.66rem] text-center text-[0.875rem] ${
            activeTab === key ? 'font-bold text-main' : 'border-b border-gray400 text-gray100'
          }`}>
          {label}
        </button>
      ))}

      {/* 밑줄 애니메이션 */}
      <motion.div
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="absolute bottom-0 h-[2px] w-1/3 bg-main"
        style={{
          left: `${(100 / 3) * activeIndex}%`,
        }}
      />
    </div>
  );
}
