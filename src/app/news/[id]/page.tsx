'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { mockNewsList } from '@/lib/dummyData';

export default function NewsDetailPage() {
  const params = useParams();
  const newsId = params.id as string;
  const [newsData, setNewsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 더미 데이터에서 해당 ID의 뉴스 찾기
    const fetchNewsDetail = () => {
      try {
        const foundNews = mockNewsList.find(item => item.id === newsId);
        if (foundNews) {
          setNewsData(foundNews);
        }
      } catch (error) {
        console.error('뉴스 상세 정보를 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewsDetail();
  }, [newsId]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-BG-black">
        <p className="text-white">로딩 중...</p>
      </div>
    );
  }

  if (!newsData) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-BG-black text-white">
        <h1 className="text-title-24-bold mb-4">뉴스를 찾을 수 없습니다</h1>
        <Link href="/news" className="text-main underline">
          뉴스 목록으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-BG-black pb-16">
      {/* 헤더 */}
      <div className="relative w-full">
        <Link href="/news" className="absolute left-4 top-4 z-10">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray700 bg-opacity-70">
            <Image src="/icons/chevron-left.svg" alt="뒤로가기" width={24} height={24} />
          </div>
        </Link>
        
        <div className="relative h-64 w-full">
          <Image
            src={newsData.imageUrl || '/images/DefaultImage.png'}
            alt={newsData.title}
            fill
            style={{ objectFit: 'cover' }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-BG-black"></div>
        </div>
      </div>

      {/* 내용 */}
      <div className="px-4">
        <h1 className="text-title-24-bold mt-4 text-white">{newsData.title}</h1>
        
        <div className="mt-2 flex items-center justify-between">
          <div className="text-body2-15-medium text-gray300">
            {newsData.dateRange}
          </div>
        </div>
        
        {newsData.location && (
          <div className="mt-4">
            <h2 className="text-body1-16-bold text-white">장소</h2>
            <p className="text-body2-15-medium mt-1 text-gray300">{newsData.location}</p>
          </div>
        )}
        
        <div className="mt-8">
          <h2 className="text-body1-16-bold text-white">상세 정보</h2>
          <div className="text-body2-15-medium mt-2 whitespace-pre-line text-gray300">
            {newsData.description}
          </div>
        </div>
        
        {/* 이미지 갤러리 */}
        {newsData.images && newsData.images.length > 0 && (
          <div className="mt-8">
            <h2 className="text-body1-16-bold text-white">이미지</h2>
            <div className="mt-2 grid grid-cols-2 gap-2">
              {newsData.images.map((img: string, index: number) => (
                <div key={index} className="relative h-40 w-full overflow-hidden rounded-xs">
                  <Image src={img} alt={`${newsData.title} 이미지 ${index + 1}`} fill style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 