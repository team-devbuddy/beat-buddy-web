'use client';

import { useEffect, useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Club } from '@/lib/types';
import { useRecoilState } from 'recoil';
import { clickedClubState } from '@/context/recoil-context';

export interface NaverMapHandle {
  filterAddressesInView: () => Promise<Club[]>;
}

interface NaverMapProps {
  clubs: Club[];
  width?: string;
  height?: string;
  minHeight?: string;
  zoom?: number;
  onAddressesInBounds?: (clubsInView: Club[]) => void;
  bottomSheetRef?: React.RefObject<any>;
}

// 영구 캐시 (localStorage 사용)
const GEOCODE_CACHE_KEY = 'naver_geocode_cache';

const getGeocodeCache = (): Map<string, { lat: number; lng: number }> => {
  try {
    const cached = localStorage.getItem(GEOCODE_CACHE_KEY);
    if (cached) {
      const parsed = JSON.parse(cached);
      return new Map(Object.entries(parsed));
    }
  } catch (e) {
    console.warn('Failed to load geocode cache:', e);
  }
  return new Map();
};

const saveGeocodeCache = (cache: Map<string, { lat: number; lng: number }>) => {
  try {
    const obj = Object.fromEntries(cache);
    localStorage.setItem(GEOCODE_CACHE_KEY, JSON.stringify(obj));
  } catch (e) {
    console.warn('Failed to save geocode cache:', e);
  }
};

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(function NaverMap(
  { clubs, width = '100%', height = '100%', minHeight, zoom = 10, onAddressesInBounds, bottomSheetRef },
  ref,
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [clusterer, setClusterer] = useState<any>(null);
  const markerRefs = useRef<{ club: Club; marker: naver.maps.Marker }[]>([]);
  const [clickedClub, setClickedClub] = useRecoilState(clickedClubState);
  const geocodeCache = useRef(getGeocodeCache());

  // 1. 지도와 클러스터러 초기화 (최초 한 번만 실행)
  useEffect(() => {
    if (!mapRef.current || !window.naver?.maps || map) return;

    const mapInstance = new window.naver.maps.Map(mapRef.current, {
      gl: true,
      center: new window.naver.maps.LatLng(37.5666103, 126.9783882),
      zoom,
      customStyleId: '48547b93-96df-42da-9e2a-b0f277010e41', // 스타일 에디터에서 설정한 스타일 ID
      logoControl: true,
      logoControlOptions: {
        position: window.naver.maps.Position.BOTTOM_RIGHT,
      },
      scaleControl: false,
    });

    // 현재위치 버튼 HTML 요소 생성
    const locationButton = document.createElement('div');
    locationButton.innerHTML = '<img src="/icons/mapMeNow.svg" style="width: 24px; height: 24px;" />';
    locationButton.style.cssText = `
      position: absolute;
      bottom: 100px;
      right: 20px;
      width: 40px;
      height: 40px;
      padding: 0.5rem;
      background-color: #480522;
      border-radius: 50%;
      border: 1px solid #EE1171;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 5;
    `;

    // 버튼을 지도 컨테이너에 추가
    mapRef.current.appendChild(locationButton);

    // 현재위치 마커 참조 저장
    let currentLocationMarker: naver.maps.Marker | null = null;
    let watchId: number | null = null;

    // 현재위치 버튼 클릭 이벤트
    locationButton.addEventListener('click', () => {
      if (navigator.geolocation) {
        // 기존 위치 추적 중지
        if (watchId) {
          navigator.geolocation.clearWatch(watchId);
          watchId = null;
          return; // 토글 기능: 추적 중지
        }

        // 실시간 위치 추적 시작
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            const userLatLng = new window.naver.maps.LatLng(lat, lng);

            // 첫 번째 위치 설정 시 지도 중심 이동
            if (!currentLocationMarker) {
              mapInstance.setCenter(userLatLng);
              mapInstance.setZoom(15);

              // 마커 생성
              currentLocationMarker = new window.naver.maps.Marker({
                position: userLatLng,
                map: mapInstance,
                icon: {
                  content: '<img src="/icons/MeNow.svg" style="width: 36px; height: 36px;" />',
                  size: new window.naver.maps.Size(36, 36),
                  anchor: new window.naver.maps.Point(18, 18),
                },
              });
            } else {
              // 기존 마커 위치만 업데이트 (자연스러운 움직임)
              const currentPos = currentLocationMarker.getPosition() as naver.maps.LatLng;
              const newPos = userLatLng;

              // 부드러운 애니메이션으로 위치 업데이트
              const steps = 30; // 애니메이션 단계
              const duration = 1000; // 1초
              const stepDuration = duration / steps;

              let step = 0;
              const animate = () => {
                if (step >= steps || !currentLocationMarker) return;

                const lat = currentPos.lat() + (newPos.lat() - currentPos.lat()) * (step / steps);
                const lng = currentPos.lng() + (newPos.lng() - currentPos.lng()) * (step / steps);

                currentLocationMarker.setPosition(new window.naver.maps.LatLng(lat, lng));
                step++;

                setTimeout(animate, stepDuration);
              };

              animate();
            }
          },
          (error) => {
            alert('현재 위치를 찾을 수 없습니다.');
            console.error(error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
          },
        );
      } else {
        alert('현재 위치 기능을 지원하지 않는 브라우저입니다.');
      }
    });

    const clusterIcon = {
      content: `
        <div class="custom-cluster" style="
          position: relative; display: flex; align-items: center; justify-content: center;
        ">
          <img src="/icons/markerCluster.svg" style="width: 32px; height: 44px;" alt="cluster" />
          <span class="cluster-count" style="
            position: absolute; color: #480522; font-weight: bold; font-size: 0.9375rem; margin-top: -2px;
          "></span>
        </div>
      `,
      size: new window.naver.maps.Size(40, 40),
      anchor: new window.naver.maps.Point(20, 20),
    };

    if (window.MarkerClustering) {
      const clustererInstance = new window.MarkerClustering({
        minClusterSize: 2, // 2에서 5로 증가
        maxZoom: 30, // 15에서 12로 감소
        map: mapInstance,
        markers: [],
        disableClickZoom: false,
        gridSize: 100,
        icons: [clusterIcon],
        indexGenerator: [2, 5, 10],
        stylingFunction: function (clusterMarker: any, count: number) {
          const el = clusterMarker.getElement();
          const span = el?.querySelector('.cluster-count');
          if (span) span.textContent = String(count);
        },
      });
      setClusterer(clustererInstance);
    } else {
      console.error('MarkerClustering 라이브러리를 찾을 수 없습니다.');
    }

    setMap(mapInstance);
  }, [zoom, map]);

  // 2. clubs 데이터 변경 시 마커만 업데이트
  useEffect(() => {
    if (!map || !clusterer) return;

    // 기존 마커 클린업
    markerRefs.current.forEach(({ marker }) => marker.setMap(null));
    markerRefs.current = [];

    const validMarkers: naver.maps.Marker[] = [];
    const pendingGeocodes: Promise<naver.maps.Marker | null>[] = [];

    console.log(`🚀 Processing ${clubs.length} clubs, cache size: ${geocodeCache.current.size}`);

    clubs.forEach((club) => {
      if (!club.address) return;

      // 캐시에서 먼저 확인
      const cachedResult = geocodeCache.current.get(club.address);
      if (cachedResult) {
        console.log(`✅ Using cached result for: ${club.englishName}`);

        const position = new window.naver.maps.LatLng(cachedResult.lat, cachedResult.lng);
        const marker = new window.naver.maps.Marker({
          position,
          icon: {
            content: `
              <div style="background-color: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateY(-8px);">
                <div style="color: #FF4493; font-size: 0.75rem; font-weight: 500; white-space: nowrap; margin-bottom: -2px; pointer-events: none;">
                  ${club.englishName || ''}
                </div>
                <img src="/icons/naver_marker.svg" style="width: 24px; height: 32px;" alt="${club.englishName}" />
              </div>
            `,
            size: new window.naver.maps.Size(24, 40),
            anchor: new window.naver.maps.Point(12, 32),
          },
        });

        // 마커 클릭 이벤트 추가
        window.naver.maps.Event.addListener(marker, 'click', () => {
          setClickedClub({
            venue: club,
            isHeartbeat: club.isHeartbeat,
            tagList: club.tagList || [],
          });

          if (bottomSheetRef?.current) {
            bottomSheetRef.current.openWithSnap(2);
            setTimeout(() => {
              bottomSheetRef.current?.openWithSnap(1);
            }, 10);
          }
        });

        markerRefs.current.push({ club, marker });
        validMarkers.push(marker);
      } else {
        console.log(`🔄 Geocoding needed for: ${club.englishName}`);

        // 캐시에 없으면 API 호출 (비동기)
        const geocodePromise = new Promise<naver.maps.Marker | null>((resolve) => {
          window.naver.maps.Service.geocode({ query: club.address }, (status, response) => {
            if (status === window.naver.maps.Service.Status.OK && response?.v2?.addresses?.length > 0) {
              const { x, y } = response.v2.addresses[0];
              const position = new window.naver.maps.LatLng(+y, +x);

              // 결과를 캐시에 저장
              geocodeCache.current.set(club.address, { lat: +y, lng: +x });
              saveGeocodeCache(geocodeCache.current);
              console.log(`💾 Cached result for: ${club.englishName}`);

              const marker = new window.naver.maps.Marker({
                position,
                icon: {
                  content: `
                  <div style="background-color: transparent; display: flex; flex-direction: column; align-items: center; justify-content: center; transform: translateY(-8px);">
                    <div style="color: #FF4493; font-size: 0.75rem; font-weight: 500; white-space: nowrap; margin-bottom: -2px; pointer-events: none;">
                      ${club.englishName || ''}
                    </div>
                    <img src="/icons/naver_marker.svg" style="width: 24px; height: 32px;" alt="${club.englishName}" />
                  </div>
                `,
                  size: new window.naver.maps.Size(24, 40),
                  anchor: new window.naver.maps.Point(12, 32),
                },
              });

              // 마커 클릭 이벤트 추가
              window.naver.maps.Event.addListener(marker, 'click', () => {
                setClickedClub({
                  venue: club,
                  isHeartbeat: club.isHeartbeat,
                  tagList: club.tagList || [],
                });

                if (bottomSheetRef?.current) {
                  bottomSheetRef.current.openWithSnap(2);
                  setTimeout(() => {
                    bottomSheetRef.current?.openWithSnap(1);
                  }, 10);
                }
              });

              markerRefs.current.push({ club, marker });

              // 즉시 지도에 추가
              clusterer.addMarker(marker);
              resolve(marker);
            } else {
              resolve(null);
            }
          });
        });

        pendingGeocodes.push(geocodePromise);
      }
    });

    // 캐시된 마커들 즉시 표시
    if (validMarkers.length > 0) {
      console.log(`⚡ Immediately showing ${validMarkers.length} cached markers`);
      clusterer.setMarkers(validMarkers);

      // 지도 범위 조정
      const firstPos = validMarkers[0].getPosition() as naver.maps.LatLng;
      const bounds = new window.naver.maps.LatLngBounds(firstPos, firstPos);
      for (let i = 1; i < validMarkers.length; i++) {
        bounds.extend(validMarkers[i].getPosition());
      }
      map.fitBounds(bounds, { top: 100, right: 50, bottom: 100, left: 50 });
    }

    // 나머지 geocoding 결과들은 비동기로 처리
    if (pendingGeocodes.length > 0) {
      console.log(`⏳ Waiting for ${pendingGeocodes.length} geocoding requests`);
      Promise.all(pendingGeocodes).then((newMarkers) => {
        const additionalMarkers = newMarkers.filter((m): m is naver.maps.Marker => m !== null);
        console.log(`✨ Added ${additionalMarkers.length} new markers from geocoding`);
      });
    }
  }, [clubs, map, clusterer]);

  useImperativeHandle(ref, () => ({
    filterAddressesInView: async () => {
      const visibleClubs: Club[] = [];
      if (!map) return visibleClubs;

      const bounds = map.getBounds();
      markerRefs.current.forEach(({ club, marker }) => {
        const pos = marker.getPosition();
        if (bounds.hasPoint(pos)) {
          visibleClubs.push(club);
        }
      });
      return visibleClubs;
    },
  }));

  return (
    <>
      <div ref={mapRef} style={{ width, height, minHeight }} />
      <style jsx>{`
        :global(.naver-map-logo) {
          opacity: 0.3 !important;
          transform: scale(0.8) !important;
        }
        :global(.naver-map-logo:hover) {
          opacity: 0.6 !important;
        }
      `}</style>
    </>
  );
});

export default NaverMap;
