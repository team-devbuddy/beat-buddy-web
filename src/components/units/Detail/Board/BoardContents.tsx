'use client';

import { useState } from 'react';
import PieChart from './PieChart';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

interface BoardItem {
  id: string;
  author: string;
  timestamp: string;
  venue?: string;
  status?: string;
  meetingDate?: string;
  participants?: string;
  cost?: string;
  likes: number;
  comments: number;
  boardType: string;
  title?: string;
  description?: string;
  currentParticipants?: number; // 현재 모집된 인원
  totalParticipants?: number;
  englishName?: string; // 영어 이름
  koreanName?: string; // 한글 이름
  isAuthor: boolean; // 작성자 본인 여부
  venueId?: number;  // 선택적 필드로 변경
}

interface BoardContentsProps {
  boardData: BoardItem[];
  filterKorName: string; // 필터 조건 (검색 키워드)
  filterEngName: string; // 필터 조건 (검색 키워드)
}

const EmptyBoard = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <img src="/icons/grayLogo.svg" alt="BeatBuddy Logo" className="mb-6 h-16 w-16" />
      <p className="text-body2-15-medium text-gray300">아직 등록된 게시글이 없습니다.</p>
    </div>
  );
};

const BoardContents = ({ boardData, filterKorName, filterEngName }: BoardContentsProps) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // 필터링된 데이터
  const filteredData = boardData.filter((item) => {
    if (!filterKorName && !filterEngName) return true; // 필터 조건이 없으면 모든 데이터를 보여줌
    const lowerFilterName = filterEngName.toLowerCase();

    return (
      item.englishName?.toLowerCase().includes(filterEngName) || // 영어 이름 필터
      item.koreanName?.includes(filterKorName) || // 한글 이름 필터
      item.title?.toLowerCase().includes(lowerFilterName) || // 제목 필터
      item.title?.toLowerCase().includes(filterKorName) || // 제목 필터
      item.description?.toLowerCase().includes(lowerFilterName) ||
      item.description?.toLowerCase().includes(filterKorName) // 글 내용 필터
      // 글 내용 필터
    );
  });

  if (filteredData.length === 0) {
    return <EmptyBoard />;
  }

  return (
    <div className="bg-BG-black text-white">
      {filteredData.map((item) => (
        <Link 
          key={item.id} 
          href={`/board/${item.boardType === '자유 게시판' ? '0' : item.venueId}/${item.id}`}
        >
          <div
            className={`flex flex-col space-y-1 px-4 py-4 ${
              item.boardType === '조각 게시판' ? 'bg-gray500' : ''
            } cursor-pointer hover:bg-gray600`}
          >
            {/* 작성자 프로필, 닉네임, 작성시간 */}
            <div className="mb-2 flex flex-row justify-between" onClick={(e) => e.preventDefault()}>
              <div className="align-center flex flex-row">
                <img src="/icons/profile.svg" alt="Author Avatar" className="mr-3 h-10 w-10 rounded-full bg-gray500" />

                <div className="flex flex-col justify-start text-body2-15-medium">
                  <span className={`flex items-center ${item.status !== '조각 마감' ? 'text-white' : 'text-gray300'}`}>
                    {item.author}
                  </span>
                  <div className="text-body3-12-medium text-gray200">
                    <span className={`flex items-center ${item.status !== '조각 마감' ? 'text-white' : 'text-gray300'}`}>
                      {item.timestamp}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center space-x-2">
                {item.status && (
                  <>
                    <div
                      className={`flex items-center justify-center rounded-xs px-2 text-body3-12-bold ${
                        item.status === '조각 모집 중'
                          ? 'bg-gray700 py-[0.11rem] text-white'
                          : 'border border-gray300 py-[0.38rem] text-gray300'
                      }`}>
                      {item.status === '조각 모집 중' && (
                        <div className="relative mr-2 flex items-center justify-center">
                          <PieChart total={item.totalParticipants || 1} filled={item.currentParticipants || 0} />
                        </div>
                      )}
                      {item.status}
                    </div>
                  </>
                )}
                <div className="relative">
                  <img
                    src="/icons/dot-vertical.svg"
                    alt="More options"
                    className="h-5 w-5 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(item.id);
                    }}
                  />
                  <AnimatePresence>
                    {activeDropdown === item.id && (
                      <>
                        {/* 배경 어둡게 처리 */}
                        <motion.div
                          className="z-10 fixed inset-0 bg-black bg-opacity-50"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveDropdown(null);
                          }}></motion.div>

                        {/* 드롭다운 메뉴 */}
                        <motion.div
                          initial={{ opacity: 0, translateY: -10 }}
                          animate={{ opacity: 1, translateY: 0 }}
                          exit={{ opacity: 0, translateY: -10 }}
                          transition={{ duration: 0.2 }}
                          className="absolute right-0 top-6 mt-4 w-[5.5rem] rounded-xs bg-gray700 shadow-lg">
                          {item.isAuthor ? (
                            <>
                              <button className="w-full px-5 py-2 text-center text-body3-12-medium text-gray200 hover:text-main focus:text-main">
                                수정하기
                              </button>
                              <button className="text-red500 hover:bg-red700 w-full px-5 py-2 text-center text-body3-12-medium text-gray200 hover:text-main focus:text-main">
                                삭제하기
                              </button>
                            </>
                          ) : (
                            <button className="w-full px-5 py-2 text-center text-body3-12-medium text-gray200 hover:text-main focus:text-main">
                              신고하기
                            </button>
                          )}
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* 모집 게시판 Content */}
            {item.boardType === '조각 게시판' && (
              <>
                <div className={`text-body3-12-medium ${item.status === '조각 마감' ? 'text-gray300' : 'text-gray100'}`}>
                  <span className="mr-3">모집 일자 </span>
                  {item.meetingDate}
                </div>

                <div className={`text-body3-12-medium ${item.status === '조각 마감' ? 'text-gray300' : 'text-gray100'}`}>
                  <span className="mr-3">모집 인원 </span>
                  {item.participants}
                </div>

                <div className={`text-body3-12-medium ${item.status === '조각 마감' ? 'text-gray300' : 'text-gray100'}`}>
                  <span className="mr-3">1/N 비용 </span>
                  {item.cost}
                </div>
              </>
            )}

            {/* 자유게시판 Content */}
            {item.boardType === '자유 게시판' && (
              <>
                <h3 className="text-body2-15-bold text-white">{item.title}</h3>
                <p className="line-clamp-2 text-body3-12-medium text-gray300">{item.description}</p>
              </>
            )}

            {/* 게시판 유형 표시 */}
            <div className="flex flex-row justify-between">
              {item.boardType !== '조각 게시판' && (
                <div className="text-[0.6875rem] text-[#7C7F83]">{item.boardType}</div>
              )}

              {/* Footer (Likes and Comments) */}
              {item.boardType === '자유 게시판' && (
                <div className="flex justify-end">
                  <div className="flex space-x-4 text-body3-12-medium text-gray300">
                    <div className="flex items-center space-x-1">
                      <img src="/icons/thumb-up.svg" alt="Likes" className="h-4 w-4" />
                      <span className="text-[0.6875rem] text-main">{item.likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <img src="/icons/message-square.svg" alt="Comments" className="h-4 w-4" />
                      <span className="text-[0.6875rem] text-[#BFBFBF]">{item.comments}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default BoardContents;
