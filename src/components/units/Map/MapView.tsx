'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Club, SearchResultsProps } from '@/lib/types';
import BottomSheetComponent, { BottomSheetRef } from '@/components/units/Search/Map/BottomSheet';
import GoogleMap from '@/components/common/GoogleMap';
import 'react-spring-bottom-sheet/dist/style.css';
import MapSearchButton from '@/components/units/Search/Map/MapSearchButton';
import SearchHeader from '@/components/units/Search/SearchHeader';
import { fetchVenues, fetchAllVenues } from '@/lib/actions/search-controller/fetchVenues';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, clickedClubState } from '@/context/recoil-context';
import NaverMap from '@/components/common/NaverMap';

export default function MapView({ filteredClubs }: SearchResultsProps) {
  const sheetRef = useRef<BottomSheetRef>(null);
  const mapRef = useRef<{ filterAddressesInView: () => Promise<Club[]> } | null>(null);
  const [currentFilteredClubs, setCurrentFilteredClubs] = useState<Club[]>(filteredClubs);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);
  const [clickedClub, setClickedClub] = useRecoilState(clickedClubState);
  const isEmpty = (filteredClubs?.length ?? 0) === 0;
  const [isMapSearched, setIsMapSearched] = useState(false);
  const [clubsInView, setClubsInView] = useState<Club[]>([]);
  const isFirstSearch = useRef(true);

  // 모든 클럽 데이터 가져오기
  useEffect(() => {
    const getAllClubs = async () => {
      if (isEmpty && allClubs.length === 0) {
        setLoading(true);
        try {
          const clubs = await fetchAllVenues(accessToken);
          console.log('🔍 모든 클럽 데이터 가져오기:', {
            '총 클럽 수': clubs.length,
            '클럽 목록': clubs.map((club: Club) => ({
              id: club.id,
              name: club.englishName || club.koreanName,
              address: club.address,
            })),
          });
          setAllClubs(clubs);
          setCurrentFilteredClubs(clubs);
        } catch (error) {
          console.error('Failed to fetch all clubs:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    getAllClubs();
  }, [isEmpty, allClubs.length, accessToken]);

  useEffect(() => {
    if (sheetRef.current) {
      console.log('BottomSheet is ready:', sheetRef.current);
    } else {
      console.error('BottomSheet ref is not assigned');
    }
  }, [sheetRef]);

  // 클릭된 클럽이 변경될 때 바텀시트의 위치를 조정
  useEffect(() => {
    if (clickedClub && sheetRef.current) {
      // 클럽이 클릭되었을 때 바텀시트를 중간 위치로 올림
      sheetRef.current.openWithSnap(1); // 중간 위치(스냅 포인트 인덱스 1)로 설정
    }
  }, [clickedClub]);

  // 지도에 표시된 클럽들 업데이트
  const handleSearch = (filteredClubsInView: Club[]) => {
    if (isMapSearched) {
      setCurrentFilteredClubs(filteredClubsInView);
    }
  };

  // 지도 검색 버튼 클릭 핸들러
  const handleMapSearchClick = async () => {
    // 클릭된 클럽 상태 초기화
    setClickedClub(null);

    // 지도 검색 모드 활성화
    setIsMapSearched(true);

    // 현재 보이는 클럽들로 업데이트 (비동기 처리 대기)
    if (mapRef.current) {
      // 바텀시트를 먼저 초기화
      if (sheetRef.current) {
        sheetRef.current.openWithSnap(2);
      }

      // 필터링 작업 수행 및 결과 직접 사용
      const filteredClubs = await mapRef.current.filterAddressesInView();
      setCurrentFilteredClubs(filteredClubs);

      // 바텀시트 애니메이션
      if (sheetRef.current) {
        setTimeout(() => {
          sheetRef.current?.openWithSnap(1);
        }, 10);
      }
    }
  };

  // 외부 검색 결과 업데이트
  useEffect(() => {
    if (!isEmpty) {
      setCurrentFilteredClubs(filteredClubs);
      setIsMapSearched(false);
      setClickedClub(null);
    } else if (allClubs.length > 0) {
      setCurrentFilteredClubs(allClubs);
    }
  }, [filteredClubs, isEmpty, allClubs, setClickedClub]);

  // 클릭된 클럽이 변경되면 바텀시트에 반영
  useEffect(() => {
    if (clickedClub && clickedClub.venue) {
      setIsMapSearched(false);
      setCurrentFilteredClubs(isEmpty ? allClubs : filteredClubs);
    }
  }, [clickedClub, isEmpty, allClubs, filteredClubs]);

  // 지도에 표시할 클럽 목록
  const clubsToDisplay = isEmpty ? allClubs : filteredClubs;

  console.log('🗺️ 지도에 전달되는 클럽 데이터:', {
    isEmpty: isEmpty,
    'allClubs.length': allClubs.length,
    'filteredClubs.length': filteredClubs?.length || 0,
    'clubsToDisplay.length': clubsToDisplay.length,
    clubsToDisplay: clubsToDisplay.map((club) => ({
      id: club.id,
      name: club.englishName || club.koreanName,
      address: club.address,
    })),
  });

  return (
    <>
      <SearchHeader />
      <NaverMap
        clubs={clubsToDisplay}
        minHeight="48.5rem"
        onAddressesInBounds={handleSearch}
        ref={mapRef}
        bottomSheetRef={sheetRef}
        zoom={isEmpty ? 10 : undefined}
      />
      <MapSearchButton onClick={handleMapSearchClick} />
      <BottomSheetComponent ref={sheetRef} filteredClubs={currentFilteredClubs} isMapSearched={isMapSearched} />
    </>
  );
}
