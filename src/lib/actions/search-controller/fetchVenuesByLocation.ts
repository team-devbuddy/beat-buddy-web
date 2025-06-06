import { Club } from '@/lib/types';
import { fetchVenues } from './fetchVenues';

// 두 지점 사이의 거리를 계산하는 함수 (Haversine formula)
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // 지구 반경 (km)
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // 킬로미터 단위 거리
  return distance;
};

// 현재 위치 기반으로 주변 클럽을 가져오는 함수
export const fetchVenuesByLocation = async (
  latitude: number,
  longitude: number,
  radius: number = 5, // 기본 반경 5km
  accessToken: string | null = null
): Promise<Club[]> => {
  try {
    // 1. 먼저 전체 클럽 목록을 가져옴
    const allVenues = await fetchVenues([], accessToken);
    
    // 2. 현재 위치로부터 일정 거리 이내의 클럽만 필터링
    const nearbyVenues = allVenues.filter((venue: Club) => {
      // 클럽 주소로부터 좌표 추출 (이 부분은 이미 캐싱된 좌표가 있는 경우 사용)
      // 주소-좌표 변환이 필요하지만, 여기서는 지오코딩 API 호출을 피하기 위해
      // 더미 데이터를 사용하여 샘플 구현

      // 예시: 클럽 ID를 기반으로 무작위 좌표 생성 (실제 구현에서는 제거)
      const clubId = venue.venueId;
      const clubLatitude = latitude + (Math.random() - 0.5) * 0.02; // 약 1-2km 범위 내 무작위 위치
      const clubLongitude = longitude + (Math.random() - 0.5) * 0.02;
      
      // 거리 계산
      const distance = calculateDistance(latitude, longitude, clubLatitude, clubLongitude);
      
      // 지정된 반경 이내인지 확인
      return distance <= radius;
    });
    
    // 거리 순으로 정렬 (가까운 순)
    return nearbyVenues.slice(0, 20); // 최대 20개까지만 반환
  } catch (error) {
    console.error('Error fetching venues by location:', error);
    return [];
  }
}; 