'use client';

import { useEffect, useImperativeHandle, useRef, forwardRef, useState } from 'react';
import { Club } from '@/lib/types';

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

const NaverMap = forwardRef<NaverMapHandle, NaverMapProps>(function NaverMap(
  { clubs, width = '100%', height = '100%', minHeight, zoom = 15, onAddressesInBounds },
  ref,
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<naver.maps.Map | null>(null);
  const [clusterer, setClusterer] = useState<any>(null);
  const markerRefs = useRef<{ club: Club; marker: naver.maps.Marker }[]>([]);

  // 1. 지도와 클러스터러 초기화 (최초 한 번만 실행)
  useEffect(() => {
    if (!mapRef.current || !window.naver?.maps || map) return;

    const mapInstance = new window.naver.maps.Map(mapRef.current, {
      gl: true,
      center: new window.naver.maps.LatLng(37.5666103, 126.9783882),
      zoom,
      customStyleId: '48547b93-96df-42da-9e2a-b0f277010e41',
      logoControl: true,
      logoControlOptions: {
        position: window.naver.maps.Position.BOTTOM_LEFT,
      },
    });

    const clusterIcon = {
      content: `
        <div class="custom-cluster" style="
          width: 40px; height: 40px; background-color: #FF4493; color: white;
          border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 14px; box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        ">
          <span class="cluster-count"></span>
        </div>
      `,
      size: new window.naver.maps.Size(40, 40),
      anchor: new window.naver.maps.Point(20, 20),
    };

    if (window.MarkerClustering) {
      const clustererInstance = new window.MarkerClustering({
        minClusterSize: 2,
        maxZoom: 15,
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

    const geocodePromises = clubs.map((club) => {
      return new Promise<naver.maps.Marker | null>((resolve) => {
        if (!club.address) return resolve(null);
        window.naver.maps.Service.geocode({ query: club.address }, (status, response) => {
          if (status === window.naver.maps.Service.Status.OK && response?.v2?.addresses?.length > 0) {
            const { x, y } = response.v2.addresses[0];
            const position = new window.naver.maps.LatLng(+y, +x);
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
            markerRefs.current.push({ club, marker });
            resolve(marker);
          } else {
            resolve(null);
          }
        });
      });
    });

    Promise.all(geocodePromises).then((newMarkers) => {
      const validMarkers = newMarkers.filter((m): m is naver.maps.Marker => m !== null) as naver.maps.Marker[];

      clusterer.setMarkers(validMarkers);

      if (validMarkers.length > 0) {
        const firstPos = validMarkers[0].getPosition() as naver.maps.LatLng;
        const bounds = new window.naver.maps.LatLngBounds(firstPos, firstPos);
        for (let i = 1; i < validMarkers.length; i++) {
          bounds.extend(validMarkers[i].getPosition());
        }
        map.fitBounds(bounds, { top: 100, right: 50, bottom: 100, left: 50 });
      }
    });
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

  return <div ref={mapRef} style={{ width, height, minHeight }} />;
});

export default NaverMap;
