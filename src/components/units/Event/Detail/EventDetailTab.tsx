'use client';

import EventInfo from './EventDetailInfo';
import EventQnA from './EventDetailQnA';
import { EventDetail } from '@/lib/types';
import { motion, AnimatePresence } from 'framer-motion';
import { useRecoilState } from 'recoil';
import { eventDetailTabState } from '@/context/recoil-context';
export default function EventDetailTab({ eventDetail }: { eventDetail: EventDetail }) {
  const [tab, setTab] = useRecoilState(eventDetailTabState);

  const tabs = [
    { key: 'info', label: '행사 소개' },
    { key: 'qna', label: '행사 문의' },
  ] as const;

  const activeIndex = tab === 'info' ? 0 : 1;

  return (
    <div>
      {/* 탭 버튼 + 밑줄 */}
      <div className="relative flex border-b border-gray700">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex-1 py-3 text-center text-[0.875rem] ${
              tab === key ? 'font-bold text-main' : 'text-gray100'
            }`}>
            {label}
          </button>
        ))}

        {/* 밑줄 애니메이션 */}
        <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute bottom-0 h-[1.5px] w-1/2 bg-main"
          style={{
            left: `${activeIndex * 50}%`, // 2개 탭 → 50%
          }}
        />
      </div>

      {/* 탭 콘텐츠 영역 애니메이션 */}
      <div className="relative  min-h-[150px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full">
            {tab === 'info' ? <EventInfo eventDetail={eventDetail} /> : <EventQnA eventDetail={eventDetail} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
