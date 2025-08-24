'use client';

import { useEffect, useState } from 'react';

interface User {
  id: string;
  name: string;
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // 임시로 하드코딩된 사용자 정보 사용
    // TODO: 실제 토큰 기반 인증 구현 시 수정 필요
    const mockUser = {
      id: 'user1',
      name: '노태리'
    };
    setUser(mockUser);
  }, []);

  return { user };
}; 