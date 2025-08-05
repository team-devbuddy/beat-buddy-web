'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SearchResultsProps, Club } from '@/lib/types';
import ClubList from '../Main/ClubList';
import SearchHeader from './SearchHeader';
import NoResults from './NoResult';
import MapView from './Map/MapView';
import DropdownGroup from './DropdownGroup';
import MapButton from './Map/MapButton';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  likedClubsState,
  heartbeatNumsState,
  accessTokenState,
  isMapViewState,
  selectedGenreState,
  selectedLocationState,
  selectedOrderState,
  searchQueryState,
} from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { filterDropdown } from '@/lib/actions/search-controller/filterDropdown';
import SearchListSkeleton from '@/components/common/skeleton/SearchListSkeleton';

const genresMap: { [key: string]: string } = {
  힙합: 'HIPHOP',
  'R&B': 'R&B',
  테크노: 'TECHNO',
  EDM: 'EDM',
  하우스: 'HOUSE',
  라틴: 'LATIN',
  '소울&펑크': 'SOUL&FUNK',
  'K-POP': 'K-POP',
  락: 'ROCK',
  POP: 'POP',
};

const locationsMap: { [key: string]: string } = {
  홍대: '홍대',
  이태원: '이태원',
  '강남/신사': '강남/신사',
  압구정: '압구정',
  기타: '기타',
};

const criteriaMap: { [key: string]: string } = {
  '가까운 순': '거리순',
  인기순: '인기순',
};

