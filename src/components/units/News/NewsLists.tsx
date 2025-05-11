'use client';
import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { heartAnimation } from '@/lib/animation';

interface News {
  id: string;
  title: string;
  thumbnail: string;
  tags: string[];
  likeCount: number;
  publishedAt: string;
}

interface NewsListsProps {
  news: News[];
  likedNews: { [key: string]: boolean };
  likeNums: { [key: string]: number };
  handleLikeClickWrapper: (e: React.MouseEvent, newsId: string) => void;
  sortBy: '최신순' | '인기순';
}

const getImageSrc = (news: News) => {
  if (news.thumbnail) {
    return news.thumbnail;
  }
  return '/images/DefaultImage.png';
};

export default function NewsLists({ news, likedNews, likeNums, handleLikeClickWrapper, sortBy }: NewsListsProps) {
  const [clickedHeart, setClickedHeart] = useState<{ [key: string]: boolean }>({});

  const memoizedValues = useMemo(() => {
    return news.map((item) => ({
      imageUrl: getImageSrc(item),
      tags: item.tags || [],
    }));
  }, [news]);

  const handleHeartClick = (e: React.MouseEvent, newsId: string) => {
    setClickedHeart((prev) => ({ ...prev, [newsId]: true }));
    handleLikeClickWrapper(e, newsId);
    setTimeout(() => setClickedHeart((prev) => ({ ...prev, [newsId]: false })), 500); // 애니메이션 후 상태 리셋
  };

  // 정렬 로직
  const sortedNews = useMemo(() => {
    if (sortBy === '인기순') {
      return [...news].sort((a, b) => 
        (likeNums[b.id] || 0) - (likeNums[a.id] || 0)
      );
    } else {
      // 최신순 - 기본 API 응답 정렬 유지 또는 날짜별 정렬
      return [...news].sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      );
    }
  }, [news, likeNums, sortBy]);

  return (
    <div className="flex w-full  flex-col bg-BG-black">
      <div className="mx-[0.5rem] my-[1.5rem] grid grid-cols-2 gap-x-[0.5rem] gap-y-[1.5rem] sm:grid-cols-2 md:grid-cols-3">
        {sortedNews.map((item, index) => {
          const { imageUrl, tags } = memoizedValues[index];

          return (
            <Link key={item.id} href={`/news/${item.id}`} passHref>
              <motion.div
                whileHover={{
                  y: -5,
                  boxShadow: '0px 5px 15px rgba(151, 154, 159, 0.05)',
                  backgroundColor: 'rgba(0, 0, 0, 0.3)',
                }}
                className="relative flex h-full flex-col rounded-md p-2">
                <div className="relative w-full pb-[100%]">
                  <Image
                    src={imageUrl}
                    alt={`${item.title} image`}
                    fill
                    objectFit="cover"
                    className="rounded-xs"
                  />
                  <div className="club-gradient absolute inset-0"></div>
                  <motion.div
                    className="absolute bottom-[0.62rem] right-[0.62rem] cursor-pointer"
                    onClick={(e) => {
                      e.preventDefault();
                      handleHeartClick(e, item.id);
                    }}
                    variants={heartAnimation}
                    initial="initial"
                    animate={clickedHeart[item.id] ? 'clicked' : 'initial'}>
                    <Image
                      src={likedNews[item.id] ? '/icons/FilledHeart.svg' : '/icons/PinkHeart.svg'}
                      alt="heart icon"
                      width={32}
                      height={32}
                    />
                  </motion.div>
                </div>
                <div className="mt-[1rem] flex flex-grow flex-col justify-between">
                  <div>
                    <h3 className="text-ellipsis text-body1-16-bold text-white">{item.title}</h3>
                    <div className="mb-[1.06rem] mt-[0.75rem] flex w-4/5 flex-wrap gap-[0.5rem]">
                      {tags.length > 0 ? (
                        tags.map((tag, index) => (
                          <span
                            key={index}
                            className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                            {tag}
                          </span>
                        ))
                      ) : (
                        <span className="rounded-xs border border-gray500 bg-gray500 px-[0.38rem] py-[0.13rem] text-body3-12-medium text-gray100">
                          NEWS
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-end justify-between">
                    <div className="flex items-center space-x-[0.25rem] text-gray300">
                      <Image src="/icons/PinkHeart.svg" alt="pink-heart icon" width={20} height={16} />
                      <span className="text-body3-12-medium">
                        {likeNums[item.id] !== undefined ? likeNums[item.id] : 0}
                      </span>
                    </div>
                    <div className="text-body3-12-medium text-gray300">
                      {new Date(item.publishedAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                </div>
              </motion.div>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 