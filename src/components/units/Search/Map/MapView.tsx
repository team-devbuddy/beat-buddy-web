'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Club, SearchResultsProps } from '@/lib/types';
import BottomSheetComponent, { BottomSheetRef } from '@/components/units/Search/Map/BottomSheet';
import GoogleMap from '@/components/common/GoogleMap';
import 'react-spring-bottom-sheet/dist/style.css';
import MapSearchButton from '@/components/units/Search/Map/MapSearchButton';
import SearchHeader from '@/components/units/Search/SearchHeader';
import { fetchVenues } from '@/lib/actions/search-controller/filterDropdown';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, clickedClubState } from '@/context/recoil-context';
import NaverMap from '@/components/common/NaverMap';

export default function MapView({ filteredClubs }: SearchResultsProps) {
  const sheetRef = useRef<BottomSheetRef>(null);
  const mapRef = useRef<{ filterAddressesInView: () => Promise<Club[]>; getMapInstance: () => any } | null>(null);
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
          const response = await fetchVenues([], accessToken);
          const clubs = response.clubs || response;
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
    setClickedClub(null);
    setIsMapSearched(true);

    if (mapRef.current) {
      if (sheetRef.current) {
        sheetRef.current.openWithSnap(2);
      }

      const filteredClubs = await mapRef.current.filterAddressesInView();

      // ✅ 여기서 중복 제거 (venueId 사용)
      const uniqueClubs = Array.from(new Map(filteredClubs.map((club) => [club.venueId, club])).values());

      console.log('🗺️ 지도 검색 결과:', {
        전체클럽수: filteredClubs.length,
        중복제거후: uniqueClubs.length,
        클럽목록: uniqueClubs.map((c) => c.englishName),
      });

      setCurrentFilteredClubs(uniqueClubs);

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

  // 클릭된 클럽이 변경되면 바텀시트에 반영 (지도 검색 상태는 유지)
  useEffect(() => {
    if (clickedClub && clickedClub.venue) {
      // 지도 검색 상태를 유지하면서 클럽 리스트만 복원
      if (!isMapSearched) {
        setCurrentFilteredClubs(isEmpty ? allClubs : filteredClubs);
      }
    }
  }, [clickedClub, isEmpty, allClubs, filteredClubs, isMapSearched]);

  // 지도에 표시할 클럽 목록
  const clubsToDisplay = isEmpty ? allClubs : filteredClubs;

  return (
    <div className="relative flex flex-col">
      {/* 헤더 */}
      <div className="relative z-20">
        <SearchHeader />
      </div>

      {/* 헤더 아래 그라디언트 오버레이 */}
      <div
        className="pointer-events-none absolute left-0 right-0 top-[1.5rem] z-10 h-[3.5rem]"
        style={{
          background: 'linear-gradient(180deg, #131415 68.5%, rgba(19, 20, 21, 0.00) 100%)',
        }}
      />

      {/* 지도 */}
      <NaverMap
        clubs={clubsToDisplay}
        minHeight="100dvh"
        onAddressesInBounds={handleSearch}
        ref={mapRef}
        bottomSheetRef={sheetRef}
        zoom={isEmpty ? 10 : undefined}
        showLocationButton={false}
      />

      <MapSearchButton onClick={handleMapSearchClick} />
      <BottomSheetComponent ref={sheetRef} filteredClubs={currentFilteredClubs} isMapSearched={isMapSearched} />
    </div>
  );
}