export default function SearchResults({
  initialFilteredClubs = [],
}: SearchResultsProps & { initialFilteredClubs?: Club[] }) {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState);
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationState);
  const [selectedOrder, setSelectedOrder] = useRecoilState(selectedOrderState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);
  const initialLoadRef = useRef(true);

  const [filteredClubs, setFilteredClubs] = useState(initialFilteredClubs);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef<IntersectionObserver | null>(null);

  // 이전 필터 값들을 추적
  const prevFiltersRef = useRef({
    searchQuery: '',
    selectedGenre: '',
    selectedLocation: '',
    selectedOrder: '가까운 순',
  });

  const genres = useMemo(
    () => ['힙합', 'R&B', '테크노', 'EDM', '소울&펑크', 'ROCK', '하우스', 'POP', '라틴', 'K-POP'],
    [],
  );
  const locations = useMemo(() => ['홍대', '이태원', '강남/신사', '압구정', '기타'], []);
  const criteria = useMemo(() => ['가까운 순', '인기순'], []);

  const performSearch = useCallback(
    async (targetPage: number, append: boolean = false) => {
      if (isLoading) return;
      setIsLoading(true);

      try {
        const filters = {
          keyword: searchQuery || '',
          genreTag: genresMap[selectedGenre] || '',
          regionTag: locationsMap[selectedLocation] || '',
          sortCriteria: criteriaMap[selectedOrder] || '가까운 순',
          page: targetPage,
          size: 10,
        };

        console.log('검색 실행:', { targetPage, append, filters });
        const response = await filterDropdown(filters, accessToken);
        const clubs = response.clubs || response;
        const hasMoreData = response.hasMore ?? clubs.length === 10;

        console.log('API 응답 처리:', {
          targetPage,
          append,
          responseClubsCount: clubs.length,
          hasMoreData,
          clubIds: clubs.map((c: Club) => c.venueId),
        });

        if (append) {
          setFilteredClubs((prev) => {
            const existingIds = new Set(prev.map((c) => c.venueId));
            const newClubs = clubs.filter((c: Club) => !existingIds.has(c.venueId));
            const result = [...prev, ...newClubs];
            console.log('🔄 무한스크롤 결과:', {
              기존: prev.length,
              새로: newClubs.length,
              총합: result.length,
              append,
            });
            return result;
          });
        } else {
          console.log('🆕 새 검색 결과 설정:', clubs.length);
      setFilteredClubs(clubs);
          setPage(1);
        }
        setHasMore(hasMoreData);
        console.log('📊 검색 완료 상태:', {
          hasMore: hasMoreData,
          page: targetPage,
          isLoading: false,
          clubsCount: clubs.length,
        });
      } catch (error) {
        console.error('검색 실패:', error);
        console.log('검색 실패 상세:', { targetPage, append, error });
      } finally {
        console.log('검색 완료 (finally):', { targetPage, append, isLoading: false });
        setIsLoading(false);
      }
    },
    [searchQuery, selectedGenre, selectedLocation, selectedOrder, accessToken],
  );

  // 초기 로딩 시 한 번만 실행
  useEffect(() => {
    setSelectedOrder('가까운 순');
    performSearch(1);
  }, []);

  // 필터/정렬 변경 시 검색 재실행
  useEffect(() => {
    if (initialLoadRef.current) {
      initialLoadRef.current = false;
      // 초기값 설정
      prevFiltersRef.current = {
        searchQuery,
        selectedGenre,
        selectedLocation,
        selectedOrder,
      };
      return;
    }

    // 실제 필터 값이 변경되었는지 확인
    const hasFilterChanged =
      prevFiltersRef.current.searchQuery !== searchQuery ||
      prevFiltersRef.current.selectedGenre !== selectedGenre ||
      prevFiltersRef.current.selectedLocation !== selectedLocation ||
      prevFiltersRef.current.selectedOrder !== selectedOrder;

    if (!hasFilterChanged) {
      console.log('필터 변경 없음, 검색 생략');
      return;
    }

    console.log('필터/정렬 변경으로 인한 새 검색:', {
      이전: prevFiltersRef.current,
      현재: { searchQuery, selectedGenre, selectedLocation, selectedOrder },
    });

    // 이전 값 업데이트
    prevFiltersRef.current = {
      searchQuery,
      selectedGenre,
      selectedLocation,
      selectedOrder,
    };

    // 페이지를 1로 리셋하고 새로 검색
    setPage(1);
    setHasMore(true);
    performSearch(1);
  }, [searchQuery, selectedGenre, selectedLocation, selectedOrder]);

  // 무한 스크롤을 위한 페이지 변경 시 실행
  useEffect(() => {
    if (page === 1) return;

    console.log('페이지 변경으로 인한 로드:', { page });

    // 직접 API 호출로 무한루프 방지
    const loadPage = async () => {
      if (isLoading) return;
      setIsLoading(true);

      try {
    const filters = {
          keyword: searchQuery || '',
      genreTag: genresMap[selectedGenre] || '',
      regionTag: locationsMap[selectedLocation] || '',
          sortCriteria: criteriaMap[selectedOrder] || '가까운 순',
          page: page,
          size: 10,
    };

        console.log('페이지 로드 실행:', { page, filters });
        const response = await filterDropdown(filters, accessToken);
        const clubs = response.clubs || response;
        const hasMoreData = response.hasMore ?? clubs.length === 10;

        console.log('페이지 로드 응답:', {
          page,
          responseClubsCount: clubs.length,
          hasMoreData,
          clubIds: clubs.map((c: Club) => c.venueId),
        });

        setFilteredClubs((prev) => {
          const existingIds = new Set(prev.map((c) => c.venueId));
          const newClubs = clubs.filter((c: Club) => !existingIds.has(c.venueId));
          const result = [...prev, ...newClubs];
          console.log('페이지 로드 결과:', {
            기존: prev.length,
            새로: newClubs.length,
            총합: result.length,
          });
          return result;
        });

        setHasMore(hasMoreData);
        console.log('페이지 로드 완료:', { hasMore: hasMoreData, page });
      } catch (error) {
        console.error('페이지 로드 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [page]);

  // Intersection Observer 설정
  const lastClubRef = useCallback(
    (node: HTMLDivElement | null) => {
      console.log('🔥 lastClubRef 호출됨:', { node: !!node, isLoading, hasMore });

      if (isLoading || !hasMore) {
        console.log('❌ 조건 불만족으로 observer 설정 안함:', { isLoading, hasMore });
        return;
      }

      if (observer.current) {
        console.log('🔄 기존 observer 해제');
        observer.current.disconnect();
      }

      observer.current = new IntersectionObserver((entries) => {
        console.log('👀 IntersectionObserver 콜백:', {
          isIntersecting: entries[0].isIntersecting,
          currentPage: page,
          nextPage: page + 1,
        });

        if (entries[0].isIntersecting) {
          console.log('🚀 무한스크롤 트리거! 페이지 증가:', page + 1);
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) {
        console.log('✅ observer 등록 완료');
        observer.current.observe(node);
      }
    },
    [isLoading, hasMore],
  );

  useEffect(() => {
    if (filteredClubs.length > 0) {
      const likedStatuses = filteredClubs.reduce((acc: { [key: number]: boolean }, club: Club) => {
        acc[club.venueId] = club.isHeartbeat || false;
        return acc;
      }, {});
      const heartbeatNumbers = filteredClubs.reduce((acc: { [key: number]: number }, club: Club) => {
        acc[club.venueId] = club.heartbeatNum || 0;
        return acc;
      }, {});
      setLikedClubs((prev) => ({ ...prev, ...likedStatuses }));
      setHeartbeatNums((prev) => ({ ...prev, ...heartbeatNumbers }));
    }
  }, [filteredClubs, setLikedClubs, setHeartbeatNums]);

  // filteredClubs 변경 감지
  useEffect(() => {
    console.log('🔄 filteredClubs 상태 변경:', {
      length: filteredClubs.length,
      clubIds: filteredClubs.map((c) => c.venueId),
      page,
    });
  }, [filteredClubs, page]);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  useEffect(() => {
    setIsMapView(false);
  }, [setIsMapView]);

  if (isLoading && page === 1) {
  return (
        <div key="list" className="flex flex-grow flex-col bg-BG-black">
          <SearchHeader />
          <DropdownGroup
            genres={genres}
            locations={locations}
            criteria={criteria}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
          <SearchListSkeleton />
        </div>
    );
  }

  console.log('🎯 SearchResults 렌더링:', {
    filteredClubsLength: filteredClubs.length,
    hasMore,
    isLoading,
    page,
    isMapView,
  });

  return (
    <div className="relative flex w-full flex-col">
      {isMapView ? (
        <div key="map">
          <MapView filteredClubs={filteredClubs} searchQuery={searchQuery} />
        </div>
      ) : (
        <div key="list" className="flex flex-grow flex-col bg-BG-black">
          <SearchHeader />
          <DropdownGroup
            genres={genres}
            locations={locations}
            criteria={criteria}
            selectedGenre={selectedGenre}
            setSelectedGenre={setSelectedGenre}
            selectedLocation={selectedLocation}
            setSelectedLocation={setSelectedLocation}
            selectedOrder={selectedOrder}
            setSelectedOrder={setSelectedOrder}
          />
          {filteredClubs.length > 0 ? (
            <div className="px-[1.25rem] pb-[2.5rem] pt-[1.25rem]">
              <ClubList
                clubs={filteredClubs}
                likedClubs={likedClubs}
                heartbeatNums={heartbeatNums}
                handleHeartClickWrapper={handleHeartClickWrapper}
                lastClubRef={lastClubRef}
                hasMore={hasMore}
                isLoading={isLoading}
              />
            </div>
          ) : (
            <NoResults text="조건에 맞는 검색 결과가 없어요." />
          )}
        </div>
      )}
      {filteredClubs.length > 0 && !isMapView && <MapButton />}
    </div>
  );
}
