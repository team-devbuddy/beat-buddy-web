import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface InfoModalProps {
  onClose: () => void;
}

const moodDescriptions = [
  { title: '클럽 (Club)', description: '클럽 분위기, 주로 지하에 위치함, 큰 음악 볼륨' },
  { title: '펍 (Pub)', description: '펍 분위기, 주로 1층에 위치함, 적당한 음악 볼륨' },
  { title: '루프탑 (Rooftop)', description: '루프탑, 대화가 자유로운 정도의 음악 볼륨' },
  { title: '바 & 카페 (Bar & Cafe)', description: '음악과 대화에 집중하기 좋은, 커피도 술도 어울리는 곳' },
  { title: '딥한 (Deep)', description: '특정 장르 음악을 딥하게 즐길 수 있는 곳' },
  { title: '커머셜한 (Commercial)', description: '대중적인 음악을 들며 흥에 초점을 맞춘 곳' },
  { title: '칠한 (Chill)', description: '여유로운 분위기, 살랑살랑 바이브' },
  { title: '이국적인 (Exotic)', description: '외국인이 많거나 공간적 특성이 특별한 곳' },
  { title: '헌팅 (Hunting)', description: '대화 친화적인 분위기, 헌팅이 보다 활발히 이루어지는 곳' },
];

const InfoModal: React.FC<InfoModalProps> = ({ onClose }) => {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const handleBackgroundClick = (event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="relative z-50">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={handleBackgroundClick}></div>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-1 top-3 z-50 w-[19rem] rounded-lg bg-gray700 px-4 py-2">
        {moodDescriptions.map((mood, index) => (
          <div key={index} className="flex flex-col gap-1 py-2">
            <p className="text-[0.875rem] font-bold text-main2">{mood.title}</p>
            <p className="text-[0.75rem] text-white">{mood.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfoModal;
