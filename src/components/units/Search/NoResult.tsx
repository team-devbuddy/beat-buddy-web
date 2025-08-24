'use client';
import Image from 'next/image';

interface NoResultsProps {
  text: string;
  minHeight?: string;
  fullHeight?: boolean;
}

export default function NoResults({ text, minHeight = 'min-h-[50vh]', fullHeight = false }: NoResultsProps) {
  // 👇 [수정됨] '\\n' 문자열을 실제 줄바꿈 문자로 교체하는 로직 추가
  const processedText = text.replace(/\\n/g, '\n');

  const heightClass = fullHeight
    ? 'min-h-[calc(100vh-200px)]' // 헤더/네비게이션 공간 제외
    : minHeight;

  return (
    <div className={`relative flex w-full flex-col bg-BG-black ${heightClass}`}>
      <div className="flex flex-1 flex-col items-center justify-center px-5">
        <Image src="/icons/blackLogo.svg" alt="caution image" width={69} height={64} />
        <div className="mt-[0.5rem] text-center text-gray300">
          {/* 👇 줄바꿈된 텍스트를 각 줄별로 다른 폰트 크기 적용 */}
          {processedText.split('\n').map((line, index) => (
            <div
              key={index}
              className={`whitespace-pre-wrap ${index === 0 ? 'text-body-14-bold' : 'text-gray400 text-body-11-medium'}`}>
              {line}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
