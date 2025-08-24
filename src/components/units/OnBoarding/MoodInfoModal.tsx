import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

interface InfoModalProps {
  onClose: () => void;
}

const moodDescriptions = [
  { title: '클럽', subtitle: '(Club)', description: '클럽 분위기, 주로 지하에 위치함, 큰 음악 볼륨' },
  { title: '펍', subtitle: '(Pub)', description: '펍 분위기, 주로 1층에 위치함, 적당한 음악 볼륨' },
  { title: '루프탑', subtitle: '(Rooftop)', description: '루프탑, 대화가 자유로운 정도의 음악 볼륨' },
  { title: '바 & 카페', subtitle: '(Bar & Cafe)', description: '음악과 대화에 집중하기 좋은, 커피도 술도 어울리는 곳' },
  { title: '딥한', subtitle: '(Deep)', description: '특정 장르 음악을 딥하게 즐길 수 있는 곳' },
  { title: '커머셜한', subtitle: '(Commercial)', description: '대중적인 음악을 들며 흥에 초점을 맞춘 곳' },
  { title: '칠한', subtitle: '(Chill)', description: '여유로운 분위기, 살랑살랑 바이브' },
  { title: '이국적인', subtitle: '(Exotic)', description: '외국인이 많거나 공간적 특성이 특별한 곳' },
  { title: '헌팅', subtitle: '(Hunting)', description: '대화 친화적인 분위기, 헌팅이 보다 활발히 이루어지는 곳' },
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

  return (
    <div className="z-100 relative">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute right-1 top-3 z-50 w-[19rem] space-y-3 rounded-lg bg-gray700 px-4 py-3">
        {moodDescriptions.map((mood, index) => (
          <div key={index} className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-body-14-bold text-main2">{mood.title}</span>
              <span className="text-body3-12-bold text-main2">{mood.subtitle}</span>
            </div>
            <p className="text-body3-12-medium text-gray100">{mood.description}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default InfoModal;
