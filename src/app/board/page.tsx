'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import BoardHome from '@/components/units/Board/BoardHome';

const BoardPage = () => {
  const router = useRouter();
  
  // venueId가 없을 때는 전체 게시글을 보여주는 페이지
  return (
    <div className="min-h-screen bg-BG-black text-white">
      <BoardHome venueId="" />
    </div>
  );
};

export default BoardPage;
