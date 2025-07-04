'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Club, SearchResultsProps } from '@/lib/types';
import BottomSheetComponent, { BottomSheetRef } from '@/components/units/Search/Map/BottomSheet';
import GoogleMap from '@/components/common/GoogleMap';
import 'react-spring-bottom-sheet/dist/style.css';
import MapSearchButton from '@/components/units/Search/Map/MapSearchButton';
import SearchHeader from '@/components/units/Search/SearchHeader';
import { fetchVenues } from '@/lib/actions/search-controller/fetchVenues';
import { useRecoilValue, useRecoilState } from 'recoil';
import { accessTokenState, clickedClubState } from '@/context/recoil-context';
import NaverMap from '@/components/common/NaverMap';
import CurrentLocationButton from '@/components/units/Search/Map/CurrentLocationButton';

export default function MapView({ filteredClubs }: SearchResultsProps) {
  const sheetRef = useRef<BottomSheetRef>(null);
  const mapRef = useRef<{ filterAddressesInView: () => Promise<Club[]>, getMapInstance: () => any } | null>(null);
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
          const clubs = await fetchVenues([], accessToken);
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
  
      // ✅ 여기서 중복 제거
      const uniqueClubs = Array.from(
        new Map(filteredClubs.map(club => [club.venueId, club])).values()
      );
  
      setCurrentFilteredClubs(uniqueClubs);
  
      if (sheetRef.current) {
        setTimeout(() => {
          sheetRef.current?.openWithSnap(1);
        }, 10);
      }
    }
  };

  const handleCurrentLocationClick = () => {
    if (!navigator.geolocation) {
      alert('현재 위치 기능을 지원하지 않는 브라우저입니다.');
      return;
    }
  
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const userLatLng = new window.naver.maps.LatLng(lat, lng);
  
        const mapInstance = mapRef.current?.getMapInstance?.();
        if (!mapInstance) {
          console.warn('지도 인스턴스를 찾을 수 없습니다.');
          return;
        }
  
        // 현재 위치 마커 생성
        new window.naver.maps.Marker({
          position: userLatLng,
          map: mapInstance,
          icon: {
            content: `
              <div style="transform: translateY(-8px);">
                <img src="/icons/mapMenow.svg" style="width: 24px; height: 24px;" />
              </div>
            `,
            size: new window.naver.maps.Size(24, 24),
            anchor: new window.naver.maps.Point(12, 12),
          },
        });
  
        // 지도 중심 이동
        mapInstance.setCenter(userLatLng);
      },
      (error) => {
        alert("현재 위치를 찾을 수 없습니다. 위치 정보는 지상이나 Wi-Fi 환경에서 더 정확하게 확인할 수 있어요!");
        console.error(error);
      }
    );
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
      <CurrentLocationButton onClick={handleCurrentLocationClick} />
      <BottomSheetComponent 
        ref={sheetRef}
        filteredClubs={currentFilteredClubs} 
        isMapSearched={isMapSearched}
      />
    </>
  );
}
