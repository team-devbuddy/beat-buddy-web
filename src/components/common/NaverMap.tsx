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
  { clubs, width = '100%', height = '500px', minHeight, zoom = 15, onAddressesInBounds },
  ref,
) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerRefs = useRef<{ club: Club; marker: any }[]>([]);
  const clustererRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || !window.naver?.maps) return;
    console.log('[DEBUG] clubs.length:', clubs.length);
    console.log('[DEBUG] clubs:', clubs);

    const defaultCenter = new window.naver.maps.LatLng(37.5666103, 126.9783882);

    const map = new window.naver.maps.Map(mapRef.current, {
      gl: true,
      center: defaultCenter,
      zoom,
      customStyleId: '48547b93-96df-42da-9e2a-b0f277010e41',
    });

    mapInstance.current = map;

    // ✅ 기존 마커 제거
    if (markerRefs.current.length > 0) {
      markerRefs.current.forEach(({ marker }) => marker.setMap(null));
      markerRefs.current = [];
    }

    const geocodePromises = clubs.map((club) => {
      return new Promise<void>((resolve) => {
        if (!club.address) return resolve();

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
              },
            });

            markerRefs.current.push({ club, marker });
          }

          resolve();
        });
      });
    });

    Promise.all(geocodePromises).then(() => {
      if (markerRefs.current.length > 0) {
        const bounds = new window.naver.maps.LatLngBounds(markerRefs.current[0].marker.getPosition());
        markerRefs.current.forEach(({ marker }) => {
          bounds.extend(marker.getPosition());
        });
        map.fitBounds(bounds);
      }

      if (clustererRef.current) {
        clustererRef.current.setMap(null);
        clustererRef.current = null;
      }

      const clusterIcon = {
        content: `
          <div class="custom-cluster" style="
            width: 40px;
            height: 40px;
            background-color: #FF4493;
            color: white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: bold;
            font-size: 14px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.15);
            pointer-events: none;
            position: relative;
          ">
            <span class="cluster-count"></span>
          </div>
        `,
        size: new window.naver.maps.Size(40, 40),
        anchor: new window.naver.maps.Point(20, 20),
      };

      if (window.MarkerClustering) {
        clustererRef.current = new window.MarkerClustering({
          minClusterSize: 2,
          maxZoom: 15,
          map: mapInstance.current,
          markers: markerRefs.current.map(({ marker }) => marker),
          disableClickZoom: false,
          gridSize: 100,
          icons: [clusterIcon],
          indexGenerator: [2, 5, 10, 20, 50, 100],
          stylingFunction: function (clusterMarker: any, count: number) {
            const el = clusterMarker.getElement();
            const span = el?.querySelector('.cluster-count');
            if (span) span.textContent = String(count);
          },
        });
      } else {
        console.error('MarkerClustering is not available');
      }
    });
  }, [clubs, zoom]);

  useImperativeHandle(ref, () => ({
    filterAddressesInView: async () => {
      const visibleClubs: Club[] = [];

      if (!mapInstance.current) return visibleClubs;

      const bounds = mapInstance.current.getBounds();
      markerRefs.current.forEach(({ club, marker }) => {
        const pos = marker.getPosition();
        if (bounds.hasPoint(pos)) {
          visibleClubs.push(club);
          marker.setMap(mapInstance.current);
        } else {
          marker.setMap(null);
        }
      });

      return visibleClubs;
    },
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
