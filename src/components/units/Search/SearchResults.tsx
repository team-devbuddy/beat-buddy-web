'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { SearchResultsProps, Club } from '@/lib/types';
import ClubList from '../Main/ClubList';
import SearchHeader from './SearchHeader';
import NoResults from './NoResult';
import MapView from './Map/MapView';
import DropdownGroup from './DropdownGroup';
import MapButton from './Map/MapButton';
import { useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil';
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
import { filterMapDropdown } from '@/lib/actions/search-controller/filterMapDropdown';
import { fetchVenues } from '@/lib/actions/search-controller/fetchVenues';
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
  홍대: 'HONGDAE',
  이태원: 'ITAEWON',
  '강남/신사': 'GANGNAM/SINSA',
  압구정: 'APGUJEONG',
  기타: 'OTHERS',
};

const criteriaMap: { [key: string]: string } = {
  '관련도 순': '관련도순',
  인기순: '인기순',
};

export default function SearchResults({
  filteredClubs: initialFilteredClubs = [],
}: SearchResultsProps & { initialFilteredClubs: Club[] }) {
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
  const [previousSearchQuery, setPreviousSearchQuery] = useState<string | null>(null);
  const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
  const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState);
  const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationState);
  const [selectedOrder, setSelectedOrder] = useRecoilState(selectedOrderState);
  const resetSelectedGenre = useResetRecoilState(selectedGenreState);
  const resetSelectedLocation = useResetRecoilState(selectedLocationState);
  const resetSelectedOrder = useResetRecoilState(selectedOrderState);
  const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
  const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
  const accessToken = useRecoilValue(accessTokenState);

  const genres = useMemo(
    () => ['힙합', 'R&B', '테크노', 'EDM', '소울&펑크', 'ROCK', '하우스', 'POP', '라틴', 'K-POP'],
    [],
  );
  const locations = useMemo(() => ['홍대', '이태원', '강남/신사', '압구정', '기타'], []);

  const criteria = useMemo(() => ['관련도순', '인기순'], []);

  const [filteredClubs, setFilteredClubs] = useState(initialFilteredClubs);
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가
  const initialRender = useRef(true);

  const handleHeartClickWrapper = async (e: React.MouseEvent, venueId: number) => {
    await handleHeartClick(e, venueId, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
  };

  const fetchFilteredClubsByQuery = useCallback(async () => {
    setIsLoading(true); // 로딩 상태 활성화

    if (searchQuery && searchQuery !== previousSearchQuery) {
      const queryArray = searchQuery.split(' ').filter(Boolean);
      const clubs = await fetchVenues(queryArray, accessToken);
      setFilteredClubs(clubs);
      setPreviousSearchQuery(searchQuery);
    }
    setIsLoading(false); // 로딩 상태 비활성화
  }, [searchQuery, accessToken, previousSearchQuery]);

  const fetchFilteredClubsByFilters = useCallback(async () => {
    setIsLoading(true); // 로딩 상태 활성화
    const queryArray = searchQuery.split(' ').filter(Boolean);

    const filters = {
      keyword: searchQuery ? queryArray : [],
      genreTag: genresMap[selectedGenre] || '',
      regionTag: locationsMap[selectedLocation] || '',
      sortCriteria: criteriaMap[selectedOrder] || '관련도순',
    };
    const clubs = await filterDropdown(filters, accessToken);
    setFilteredClubs(clubs);
    setIsLoading(false); // 로딩 상태 비활성화
  }, [searchQuery, selectedGenre, selectedLocation, selectedOrder, accessToken]);

  const fetchFilteredClubsByMapView = useCallback(async () => {
    setIsLoading(true); // 로딩 상태 활성화

    const filters = {
      venueList: filteredClubs,
      genreTag: genresMap[selectedGenre] || '',
      regionTag: locationsMap[selectedLocation] || '',
      sortCriteria: criteriaMap[selectedOrder] || '관련도순',
    };

    try {
      const data = await filterMapDropdown(filters, accessToken);
      console.log(filters);
      setFilteredClubs(data);
    } catch (error) {
      console.error('Failed to fetch map view filtered clubs:', error);
    }

    setIsLoading(false); // 로딩 상태 비활성화
  }, [filteredClubs, selectedGenre, selectedLocation, selectedOrder, accessToken]);

  useEffect(() => {
    fetchFilteredClubsByQuery();
  }, [fetchFilteredClubsByQuery]);

  useEffect(() => {
    if (initialRender.current) {
      initialRender.current = false;
      return;
    }

    if (isMapView) {
      fetchFilteredClubsByMapView();
    } else {
      fetchFilteredClubsByFilters();
    }
  }, [selectedGenre, selectedLocation, selectedOrder, isMapView]);

  useEffect(() => {
    setIsMapView(false);
  }, [setIsMapView]);

  useEffect(() => {
    setSelectedOrder('관련도 순');
  }, [resetSelectedOrder, resetSelectedGenre, resetSelectedLocation]);

  return (
    <div className="relative flex w-full flex-col">
      {isLoading ? (
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
      ) : isMapView ? (
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
              />
            </div>
          ) : (
            <NoResults />
          )}
        </div>
      )}

      {filteredClubs.length > 0 ? <MapButton /> : ''}
    </div>
  );
}

export async function getServerSideProps() {
  const clubs = await fetchVenues([], null); // 서버 사이드에서 기본 클럽 데이터 가져오기
  return {
    props: {
      initialFilteredClubs: clubs,
    },
  };
}
