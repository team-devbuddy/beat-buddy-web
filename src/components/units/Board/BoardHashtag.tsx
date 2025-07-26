'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const FIXED_HASHTAGS = [
  '압구정로데오',
  '홍대',
  '이태원',
  '강남.신사',
  '뮤직',
  '자유',
  '번개 모임',
  'International',
  '19+',
  'LGBTQ',
  '짤.밈',
];

interface BoardHashtagProps {
  selectedTags: string[];
  setSelectedTags: React.Dispatch<React.SetStateAction<string[]>>;
  onUpdatePosts: (tags: string[]) => void;
}

const BoardHashtag = ({ selectedTags, setSelectedTags, onUpdatePosts }: BoardHashtagProps) => {
  const [open, setOpen] = useState(false);
  const [wasOpen, setWasOpen] = useState(false); // 닫힘 감지를 위한 상태

  const toggleOpen = () => {
    setWasOpen(open); // 현재 상태 저장 (이게 닫힘 전 상태)
    setOpen((prev) => !prev); // 열고 닫기 토글
  };

  useEffect(() => {
    if (wasOpen && !open && selectedTags.length > 0) {
      onUpdatePosts([...selectedTags]);
    }
  }, [open]);

  const handleTagClick = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : prev.length < 3 ? [...prev, tag] : prev,
    );
  };

  return (
    <div className="px-[1.25rem] pb-[0.62rem]">
      <div className="flex items-start gap-[0.5rem]">
        {/* # 버튼 */}
        <button
          className={`flex h-[1.8125rem] w-[1.8125rem] items-center justify-center rounded-[0.5rem] ${
            selectedTags.length > 0 ? 'bg-sub2' : 'bg-gray700'
          }`}
          onClick={toggleOpen}>
          <p className={`text-body3-12-medium ${selectedTags.length > 0 ? 'text-main' : 'text-gray300'}`}>#</p>
        </button>

        {/* 말풍선/태그 */}
        <AnimatePresence mode="wait">
          {!open ? (
            <motion.div
              key="selected-tags"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex max-w-[80%] flex-wrap gap-[0.5rem]">
              {selectedTags.length === 0 ? (
                <div className="relative ml-[0.25rem] rounded-[0.5rem] border border-gray500 bg-gray500 px-[0.62rem] py-[0.3rem] text-[0.75rem] text-gray200">
                  <p>#를 눌러 관련 게시물만 모아보세요!</p>
                  <div className="absolute -left-[0.5rem] top-1/2 h-0 w-0 -translate-y-1/2 border-y-[4px] border-r-[8px] border-y-transparent border-r-gray500" />
                </div>
              ) : (
                selectedTags.map((tag, idx) => (
                  <div
                    key={idx}
                    className="rounded-[0.5rem] bg-sub2 px-[0.62rem] py-[0.3rem] text-body3-12-medium text-main">
                    {tag}
                  </div>
                ))
              )}
            </motion.div>
          ) : (
            <motion.div
              key="tags"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
              className="flex max-w-[80%] flex-wrap gap-[0.5rem]">
              {FIXED_HASHTAGS.map((tag, idx) => {
                const isSelected = selectedTags.includes(tag);
                return (
                  <button
                    key={idx}
                    onClick={() => handleTagClick(tag)}
                    className={`font-body2-15-medium rounded-[0.5rem] px-[0.62rem] py-[0.3rem] text-[0.75rem] ${
                      isSelected ? 'bg-sub2 text-main' : 'bg-gray700 text-gray300'
                    }`}>
                    {tag}
                  </button>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default BoardHashtag;
