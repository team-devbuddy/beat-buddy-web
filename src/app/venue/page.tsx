'use client';
import { useEffect, useState } from 'react';
import { useResetRecoilState, useRecoilValue } from 'recoil';
import {
  selectedGenreState,
  selectedLocationState,
  selectedOrderState,
  searchQueryState,
  clickedClubState,
  accessTokenState,
} from '@/context/recoil-context';
import MapView from '@/components/units/Map/MapView';
import { getAllVenues } from '@/lib/actions/search-controller/filterDropdown';
import { Club } from '@/lib/types';
import Loading from '../loading';

function VenuePage() {
  const resetSelectedGenre = useResetRecoilState(selectedGenreState);
  const resetSelectedLocation = useResetRecoilState(selectedLocationState);
  const resetSelectedOrder = useResetRecoilState(selectedOrderState);
  const resetSearchQuery = useResetRecoilState(searchQueryState);
  const resetClickedClub = useResetRecoilState(clickedClubState);
  const accessToken = useRecoilValue(accessTokenState);

  const [allVenues, setAllVenues] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // venue 페이지 진입 시 모든 클럽 베뉴 데이터 가져오기
  useEffect(() => {
    const fetchAllVenues = async () => {
      try {
        setLoading(true);
        // 초기 렌더링 시 모든 베뉴 정보 조회
        const result = await getAllVenues(accessToken);

        setAllVenues(result.clubs || []);
        console.log('🎯 모든 클럽 베뉴 로드 완료:', result.clubs?.length || 0, '개');

        // 첫 번째 클럽의 상세 구조 확인
        if (result.clubs && result.clubs.length > 0) {
          console.log('🎯 첫 번째 클럽 상세 구조:', {
            firstClub: result.clubs[0],
            allKeys: Object.keys(result.clubs[0]),
            hasTagList: 'tagList' in result.clubs[0],
            tagListValue: result.clubs[0].tagList,
          });
        }
      } catch (error) {
        console.error('클럽 베뉴 로드 실패:', error);
        setAllVenues([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllVenues();
  }, [accessToken]);

  useEffect(() => {
    // venue 페이지 진입 시 검색 관련 상태들을 초기화
    resetSelectedGenre();
    resetSelectedLocation();
    resetSelectedOrder();
    resetSearchQuery();
    resetClickedClub();
  }, [resetSelectedGenre, resetSelectedLocation, resetSelectedOrder, resetSearchQuery, resetClickedClub]);

  if (loading) {
    return <Loading />;
  }

  return <MapView filteredClubs={allVenues} />;
}

export default VenuePage;
