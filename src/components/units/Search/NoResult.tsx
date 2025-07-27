'use client';
import Image from 'next/image';

export default function NoResults({ text }: { text: string }) {
  // 👇 [수정됨] '\\n' 문자열을 실제 줄바꿈 문자로 교체하는 로직 추가
  const processedText = text.replace(/\\n/g, '\n');

  return (
    <div className="relative flex w-full flex-col bg-BG-black">
      <div className="flex h-full flex-col items-center justify-center py-[8.75rem]">
        <Image src="/icons/blackLogo.svg" alt="caution image" width={120} height={120} />
        <div className="mt-[0.5rem] whitespace-pre-wrap text-center text-body2-15-medium text-gray300">
          {/* 👇 원본 text 대신 치환된 processedText를 사용 */}
          {processedText}
        </div>
      </div>
    </div>
  );
}
