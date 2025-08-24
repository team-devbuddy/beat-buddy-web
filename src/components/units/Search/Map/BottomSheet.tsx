'use client';

import React, { forwardRef, useEffect, useState, useImperativeHandle, useCallback } from 'react';
import { Sheet } from 'react-modal-sheet';
import { useRecoilState, useRecoilValue } from 'recoil';
import {
  likedClubsState,
  heartbeatNumsState,
  accessTokenState,
  isMapViewState,
  searchQueryState,
  selectedGenreState,
  selectedLocationState,
  selectedOrderState,
  clickedClubState,
} from '@/context/recoil-context';
import { handleHeartClick } from '@/lib/utils/heartbeatUtils';
import { SearchResultsProps } from '@/lib/types';
import DropdownGroup from '../DropdownGroup';
import ClubList from '../../Main/ClubList';
import { useRouter, useSearchParams } from 'next/navigation';
import { AnimatePresence } from 'framer-motion';
import ClickedClubDetails from './ClickedClub';
import SearchListSkeleton from '@/components/common/skeleton/SearchListSkeleton';
import NoResults from '../NoResult';
import { searchMapDropdown } from '@/lib/actions/search-controller/mapDropdown';

export interface BottomSheetProps extends SearchResultsProps {
  isMapSearched?: boolean;
  hasMore?: boolean;
  isLoadingMore?: boolean;
}

export interface BottomSheetRef {
  close: () => void;
  openWithSnap: (snapIndex: number) => void;
}

