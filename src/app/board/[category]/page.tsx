'use client';

import BoardList from '@/components/units/Board/BoardList';

const FreeBoardPage = () => {
  return (
    <div className="min-h-screen bg-BG-black">
      <BoardList 
        boardType="free"
        venueId=""
      />
    </div>
  );
};

export default FreeBoardPage;
