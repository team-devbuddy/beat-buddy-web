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

/** ✅ 마커들을 화면 윗쪽에 오도록 맞추는 helper */
function fitMarkersUpperArea(map: naver.maps.Map, markers: naver.maps.Marker[]) {
  if (markers.length === 0) return;

  const size = map.getSize();
  const leftPad = 40;
  const rightPad = 40;
  const topPad = 40;
  const bottomPad = Math.round(size.height * 0.45); // 하단 비우기

  if (markers.length === 1) {
    const pos = toLatLng(markers[0].getPosition());
    map.setCenter(pos);

    let z = map.getZoom();
    if (z < 13) z = 13;
    if (z > 16) z = 16;
    map.setZoom(z);

    // ✅ setCenter 후, panBy는 "처음 렌더"일 때만 실행
    setTimeout(() => {
      map.panBy(new window.naver.maps.Point(0, Math.round(size.height * 0.22)));
    }, 100);
    return;
  }

  // 여러 마커 → bounds + 패딩
  const first = toLatLng(markers[0].getPosition());
  const b = new window.naver.maps.LatLngBounds(first, first);
  for (let i = 1; i < markers.length; i++) {
    b.extend(toLatLng(markers[i].getPosition()));
  }

  map.fitBounds(b, { top: topPad, right: rightPad, bottom: bottomPad, left: leftPad });

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

    if ((window as any).MarkerClustering) {
      const clustererInstance = new (window as any).MarkerClustering({
        minClusterSize: 2,
        maxZoom: 30,
        map: mapInstance,
        markers: [],
        disableClickZoom: false,
        gridSize: 100,
      });
      setClusterer(clustererInstance);
    }

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
      // 뷰 보정: 마커를 화면 윗쪽에 보이게
      fitMarkersUpperArea(map, markers);

      // 초기 렌더링 누락 방지
      window.requestAnimationFrame(() => {
        window.naver.maps.Event.trigger(map, 'resize');
        map.setCenter(map.getCenter());
      });
    };

    if (pending.length) Promise.all(pending).then(flush);
    else flush();
  }, [clubs, map, clusterer, bottomSheetRef, setClickedClub]);

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
                  content: '<img src="/icons/MeNow.svg" style="width:36px;height:36px;" />',
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

            // 현재 위치도 윗쪽에 보이게 살짝 보정
            const size = map.getSize();
            map.panBy(new window.naver.maps.Point(0, Math.round(size.height * 0.18)));

            resolve({ lat, lng });
          },
          (err) => reject(err),
          { enableHighAccuracy: true, timeout: 10000 },
        );
      });
    },
    getBounds: async () => {
      if (!map) return null;
      const b = map.getBounds() as naver.maps.LatLngBounds;
      return {
        north: b.getNE().lat(),
        east: b.getNE().lng(),
        south: b.getSW().lat(),
        west: b.getSW().lng(),
      };
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