const BottomSheetComponent = forwardRef<BottomSheetRef, BottomSheetProps>(
  ({ filteredClubs, isMapSearched, hasMore: externalHasMore, isLoadingMore: externalIsLoadingMore }, ref) => {
    const [isOpen, setOpen] = useState(true);
    const [isMapView, setIsMapView] = useRecoilState(isMapViewState);
    const [selectedGenre, setSelectedGenre] = useRecoilState(selectedGenreState);
    const [selectedLocation, setSelectedLocation] = useRecoilState(selectedLocationState);
    const [selectedSort, setSelectedSort] = useRecoilState(selectedOrderState);
    const [likedClubs, setLikedClubs] = useRecoilState(likedClubsState);
    const [heartbeatNums, setHeartbeatNums] = useRecoilState(heartbeatNumsState);
    const accessToken = useRecoilValue(accessTokenState);
    const searchParams = useSearchParams();
    const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);
    const clickedClub = useRecoilValue(clickedClubState);
    const [height, setHeight] = useState<number>(834);
    const [loading, setLoading] = useState<boolean>(true);
    const [initialSnapPoint, setInitialSnapPoint] = useState<number>(2);
    const [forceUpdateKey, setForceUpdateKey] = useState(0);
    const [currentSnapPoint, setCurrentSnapPoint] = useState<number>(2);
    const [currentFilteredClubs, setCurrentFilteredClubs] = useState(filteredClubs);

    // filteredClubs prop이 변경될 때 currentFilteredClubs 업데이트
    useEffect(() => {
      console.log('🔄 BottomSheet filteredClubs prop 변경 감지:', {
        '새로운 filteredClubs 길이': filteredClubs?.length || 0,
        '기존 currentFilteredClubs 길이': currentFilteredClubs?.length || 0,
        isMapSearched: isMapSearched,
      });

      setCurrentFilteredClubs(filteredClubs);
    }, [filteredClubs]);

    // 무한스크롤을 위한 상태 추가 (외부에서 전달받은 값 우선 사용)
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(externalHasMore ?? true);
    const [isLoadingMore, setIsLoadingMore] = useState(externalIsLoadingMore ?? false);

    const genres = ['힙합', 'R&B', '테크노', 'EDM', '소울&펑크', 'ROCK', '하우스', 'POP', '라틴', 'K-POP'];
    const locations = ['홍대', '이태원', '강남 · 신사', '압구정로데오', '기타'];
    const sorts = ['가까운 순', '인기순'];

    // selectedSort가 undefined일 때 기본값 설정
    useEffect(() => {
      if (!selectedSort) {
        console.log('🔄 selectedSort 초기값 설정: 인기순');
        setSelectedSort('인기순');
      }
    }, [selectedSort, setSelectedSort]);

    // 매핑 객체들
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
      '강남 · 신사': '강남/신사',
      압구정로데오: '압구정',
      기타: '기타',
    };

    const criteriaMap: { [key: string]: string } = {
      '가까운 순': '가까운 순',
      인기순: '인기순',
    };

    // 바텀시트 높이 설정
    const snapPoints = clickedClub ? [height - 10, 400, 70] : [height - 10, 470, 70];

    useImperativeHandle(ref, () => ({
      close: () => setOpen(false),
      openWithSnap: (snapIndex: number) => {
        setInitialSnapPoint(snapIndex);
        setOpen(true);
        setForceUpdateKey((prev) => prev + 1);
      },
    }));

    useEffect(() => {
      const query = searchParams.get('q');
      if (query && query !== searchQuery) {
        setSearchQuery(query);
      }
      setLoading(false);
    }, [searchParams, searchQuery, setSearchQuery]);

    useEffect(() => {
      function updateSnapPoints() {
        const calculateHeight = window.innerHeight - 53;
        setHeight(calculateHeight);
      }
      updateSnapPoints();
      window.addEventListener('resize', updateSnapPoints);
      return () => {
        window.removeEventListener('resize', updateSnapPoints);
      };
    }, []);

    // 드롭다운 상태 변경 감지 및 필터링 실행
    useEffect(() => {
      console.log('🔄 드롭다운 상태 변경 감지:', {
        selectedGenre: `"${selectedGenre}"`,
        selectedLocation: `"${selectedLocation}"`,
        selectedSort: `"${selectedSort}"`,
        selectedSortType: typeof selectedSort,
        filteredClubsLength: filteredClubs?.length,
        isMapSearched,
        timestamp: new Date().toLocaleTimeString(),
      });

      // 드롭다운 상태 변경 시 페이지 리셋
      setPage(1);
      setHasMore(true);

      // 모든 드롭다운이 해제된 상태면 원본 리스트 표시
      const isAllFiltersEmpty = !selectedGenre && !selectedLocation && !selectedSort;
      console.log('🔍 필터 상태 체크:', {
        isAllFiltersEmpty,
        selectedGenre: !!selectedGenre,
        selectedLocation: !!selectedLocation,
        selectedSort: !!selectedSort,
        selectedSortValue: selectedSort,
      });

      if (isAllFiltersEmpty) {
        console.log('🔄 모든 필터 해제 - 원본 리스트 표시');
        setCurrentFilteredClubs(filteredClubs);
        return;
      }

      console.log('🚀 필터링 실행 - executeFiltering 함수 호출');
      // 직접 필터링 로직 실행 (무한루프 방지)
      const executeFiltering = async () => {
        console.log('🔍 드롭다운 필터링 시작:', {
          selectedGenre,
          selectedLocation,
          selectedSort,
          selectedSortType: typeof selectedSort,
          filteredClubsLength: filteredClubs?.length,
          currentFilteredClubsLength: currentFilteredClubs?.length,
          page: 1,
        });

        setLoading(true);
        try {
          // selectedSort가 undefined일 수 있으므로 기본값 설정
          const sortCriteria = selectedSort || '인기순';
          console.log('🎯 최종 sortCriteria:', sortCriteria);

          const filters: any = {
            sortCriteria: sortCriteria,
            page: 1,
            size: 10, // 100에서 10으로 변경
          };

          // 검색어가 있으면 추가
          if (searchQuery && searchQuery.trim()) {
            filters.keyword = searchQuery.trim();
          }

          // 선택된 장르가 있으면 추가
          if (selectedGenre) {
            filters.genreTag = genresMap[selectedGenre] || selectedGenre;
          }

          // 선택된 지역이 있으면 추가
          if (selectedLocation) {
            filters.regionTag = locationsMap[selectedLocation] || selectedLocation;
          }

          // 가까운 순일 때는 현재 위치 정보를 가져와서 위도/경도 추가
          if (sortCriteria === '가까운 순') {
            console.log('📍 가까운 순 정렬 - 위치 정보 가져오기 시작');
            try {
              if (navigator.geolocation) {
                const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                  navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 60000,
                  });
                });

                filters.latitude = position.coords.latitude;
                filters.longitude = position.coords.longitude;
                console.log('📍 현재 위치 정보 추가 성공:', {
                  latitude: filters.latitude,
                  longitude: filters.longitude,
                });
              } else {
                throw new Error('Geolocation not supported');
              }
            } catch (error) {
              console.error('위치 정보 가져오기 실패:', error);
              // 위치 정보가 없으면 인기순으로 변경
              filters.sortCriteria = '인기순';
              console.log('⚠️ 위치 정보 없음 - 인기순으로 변경');
            }
          } else {
            console.log('📍 인기순 정렬 - 위치 정보 불필요');
          }

          console.log('📤 최종 필터 요청 데이터:', filters);
          const data = await searchMapDropdown(filters, accessToken);
          console.log('📥 필터 응답 데이터:', data);

          // API 응답의 heartbeatNum, isHeartbeat 정보를 제대로 처리
          const processedClubs = (data.clubs || []).map((club: any) => {
            // API 응답에는 id 필드가 있으므로 그대로 사용
            const clubWithId = { ...club };

            // venueId 필드를 추가하여 하트비트 상태와 매핑
            const clubWithVenueId = {
              ...clubWithId,
              venueId: club.id, // id를 venueId로 복사
            };

            // heartbeatNum 정보가 있으면 heartbeatNums 상태 업데이트
            if (club.heartbeatNum !== undefined) {
              setHeartbeatNums((prev) => ({
                ...prev,
                [clubWithVenueId.id]: club.heartbeatNum,
              }));
            }

            // isHeartbeat 필드가 없으므로 기본값 false로 설정
            const clubWithHeartbeat = {
              ...clubWithVenueId,
              isHeartbeat: false, // 기본값 설정
            };

            // likedClubs 상태는 업데이트하지 않음 (기본값 false)

            return clubWithHeartbeat;
          });

          // 첫 페이지이므로 기존 데이터를 교체
          setCurrentFilteredClubs(processedClubs);

          // 더 불러올 데이터가 있는지 확인
          setHasMore(data.hasMore || false);

          // 필터링된 결과를 MapView에 전달하기 위해 커스텀 이벤트 발생
          if (typeof window !== 'undefined') {
            const filterEvent = new CustomEvent('mapFilterUpdate', {
              detail: { filteredClubs: processedClubs },
            });
            window.dispatchEvent(filterEvent);
          }
        } catch (error) {
          console.error('드롭다운 필터링 에러:', error);
          setCurrentFilteredClubs(filteredClubs);
        } finally {
          setLoading(false);
        }
      };

      executeFiltering();
    }, [selectedGenre, selectedLocation, selectedSort]); // fetchFilteredClubsByDropdown 제거

    // 무한스크롤을 위한 추가 데이터 로드 함수
    const loadMoreClubs = async () => {
      if (isLoadingMore || !hasMore) return;

      setIsLoadingMore(true);
      try {
        const nextPage = page + 1;

        // selectedSort가 undefined일 수 있으므로 기본값 설정
        const sortCriteria = selectedSort || '인기순';

        const filters: any = {
          sortCriteria: sortCriteria,
          page: nextPage,
          size: 10,
        };

        // 검색어가 있으면 추가
        if (searchQuery && searchQuery.trim()) {
          filters.keyword = searchQuery.trim();
        }

        // 선택된 장르가 있으면 추가
        if (selectedGenre) {
          filters.genreTag = genresMap[selectedGenre] || selectedGenre;
        }

        // 선택된 지역이 있으면 추가
        if (selectedLocation) {
          filters.regionTag = locationsMap[selectedLocation] || selectedLocation;
        }

        // 가까운 순일 때는 현재 위치 정보를 가져와서 위도/경도 추가
        if (sortCriteria === '가까운 순') {
          try {
            if (navigator.geolocation) {
              const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  enableHighAccuracy: true,
                  timeout: 10000,
                  maximumAge: 60000,
                });
              });

              filters.latitude = position.coords.latitude;
              filters.longitude = position.coords.longitude;
            } else {
              throw new Error('Geolocation not supported');
            }
          } catch (error) {
            console.error('위치 정보 가져오기 실패:', error);
            filters.sortCriteria = '인기순';
          }
        }

        console.log('📤 추가 데이터 요청:', filters);
        const data = await searchMapDropdown(filters, accessToken);
        console.log('📥 추가 데이터 응답:', data);

        // 추가 데이터 처리
        const additionalClubs = (data.clubs || []).map((club: any) => {
          const clubWithId = { ...club };
          const clubWithVenueId = {
            ...clubWithId,
            venueId: club.id,
          };

          // heartbeatNum 정보가 있으면 heartbeatNums 상태 업데이트
          if (club.heartbeatNum !== undefined) {
            setHeartbeatNums((prev) => ({
              ...prev,
              [clubWithVenueId.id]: club.heartbeatNum,
            }));
          }

          const clubWithHeartbeat = {
            ...clubWithVenueId,
            isHeartbeat: false,
          };

          return clubWithHeartbeat;
        });

        // 기존 데이터에 추가
        setCurrentFilteredClubs((prev) => [...prev, ...additionalClubs]);

        // 페이지 정보 업데이트
        setPage(nextPage);
        setHasMore(data.hasMore || false);

        // 추가 데이터를 MapView에도 전달
        if (typeof window !== 'undefined') {
          const filterEvent = new CustomEvent('mapFilterUpdate', {
            detail: { filteredClubs: [...currentFilteredClubs, ...additionalClubs] },
          });
          window.dispatchEvent(filterEvent);
        }
      } catch (error) {
        console.error('추가 데이터 로드 에러:', error);
      } finally {
        setIsLoadingMore(false);
      }
    };

    // 무한스크롤을 위한 마지막 클럽 ref 콜백
    const lastClubRef = (node: HTMLDivElement | null) => {
      if (node && hasMore && !isLoadingMore) {
        const observer = new IntersectionObserver(
          (entries) => {
            if (entries[0].isIntersecting) {
              loadMoreClubs();
            }
          },
          { threshold: 0.1 },
        );
        observer.observe(node);
      }
    };

    const handleHeartClickWrapper = async (e: React.MouseEvent, id: number) => {
      await handleHeartClick(e, id, likedClubs, setLikedClubs, setHeartbeatNums, accessToken);
    };

    return (
      <div className="flex w-full flex-col">
        <AnimatePresence>
          {isOpen && (
            <Sheet
              key={forceUpdateKey}
              className="!z-10 mx-auto w-full min-w-[360px] max-w-[600px]"
              isOpen={true}
              onClose={() => setOpen(true)}
              initialSnap={initialSnapPoint}
              snapPoints={snapPoints}
              onSnap={(index) => setCurrentSnapPoint(index)}>
              <Sheet.Container className="relative h-full w-full !shadow-none">
                <Sheet.Header className="relative flex w-full cursor-pointer flex-col justify-center rounded-t-lg bg-BG-black pt-[6px]">
                  <div className="flex justify-center">
                    <div className="my-2 h-[0.25rem] w-[5rem] rounded-[2px] border-none bg-gray500" />
                  </div>
                  {!clickedClub && (
                    <div className="w-full pb-[0.5rem] pt-2">
                      <DropdownGroup
                        genres={genres}
                        locations={locations}
                        criteria={sorts}
                        selectedGenre={selectedGenre}
                        setSelectedGenre={setSelectedGenre}
                        selectedLocation={selectedLocation}
                        setSelectedLocation={setSelectedLocation}
                        selectedOrder={selectedSort}
                        setSelectedOrder={setSelectedSort}
                      />
                    </div>
                  )}
                </Sheet.Header>
                <Sheet.Content className="relative z-10 w-full bg-BG-black" disableDrag={true}>
                  <div className="club-list-container flex w-full flex-col bg-BG-black text-[0.93rem]">
                    <div
                      className={`w-full flex-wrap gap-4 ${
                        !clickedClub && currentSnapPoint === 0
                          ? 'pb-[60px]'
                          : !clickedClub && currentSnapPoint === 1
                            ? 'pb-[200px]'
                            : ''
                      }`}>
                      {loading ? (
                        <SearchListSkeleton />
                      ) : clickedClub ? (
                        <ClickedClubDetails
                          likedClubs={likedClubs}
                          heartbeatNums={heartbeatNums}
                          handleHeartClickWrapper={handleHeartClickWrapper}
                        />
                      ) : (currentFilteredClubs?.length ?? 0) > 0 ? (
                        <div className="px-[1.25rem] pb-[2.5rem] pt-[0.88rem]">
                          <ClubList
                            clubs={currentFilteredClubs}
                            likedClubs={likedClubs}
                            heartbeatNums={heartbeatNums}
                            handleHeartClickWrapper={handleHeartClickWrapper}
                            lastClubRef={lastClubRef}
                            hasMore={hasMore}
                            isLoading={isLoadingMore}
                          />
                        </div>
                      ) : (
                        <NoResults text="조건에 맞는 검색 결과가 없어요" />
                      )}
                    </div>
                  </div>
                </Sheet.Content>
              </Sheet.Container>
              <style jsx global>{`
                .react-modal-sheet-container {
                  background-color: #1c1c1e !important;
                }
                .react-modal-sheet-content {
                  background-color: #1c1c1e !important;
                  height: 100% !important;
                  overflow-y: auto !important;
                }
                .react-modal-sheet-drag-indicator {
                  display: none !important;
                }
                .club-list-container {
                  min-height: 100%;
                }
              `}</style>
            </Sheet>
          )}
        </AnimatePresence>
      </div>
    );
  },
);

export default BottomSheetComponent;
