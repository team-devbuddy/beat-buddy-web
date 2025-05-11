'use client';
import React, { useState, useEffect } from 'react';
import NewsHeader from './NewsHeader';
import NewsLists from './NewsLists';
import { mockNewsList } from '@/lib/dummyData';

interface News {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  likeCount: number;
  publishedAt: string;
}

export default function NewsContainer() {
  const [sortOption, setSortOption] = useState<'최신순' | '인기순'>('최신순');
  const [news, setNews] = useState<News[]>([]);
  const [likedNews, setLikedNews] = useState<{ [key: string]: boolean }>({});
  const [likeNums, setLikeNums] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // mockNewsList에서 데이터 가져오기
    const fetchNews = () => {
      try {
        // 날짜 정보 추출과 필요한 필드만 매핑
        const formattedNews: News[] = mockNewsList.map(item => ({
          id: item.id,
          title: item.title,
          thumbnail: item.imageUrl || '/images/DefaultImage.png',
          tags: ['NEWS', item.dateRange.split('-')[0].trim()], // 연도를 태그로 추가
          likeCount: Math.floor(Math.random() * 100) + 10, // 임의의 좋아요 수
          publishedAt: item.dateRange.split(' ~ ')[0]
        }));
        
        setNews(formattedNews);
        
        // 좋아요 수 초기화
        const initialLikeNums: { [key: string]: number } = {};
        formattedNews.forEach(item => {
          initialLikeNums[item.id] = item.likeCount;
        });
        setLikeNums(initialLikeNums);
        
        // 좋아요 상태 초기화 (로컬스토리지에서 가져오거나 새로 초기화)
        const savedLikes = localStorage.getItem('likedNews');
        const userLikedNews = savedLikes ? JSON.parse(savedLikes) : {};
        setLikedNews(userLikedNews);
      } catch (error) {
        console.error('뉴스를 불러오는 중 오류 발생:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleSortChange = (option: '최신순' | '인기순') => {
    setSortOption(option);
  };

  const handleLikeClick = (e: React.MouseEvent, newsId: string) => {
    e.preventDefault();
    
    // 좋아요 상태 토글
    setLikedNews(prev => {
      const newState = { ...prev };
      newState[newsId] = !prev[newsId];
      
      // 로컬 스토리지에 상태 저장
      localStorage.setItem('likedNews', JSON.stringify(newState));
      
      return newState;
    });
    
    // 좋아요 수 업데이트
    setLikeNums(prev => {
      const newCount = { ...prev };
      newCount[newsId] = prev[newsId] + (likedNews[newsId] ? -1 : 1);
      return newCount;
    });
  };

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-BG-black">
      <p className="text-white">로딩 중...</p>
    </div>;
  }

  return (
    <div className="min-h-screen bg-BG-black">
      <NewsHeader onSortChange={handleSortChange} />
      <NewsLists 
        news={news} 
        likedNews={likedNews} 
        likeNums={likeNums} 
        handleLikeClickWrapper={handleLikeClick} 
        sortBy={sortOption}
      />
    </div>
  );
} 