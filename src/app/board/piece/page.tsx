'use client';

import BoardList from '@/components/units/Board/BoardList';

const PieceBoardPage = () => {
  return (
    <div className="min-h-screen bg-BG-black">
      <BoardList 
        boardType="piece"
        venueId="" // 전체 베뉴의 게시글을 보여줄 때는 빈 문자열
      />
    </div>
  );
};

export default PieceBoardPage;
