// lib/api/magazines.ts

import { MagazineProps } from '@/lib/types';

/**
 * 매거진 목록을 불러오는 API 함수
 * @returns Promise<Magazine[]>
 */
export async function getMagazines(): Promise<MagazineProps[]> {
  // 환경 변수에서 API 기본 URL을 가져옵니다.
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

  const response = await fetch(`${apiBaseUrl}/magazines`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    // 캐싱 전략이 필요하다면 여기에 추가 (예: next: { revalidate: 3600 } )
  });

  // 응답이 성공적이지 않을 경우 에러를 발생시킵니다.
  if (!response.ok) {
    throw new Error('Failed to fetch magazines');
  }

  const resJson = await response.json();

  // API 응답에서 data 필드를 반환합니다.
  return resJson.data;
}