'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface JoinPieceBarProps {
  status: string;
  isVisible?: boolean;
}

const JoinPieceBar = ({ status, isVisible = false }: JoinPieceBarProps) => {
  const [showHint, setShowHint] = useState(true);
  const isFinished = status === '조각 마감';

  useEffect(() => {
    if (isVisible) {
      setShowHint(false);
    }
  }, [isVisible]);

  return (
    <>
      {/* 조각 참여 바 */}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 20,
              mass: 0.5,
            }}
            className="fixed bottom-0 w-full max-w-[600px] -translate-x-1/2">
            <div className="flex items-center justify-between">
              <div className="flex w-full">
                {!isFinished && (
                  <button className="flex-1 bg-main py-4 text-body2-15-medium text-black" style={{ flex: '3 1 0%' }}>
                    조각 참여하기
                  </button>
                )}
                <button
                  className={`flex-1 border border-gray300 bg-white py-4 text-body2-15-medium text-black ${
                    isFinished ? 'w-full' : ''
                  }`}
                  style={!isFinished ? { flex: '2 1 0%' } : undefined}>
                  메세지
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default JoinPieceBar;
