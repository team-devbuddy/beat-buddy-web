'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Club, SearchResultsProps } from '@/lib/types';
import BottomSheetComponent, { BottomSheetRef } from '@/components/units/Search/Map/BottomSheet';
import 'react-spring-bottom-sheet/dist/style.css';
import MapSearchButton from '@/components/units/Search/Map/MapSearchButton';
import SearchHeader from '@/components/units/Search/SearchHeader';
import { fetchVenues } from '@/lib/actions/search-controller/filterDropdown';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, clickedClubState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import NaverMap, { NaverMapHandle } from '@/components/common/NaverMap';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';
import CurrentLocationButton from '@/components/units/Search/Map/CurrentLocationButton';

export default function MapView({ filteredClubs }: SearchResultsProps) {
  const sheetRef = useRef<BottomSheetRef>(null);
  const mapRef = useRef<NaverMapHandle | null>(null);

  const processedFilteredClubs =
    filteredClubs?.map((club: Club) => ({
      ...club,
      venueId: club.id,
      tagList: club.tagList || [],
    })) || [];

  const [currentFilteredClubs, setCurrentFilteredClubs] = useState<Club[]>(processedFilteredClubs);
  const [allClubs, setAllClubs] = useState<Club[]>(processedFilteredClubs);
  const [loading, setLoading] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);
  const [clickedClub, setClickedClub] = useRecoilState(clickedClubState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const [isMapSearched, setIsMapSearched] = useState(false);

  const hasLoadedClubs = useRef(false);
  const clubsCache = useRef<Club[]>([]);

  // ✅ 초기 로딩에서 전체 clubs 불러오기
  useEffect(() => {
    const getAllClubs = async () => {
      if (hasLoadedClubs.current) return;
      setLoading(true);
      try {
        const response = await fetchVenues([], accessToken);
        const clubs = response.clubs || response;
        const clubsWithVenueId = clubs.map((club: Club) => ({
          ...club,
          venueId: club.id,
        }));

        clubsCache.current = clubsWithVenueId;
        hasLoadedClubs.current = true;
        setAllClubs(clubsWithVenueId);

        if (currentFilteredClubs.length === 0) {
          setCurrentFilteredClubs(clubsWithVenueId);
        }
      } catch (error) {
        console.error('Failed to fetch all clubs:', error);
      } finally {
        setLoading(false);
      }
    };
    if (allClubs.length === 0) getAllClubs();
  }, [accessToken, allClubs.length, currentFilteredClubs.length]);

  // ✅ 지도에 표시할 목록은 무조건 currentFilteredClubs
  const clubsToDisplay = currentFilteredClubs;

  // 디버깅: clubsToDisplay 업데이트 확인
  console.log('🗺️ clubsToDisplay 상태:', {
    'currentFilteredClubs.length': currentFilteredClubs.length,
    'clubsToDisplay.length': clubsToDisplay.length,
    isMapSearched: isMapSearched,
    '필터링 결과': currentFilteredClubs.length === 0 ? '빈배열' : `${currentFilteredClubs.length}개 클럽`,
  });

  // 🔍 지도 검색 버튼 클릭
  const handleMapSearchClick = async () => {
    console.log('🔍 지도 검색 버튼 클릭됨');
    setClickedClub(null);
    setIsMapSearched(true);

    if (mapRef.current) {
      try {
        const bounds = await mapRef.current.getBounds();
        if (!bounds) {
          console.log('🗺️ bounds를 가져올 수 없음');
          setCurrentFilteredClubs([]);
          return;
        }

        console.log('🗺️ 현재 지도 bounds:', bounds);

        const clubsInBounds = allClubs.filter((club) => {
          if (club.latitude == null || club.longitude == null) {
            console.log('❌ 좌표 없음:', club.englishName);
            return false;
          }
          const inside =
            club.latitude >= bounds.south &&
            club.latitude <= bounds.north &&
            club.longitude >= bounds.west &&
            club.longitude <= bounds.east;

          console.log(`📍 ${club.englishName} (${club.latitude}, ${club.longitude}) inside?`, inside);
          return inside;
        });

        console.log('🗺️ bounds 내 클럽 수:', clubsInBounds.length);
        console.log('🗺️ 이전 currentFilteredClubs 길이:', currentFilteredClubs.length);

        // 필터링 결과로 currentFilteredClubs 업데이트 (빈배열이어도 그대로)
        const updatedClubs = clubsInBounds.map((club) => ({
          ...club,
          venueId: club.id,
          tagList: club.tagList || [],
        }));

        setCurrentFilteredClubs(updatedClubs);
        console.log('🗺️ currentFilteredClubs 업데이트 완료:', updatedClubs.length, '개');

        // 빈배열인지 확인
        if (updatedClubs.length === 0) {
          console.log('🗺️ 필터링 결과: 빈배열 - 빈배열 그대로 설정됨');
        }
      } catch (err) {
        console.error('🗺️ 지도 검색 중 오류:', err);
        setCurrentFilteredClubs([]);
      }
    }
  };

  // 📍 현재 위치 버튼 클릭
  const handleCurrentLocationClick = async () => {
    try {
      if (mapRef.current) {
        const currentLocation = await mapRef.current.moveToCurrentLocation();
        console.log('📍 현재 위치 이동 완료:', currentLocation);

        const bounds = await mapRef.current.getBounds();
        if (!bounds) {
          setCurrentFilteredClubs([]);
          return;
        }

        const clubsInBounds = allClubs.filter((club) => {
          if (club.latitude == null || club.longitude == null) return false;
          return (
            club.latitude >= bounds.south &&
            club.latitude <= bounds.north &&
            club.longitude >= bounds.west &&
            club.longitude <= bounds.east
          );
        });

        setCurrentFilteredClubs(
          clubsInBounds.map((club) => ({
            ...club,
            venueId: club.id,
            tagList: club.tagList || [],
          })),
        );
        setIsMapSearched(false);
        setClickedClub(null);
      }
    } catch (error) {
      console.error('📍 현재위치 처리 중 오류:', error);
      setCurrentFilteredClubs([]);
    }
  };

  return (
    <>
      <SearchHeader />
      <div
        style={{
          position: 'absolute',
          top: '60px',
          left: 0,
          right: 0,
          height: '50px',
          background: 'linear-gradient(180deg, #17181C 20%, rgba(19, 20, 21, 0.00) 70%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
      <div style={{ height: 'calc(100vh - 100px)', overflow: 'hidden' }}>
        <NaverMap
          clubs={clubsToDisplay}
          minHeight="48.5rem"
          ref={mapRef}
          bottomSheetRef={sheetRef}
          showLocationButton={false}
        />
      </div>
      <MapSearchButton onClick={handleMapSearchClick} />
      <CurrentLocationButton onClick={handleCurrentLocationClick} />
      <BottomSheetComponent ref={sheetRef} filteredClubs={currentFilteredClubs} isMapSearched={isMapSearched} />

      {/* 디버깅: BottomSheet에 전달되는 데이터 확인 */}
      {console.log('🗺️ BottomSheet에 전달되는 데이터:', {
        'currentFilteredClubs.length': currentFilteredClubs.length,
        isMapSearched: isMapSearched,
        '전달되는 filteredClubs':
          currentFilteredClubs.length === 0 ? '빈배열' : `${currentFilteredClubs.length}개 클럽`,
      })}
    </>
  );
}
