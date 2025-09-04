'use client';

import { useEffect, useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Club } from '@/lib/types';
import { useRecoilState } from 'recoil';
import { clickedClubState } from '@/context/recoil-context';

export interface NaverMapHandle {
  filterAddressesInView: () => Promise<Club[]>;
  moveToCurrentLocation: () => Promise<{ lat: number; lng: number } | undefined>;
  getBounds: () => Promise<{ north: number; south: number; east: number; west: number } | null>;
}

interface NaverMapProps {
  clubs: Club[];
  width?: string;
  height?: string;
  minHeight?: string;
  zoom?: number;
  onAddressesInBounds?: (clubsInView: Club[]) => void;
  bottomSheetRef?: React.RefObject<any>;
  showLocationButton?: boolean;
  showZoomControl?: boolean;
  clickable?: boolean;
  visibleContainerRef?: React.RefObject<HTMLElement>;
  compensateCenter?: boolean;
  visibleHeight?: number; // 실제 보이는 높이 (px)
  visibleWidth?: number; // 실제 보이는 너비 (px)
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

/** Coord → LatLng 안전 변환 (TS/런타임 모두 안전) */
function toLatLng(coord: naver.maps.Coord): naver.maps.LatLng {
  if (coord instanceof (window as any).naver.maps.LatLng) return coord as naver.maps.LatLng;
  const anyCoord = coord as any;
  if (typeof anyCoord.toLatLng === 'function') return anyCoord.toLatLng();
  const x = typeof anyCoord.x === 'function' ? anyCoord.x() : anyCoord.x ?? anyCoord.lng ?? anyCoord.lon;
  const y = typeof anyCoord.y === 'function' ? anyCoord.y() : anyCoord.y ?? anyCoord.lat;
  return new window.naver.maps.LatLng(y, x);
}

/** ✅ 마커들을 적절한 위치에 맞추는 helper */
function fitMarkersToView(
  map: naver.maps.Map,
  markers: naver.maps.Marker[],
  compensateForViewport = false,
  visibleHeight?: number,
  visibleWidth?: number,
) {
  if (markers.length === 0) return;

  const leftPad = 40;
  const rightPad = 40;
  const topPad = 40;
  const bottomPad = compensateForViewport ? 40 : 40;

  if (markers.length === 1) {
    const pos = toLatLng(markers[0].getPosition());
    map.setCenter(pos);

    let z = map.getZoom();
    if (z < 13) z = 13;
    if (z > 16) z = 16;
    map.setZoom(z);

    // ✅ 작은 컨테이너에서 마커 위치 보정 (즉시 실행, 애니메이션 최소화)
    if (compensateForViewport && (visibleHeight || visibleWidth)) {
      // 지도 렌더링 완료 후 즉시 보정
      requestAnimationFrame(() => {
        const size = map.getSize();
        if (size.width > 0 && size.height > 0) {
          const mapCenterOffsetY = visibleHeight ? (size.height - visibleHeight) / 2 : 0;
          const mapCenterOffsetX = visibleWidth ? (size.width - visibleWidth) / 2 : 0;
          map.panBy(new window.naver.maps.Point(-mapCenterOffsetX, -mapCenterOffsetY));
        }
      });
    }
    return;
  }

  // 여러 마커 → bounds + 패딩
  const first = toLatLng(markers[0].getPosition());
  const b = new window.naver.maps.LatLngBounds(first, first);
  for (let i = 1; i < markers.length; i++) {
    b.extend(toLatLng(markers[i].getPosition()));
  }

  if (compensateForViewport) {
    // 작은 컨테이너에서는 하단 패딩을 크게 해서 마커들이 위쪽에 보이게
    const size = map.getSize();
    const adjustedBottomPad = Math.round(size.height * 0.8); // 더 크게 보정
    map.fitBounds(b, { top: topPad, right: rightPad, bottom: adjustedBottomPad, left: leftPad });
  } else {
    map.fitBounds(b, { top: topPad, right: rightPad, bottom: bottomPad, left: leftPad });
  }

  let z = map.getZoom();
  if (z < 11) z = 11;
  if (z > 17) z = 17;
  map.setZoom(z);
}

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(function NaverMap(
  {
    clubs,
    width = '100%',
    height = '100%',
    minHeight,
    zoom = 10,
    onAddressesInBounds,
    bottomSheetRef,
    showLocationButton = true,
    showZoomControl = true,
    clickable = true,
    visibleContainerRef,
    compensateCenter,
    visibleHeight,
    visibleWidth,
  },
  ref,
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [clusterer, setClusterer] = useState<any>(null);
  const markerRefs = useRef<{ club: Club; marker: naver.maps.Marker }[]>([]);
  const [clickedClub, setClickedClub] = useRecoilState(clickedClubState);
  const geocodeCache = useRef(getGeocodeCache());
  const currentLocationMarkerRef = useRef<naver.maps.Marker | null>(null);

  // 지도/클러스터러 초기화
  useEffect(() => {
    if (!mapRef.current || !window.naver?.maps || map) return;

    const mapInstance = new window.naver.maps.Map(mapRef.current, {
      gl: true,
      center: new window.naver.maps.LatLng(37.5666103, 126.9783882),
      zoom,
      customStyleId: '48547b93-96df-42da-9e2a-b0f277010e41',
      logoControl: false,
      scaleControl: false,
      mapDataControl: false,
      zoomControl: false,
    });

    if (window.MarkerClustering) {
      const clustererInstance = new window.MarkerClustering({
        minClusterSize: 2,
        maxZoom: 18, // 클러스터링이 풀리는 최대 줌 레벨
        map: mapInstance,
        markers: [],
        disableClickZoom: false,
        gridSize: 100,
        // 🎨 클러스터 아이콘 추가
        icons: [
          {
            content: `
              <div class="custom-cluster" style="position: relative; display: flex; align-items: center; justify-content: center;">
                <img src="/icons/Headers/markerCluster.svg" style="width: 3.125rem; height: 3.125rem;" alt="cluster" />
                <span class="cluster-count" style="position: absolute; color: #480522; font-weight: 700; font-size: 0.8125rem; margin-top: -2px; line-height: 1.25rem;"></span>
              </div>
            `,
            size: new window.naver.maps.Size(50, 50),
            anchor: new window.naver.maps.Point(25, 25),
          },
        ],
        // 🎨 클러스터 스타일링 함수
        stylingFunction: (clusterMarker: any, count: number) => {
          const el = clusterMarker.getElement();
          if (el) {
            const span = el.querySelector('span');
            if (span) span.textContent = String(count);
          }
        },
      });
      setClusterer(clustererInstance);
    }

    // 지도 로드 완료 이벤트 리스너 추가
    window.naver.maps.Event.addListener(mapInstance, 'tilesloaded', () => {
      // 지도 타일 로딩이 완료된 후 중앙 정렬 재실행
      if (compensateCenter && markerRefs.current.length > 0) {
        setTimeout(() => {
          const markers = markerRefs.current.map((ref) => ref.marker);
          fitMarkersToView(mapInstance, markers, compensateCenter, visibleHeight, visibleWidth);
        }, 200);
      }
    });

    setMap(mapInstance);

    // bounds → 부모 콜백
    if (onAddressesInBounds) {
      window.naver.maps.Event.addListener(mapInstance, 'bounds_changed', () => {
        const bounds = mapInstance.getBounds();
        const clubsInView: Club[] = [];
        markerRefs.current.forEach(({ club, marker }) => {
          if (bounds.hasPoint(marker.getPosition())) clubsInView.push(club);
        });
        onAddressesInBounds(clubsInView);
      });
    }
  }, [zoom, map, onAddressesInBounds]);

  // clubs 변경 → 마커 배치 + "윗쪽 표시"로 뷰 보정
  useEffect(() => {
    if (!map || !clusterer) return;

    // 기존 마커 제거
    markerRefs.current.forEach(({ marker }) => marker.setMap(null));
    markerRefs.current = [];
    if (clusterer.setMarkers) clusterer.setMarkers([]);

    const markers: naver.maps.Marker[] = [];
    const pending: Promise<void>[] = [];

    const addMarker = (club: Club, lat: number, lng: number) => {
      const marker = new window.naver.maps.Marker({
        position: new window.naver.maps.LatLng(lat, lng),
        icon: {
          content: `
            <div style="background: transparent; display: flex; flex-direction: column; align-items: center; transform: translateY(-8px);">
              <div style="color: #FF4493; font-size: 0.75rem; font-weight: 500; white-space: nowrap; margin-bottom: -2px;">
                ${club.englishName || ''}
              </div>
              <img src="/icons/naver_marker.svg" style="width:24px;height:32px;" alt="${club.englishName || ''}" />
            </div>
          `,
          size: new window.naver.maps.Size(24, 40),
          anchor: new window.naver.maps.Point(12, 32),
        },
      });

      window.naver.maps.Event.addListener(marker, 'click', () => {
        setClickedClub({
          venue: club,
          isHeartbeat: club.isHeartbeat || false,
          tagList: club.tagList || [],
        });
        bottomSheetRef?.current?.openWithSnap?.(1);
      });

      markerRefs.current.push({ club, marker });
      markers.push(marker);
    };

    clubs.forEach((club) => {
      if (club.latitude != null && club.longitude != null) {
        addMarker(club, club.latitude, club.longitude);
      } else if (club.address) {
        const cached = geocodeCache.current.get(club.address);
        if (cached) addMarker(club, cached.lat, cached.lng);
        else {
          pending.push(
            new Promise<void>((resolve) => {
              window.naver.maps.Service.geocode({ query: club.address! }, (status, res) => {
                if (status === window.naver.maps.Service.Status.OK && res?.v2?.addresses?.length) {
                  const { x, y } = res.v2.addresses[0];
                  geocodeCache.current.set(club.address!, { lat: +y, lng: +x });
                  saveGeocodeCache(geocodeCache.current);
                  addMarker(club, +y, +x);
                }
                resolve();
              });
            }),
          );
        }
      }
    });

    const flush = () => {
      // 클러스터러에 일괄 반영
      if (clusterer.setMarkers) clusterer.setMarkers(markers);

      // 지도가 완전히 로드된 후 안정적으로 실행
      setTimeout(() => {
        window.naver.maps.Event.trigger(map, 'resize');

        const stabilizeMap = () => {
          const size = map.getSize();
          if (size.width > 0 && size.height > 0) {
            // 뷰 보정: 마커들을 적절한 위치에 보이게
            fitMarkersToView(map, markers, compensateCenter, visibleHeight, visibleWidth);
          } else {
            // 지도가 아직 준비되지 않았으면 다시 시도
            setTimeout(stabilizeMap, 50);
          }
        };

        stabilizeMap();
      }, 100); // 클러스터러 설정 완료 대기
    };

    if (pending.length) Promise.all(pending).then(flush);
    else flush();
  }, [clubs, map, clusterer, bottomSheetRef, setClickedClub]);

  // 높이/너비 변경 시 지도 리사이즈
  useEffect(() => {
    if (!map) return;

    // 지도 리사이즈를 안정적으로 처리
    const handleResize = () => {
      window.naver.maps.Event.trigger(map, 'resize');
      const currentCenter = map.getCenter();
      if (currentCenter) {
        map.setCenter(currentCenter);

        // compensateCenter가 활성화된 경우 마커 위치 재조정
        if (compensateCenter && markerRefs.current.length > 0) {
          const markers = markerRefs.current.map((ref) => ref.marker);
          fitMarkersToView(map, markers, compensateCenter, visibleHeight, visibleWidth);
        }
      }
    };

    // 즉시 실행
    requestAnimationFrame(handleResize);
  }, [map, width, height, compensateCenter, visibleHeight, visibleWidth]);

  // 외부에 노출하는 ref 메서드
  useImperativeHandle(ref, () => ({
    filterAddressesInView: async () => {
      const visible: Club[] = [];
      if (!map) return visible;
      const bounds = map.getBounds();
      markerRefs.current.forEach(({ club, marker }) => {
        if (bounds.hasPoint(marker.getPosition())) visible.push(club);
      });
      return visible;
    },
    moveToCurrentLocation: async () => {
      if (!map) return;
      return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;
            const ll = new window.naver.maps.LatLng(lat, lng);

            if (!currentLocationMarkerRef.current) {
              currentLocationMarkerRef.current = new window.naver.maps.Marker({
                position: ll,
                map,
                icon: {
                  content: '<img src="/icons/menow.svg" style="width:36px;height:36px;" />',
                  size: new window.naver.maps.Size(36, 36),
                  anchor: new window.naver.maps.Point(18, 18),
                },
                zIndex: 1000,
              });
            } else {
              currentLocationMarkerRef.current.setPosition(ll);
            }

            map.setCenter(ll);
            if (map.getZoom() < 15) map.setZoom(15);

            resolve({ lat, lng });
          },
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000 },
        );
      });
    },
    getBounds: async () => {
      console.log('🔍 getBounds 호출됨, map 인스턴스:', map);
      if (!map) {
        console.log('❌ map 인스턴스가 null입니다');
        return null;
      }
      try {
        const b = map.getBounds() as naver.maps.LatLngBounds;
        console.log('🔍 map.getBounds() 결과:', b);
        const result = {
          north: b.getNE().lat(),
          east: b.getNE().lng(),
          south: b.getSW().lat(),
          west: b.getSW().lng(),
        };
        console.log('🔍 getBounds 최종 결과:', result);
        return result;
      } catch (error) {
        console.error('❌ getBounds 오류:', error);
        return null;
      }
    },
  }));

  return (
    <>
      <div ref={mapRef} style={{ width, height, minHeight, position: 'relative' }} />
      <style jsx>{`
        :global(.naver-map-logo) {
          opacity: 0.3 !important;
          transform: scale(0.8) !important;
        }
      `}</style>
    </>
  );
});

export default NaverMap;
