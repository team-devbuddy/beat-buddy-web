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
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <Image src="/icons/blackLogo.svg" alt="caution image" width={120} height={120} />
        <div className="mt-[0.5rem] whitespace-pre-wrap text-center text-body2-15-medium text-gray300">
          {/* 👇 원본 text 대신 치환된 processedText를 사용 */}
          {processedText}
        </div>
      </div>
    </div>
  );
}
