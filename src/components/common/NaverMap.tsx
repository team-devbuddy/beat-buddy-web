'use client';

import { useEffect, useImperativeHandle, useRef, forwardRef } from 'react';
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
  {
    clubs,
    width = '100%',
    height = '500px',
    minHeight,
    zoom = 15,
    onAddressesInBounds,
  },
  ref
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRefs = useRef<{ club: Club; marker: any }[]>([]);

  // 지도 생성
  useEffect(() => {
    if (!mapRef.current || !window.naver?.maps) return;

    const defaultCenter = new window.naver.maps.LatLng(37.5666103, 126.9783882);

    const map = new window.naver.maps.Map(mapRef.current, {
      gl: true,
      center: defaultCenter,
      zoom,
      customStyleId: '48547b93-96df-42da-9e2a-b0f277010e41',
    });

    mapInstance.current = map;

    markerRefs.current = [];

    clubs.forEach((club, index) => {
      if (!club.address) return;
      if (
        !window.naver?.maps?.Service?.geocode ||
        typeof window.naver.maps.Service.geocode !== 'function'
      ) {
        console.error('Naver Maps geocode API not available yet');
        return;
      }
      window.naver.maps.Service.geocode({ query: club.address }, (status, response) => {
        if (status === window.naver.maps.Service.Status.OK && response?.v2?.addresses?.length > 0) {

          const { x, y } = response.v2.addresses[0];
          const position = new window.naver.maps.LatLng(+y, +x);
        
          const marker = new window.naver.maps.Marker({
            position,
            map,
            icon: {
              content: `
                <div style="
                  display: flex;
                  flex-direction: column;
                  align-items: center;
                  justify-content: center;
                  transform: translateY(-8px);
                ">
                  <div style="
                    background: transparent;
                    color: #FF4493;
                    font-size: 0.75rem;
                    font-weight: 500;
                    white-space: nowrap;
                    z-index: 9999;
                    margin-bottom: -2px;
                    pointer-events: none;
                  ">
                    ${club.englishName}
                  </div>
                  <img src="/icons/naver_marker.svg" style="width: 24px; height: 32px;" />
                </div>
              `,
              size: new window.naver.maps.Size(24, 40),
              anchor: new window.naver.maps.Point(12, 32),
            }
          });
          
          
          
          
          markerRefs.current.push({ club, marker });
        
          if (index === 0) {
            map.setCenter(position);
          }

          if (markerRefs.current.length > 0) {
            const bounds = new window.naver.maps.LatLngBounds(
              new window.naver.maps.LatLng(37.5666103, 126.9783882),
              new window.naver.maps.LatLng(37.5666103, 126.9783882)
            );
            markerRefs.current.forEach(({ marker }) => {
              bounds.extend(marker.getPosition());
            });
            map.fitBounds(bounds); // OK
          }
        }
      });
    });
  }, [clubs, zoom]);

  // 외부에서 호출 가능한 함수
  useImperativeHandle(ref, () => ({
    filterAddressesInView: async () => {
      const visibleClubs: Club[] = [];
    
      if (!mapInstance.current) return visibleClubs;
    
      const bounds = mapInstance.current.getBounds();
      markerRefs.current.forEach(({ club, marker }) => {
        const pos = marker.getPosition();
        if (bounds.hasPoint(pos)) {
          visibleClubs.push(club);
          marker.setMap(mapInstance.current); // 다시 표시
        } else {
          marker.setMap(null); // 화면 밖이면 숨김
        }
      });
    
      return visibleClubs;
    }
  }));

  return (
    <div
      ref={mapRef}
      style={{
        width,
        height,
        minHeight,
      }}
    />
  );
});

export default NaverMap;
