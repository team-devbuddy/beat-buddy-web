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
import { accessTokenState, clickedClubState, likedClubsState, heartbeatNumsState } from '@/context/recoil-context';
import NaverMap from '@/components/common/NaverMap';
import { getMyHearts } from '@/lib/actions/hearbeat-controller/getMyHearts';

export default function MapView({ filteredClubs }: SearchResultsProps) {
  const sheetRef = useRef<BottomSheetRef>(null);
  const mapRef = useRef<{ filterAddressesInView: () => Promise<Club[]> } | null>(null);
  const [currentFilteredClubs, setCurrentFilteredClubs] = useState<Club[]>(filteredClubs);
  const [allClubs, setAllClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(false);
  const accessToken = useRecoilValue(accessTokenState);
  const [clickedClub, setClickedClub] = useRecoilState(clickedClubState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const isEmpty = (filteredClubs?.length ?? 0) === 0;
  const [isMapSearched, setIsMapSearched] = useState(false);
  const [clubsInView, setClubsInView] = useState<Club[]>([]);
  const isFirstSearch = useRef(true);

  // 좋아요 상태 초기화
  useEffect(() => {
    const fetchLikedStatuses = async () => {
      if (accessToken) {
        try {
          const heartbeats = await getMyHearts(accessToken);
          const likedStatuses = heartbeats.reduce(
            (acc, heartbeat) => {
              acc[heartbeat.venueId] = heartbeat.isHeartbeat;
              return acc;
            },
            {} as { [key: number]: boolean },
          );
          setLikedClubs((prev) => ({ ...prev, ...likedStatuses }));

          const heartbeatNumbers = heartbeats.reduce(
            (acc, heartbeat) => {
              acc[heartbeat.venueId] = heartbeat.heartbeatNum;
              return acc;
            },
            {} as { [key: number]: number },
          );
          setHeartbeatNums((prev) => ({ ...prev, ...heartbeatNumbers }));
        } catch (error) {
          console.error('Error fetching liked statuses:', error);
        }
      }
    };

    fetchLikedStatuses();
  }, [accessToken, setLikedClubs, setHeartbeatNums]);

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
          // 초기 로드 시에만 currentFilteredClubs 설정
          if (currentFilteredClubs.length === 0) {
            setCurrentFilteredClubs(clubs);
          }
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

  // 통합된 useEffect: 외부 검색 결과 및 클릭된 클럽 변경 처리
  useEffect(() => {
    // 클릭된 클럽이 있는 경우
    if (clickedClub && clickedClub.venue) {
      setIsMapSearched(false);
      // 클릭된 클럽이 있으면 원래 리스트로 복원
      const clubsToShow = isEmpty ? allClubs : filteredClubs;
      setCurrentFilteredClubs(clubsToShow);
      return;
    }

    // 외부 검색 결과가 있는 경우
    if (!isEmpty) {
      setCurrentFilteredClubs(filteredClubs);
      setIsMapSearched(false);
      setClickedClub(null);
    } else if (allClubs.length > 0 && currentFilteredClubs.length === 0) {
      // 검색 결과가 없고 allClubs가 있지만 currentFilteredClubs가 비어있는 경우에만 설정
      setCurrentFilteredClubs(allClubs);
    }
  }, [filteredClubs, isEmpty, allClubs, clickedClub, currentFilteredClubs.length]);

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
      <div
        style={{
          position: 'absolute',
          top: '60px', // SearchHeader 높이에 맞춰 조정
          left: 0,
          right: 0,
          height: '50px',
          background: 'linear-gradient(180deg, #131415 15%, rgba(19, 20, 21, 0.00) 70%)',
          zIndex: 10,
          pointerEvents: 'none',
        }}
      />
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
