'use client';
import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapStyles } from '../../assets/map_styles/dark';
import { Club } from '@/lib/types';
import { MarkerClusterer, SuperClusterAlgorithm } from '@googlemaps/markerclusterer';
import { useRecoilState } from 'recoil';
import { clickedClubState } from '@/context/recoil-context';
import CurrentLocationButton from '../units/Search/Map/CurrentLocationButton';
import { BottomSheetRef } from '@/components/units/Search/Map/BottomSheet';
interface GoogleMapProp {
  clubs: Club[];
  minHeight?: string;
  onAddressesInBounds?: (clubs: Club[]) => void;
  zoom?: number;
  bottomSheetRef?: React.RefObject<BottomSheetRef>;
}

const GoogleMap = forwardRef<{ filterAddressesInView: () => Promise<Club[]> }, GoogleMapProp>(
  ({ clubs, minHeight, onAddressesInBounds, zoom, bottomSheetRef }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [markerCluster, setMarkerCluster] = useState<MarkerClusterer | null>(null);
    const [clickedClub, setClickedClub] = useRecoilState(clickedClubState);
    const [visibleClubs, setVisibleClubs] = useState<Club[]>([]);

    const MARKER_ICON_URL = '/icons/map_marker.svg';

    useImperativeHandle(ref, () => ({
      filterAddressesInView: async () => {
        if (!map) return [];

        const bounds = map.getBounds();
        if (!bounds) return [];

        // 초기화
        markerCluster?.clearMarkers();
        markers.forEach((marker) => marker.setMap(null));
        setMarkers([]);

        const newMarkers: google.maps.Marker[] = [];
        const clubsInBounds: Club[] = [];

        const geocodePromises: Promise<void>[] = clubs.map((club) => {
          return new Promise((resolve) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address: club.address }, (results, status) => {
              if (status === 'OK' && results) {
                const location = results[0].geometry.location;
                if (bounds.contains(location)) {
                  const marker = createCustomMarker(club, location);
                  newMarkers.push(marker);
                  clubsInBounds.push(club);
                }
              }
              resolve();
            });
          });
        });

        await Promise.all(geocodePromises);

        newMarkers.forEach((marker) => marker.setMap(map));

        const customRenderer = {
          render: ({ count, position }: any, stats: any, map: any) => {
            const color = count > Math.max(5, stats.clusters.markers.mean) ? '#EE1171' : '#8F0B48';
            return new google.maps.Marker({
              position,
              icon: {
                url: createCustomClusterIcon(count, color),
                scaledSize: new google.maps.Size(45, 45),
              },
              label: {
                text: String(count),
                color: '#fff',
                fontSize: '12px',
              },
              zIndex: 1000 + count,
            });
          },
        };

        const newMarkerClusterer = new MarkerClusterer({
          map: map,
          markers: newMarkers,
          renderer: customRenderer,
          algorithm: new SuperClusterAlgorithm({ radius: 120, maxZoom: 30 }),
        });

        setMarkers(newMarkers);
        setMarkerCluster(newMarkerClusterer);

        // 콜백 호출 및 필터링된 클럽들 반환
        onAddressesInBounds?.(clubsInBounds);
        return clubsInBounds;
      },
    }));

    const createCustomMarker = (club: Club, position: google.maps.LatLng) => {
      const marker = new google.maps.Marker({
        position,
        icon: {
          url: MARKER_ICON_URL,
          scaledSize: new google.maps.Size(24, 24),
          labelOrigin: new google.maps.Point(12, -10),
        },
        label: {
          text: club.englishName || club.koreanName,
          color: '#FF4493',
          fontSize: '14px',
          fontWeight: 'bold',
          className: 'marker-label',
        },
      });

      marker.addListener('click', () => {
        // 클릭된 클럽 상태 업데이트 (Recoil)
        setClickedClub({
          venue: club,
          isHeartbeat: club.isHeartbeat || false,
          tagList: club.tagList || [],
        });

        // 바텀시트를 강제로 올리기
        if (bottomSheetRef?.current) {
          // 먼저 바텀시트를 초기화(제일 낮은 위치)
          bottomSheetRef.current.openWithSnap(2);

          // 약간의 딜레이 후 원하는 위치로 올리기
          setTimeout(() => {
            bottomSheetRef.current?.openWithSnap(1);
          }, 10);
        }
      });
      return marker;
    };

    const createCustomClusterIcon = (count: number, color: string) => {
      const svg = window.btoa(`
        <svg fill="${color}" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 240">
          <circle cx="120" cy="120" opacity="1" r="70" />
          <circle cx="120" cy="120" opacity=".5" r="90" />
        </svg>`);

      return `data:image/svg+xml;base64,${svg}`;
    };

    useEffect(() => {
      const loader = new Loader({
        apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
        version: 'weekly',
      });

      loader
        .load()
        .then(() => {
          const initialBounds = new google.maps.LatLngBounds();
          const geocoder = new google.maps.Geocoder();

          if (mapRef.current) {
            const mapInstance = new google.maps.Map(mapRef.current, {
              styles: MapStyles,
              disableDefaultUI: false,
              zoom,
              zoomControl: true,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
              maxZoom: zoom || null,
              gestureHandling: 'greedy',
            });

            setMap(mapInstance);
            let geocodeOperations = 0;
            const markersArray: google.maps.Marker[] = [];

            clubs.forEach((club) => {
              geocodeOperations++;
              geocoder.geocode({ address: club.address }, (results, status) => {
                if (status === 'OK' && results) {
                  const location = results[0].geometry.location;
                  initialBounds.extend(location);
                  const marker = createCustomMarker(club, location);
                  markersArray.push(marker);
                  marker.setMap(mapInstance);
                }
                geocodeOperations--;
                if (geocodeOperations === 0) {
                  mapInstance.fitBounds(initialBounds);
                  const customRenderer = {
                    render: ({ count, position }: any, stats: any, map: any) => {
                      const color = count > Math.max(5, stats.clusters.markers.mean) ? '#EE1171' : '#8F0B48';

                      return new google.maps.Marker({
                        position,
                        icon: {
                          url: createCustomClusterIcon(count, color),
                          scaledSize: new google.maps.Size(45, 45),
                        },
                        label: {
                          text: String(count),
                          color: '#fff',
                          fontSize: '12px',
                        },
                        zIndex: 1000 + count,
                      });
                    },
                  };

                  const markerClusterer = new MarkerClusterer({
                    map: mapInstance,
                    markers: markersArray,
                    renderer: customRenderer,
                    algorithm: new SuperClusterAlgorithm({ radius: 120, maxZoom: 30 }),
                  });

                  google.maps.event.addListener(
                    markerClusterer,
                    'clusterclick',
                    (cluster: { getBounds: () => google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral }) => {
                      mapInstance.fitBounds(cluster.getBounds());
                    },
                  );

                  mapInstance.addListener('click', (event: google.maps.MapMouseEvent) => {
                    if (event.latLng) {
                      setClickedClub(null);
                    }
                  });

                  setMarkerCluster(markerClusterer);
                }
              });
            });
          }
        })
        .catch((error) => {
          console.error('Error loading Google Maps JavaScript API', error);
        });

      return () => {
        markers.forEach((marker) => marker.setMap(null));
        markerCluster?.clearMarkers();
      };
    }, [clubs, zoom]);

    useEffect(() => {
      setClickedClub(null);
    }, [setClickedClub]);

    const handleCurrentLocationClick = () => {
      if (navigator.geolocation && map) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            map.setCenter(pos);
            new google.maps.Marker({
              icon: '/icons/CurrentMe.svg',
              position: pos,
              map,
              title: 'Current Location',
            });
          },
          () => {},
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
      }
    };

    return (
      <div className="relative">
        <div className={`p-2`} style={{ minHeight }} ref={mapRef} />
        {map && <CurrentLocationButton onClick={handleCurrentLocationClick} />}
        <style jsx>{`
          .marker-label {
            color: #ff4493;
            font-size: 14px;
            font-weight: bold;
            background: transparent;
            white-space: nowrap;
          }
          .gmnoprint,
          .gm-bundled-control {
            /* display: none !important; */
          }
          div:focus {
            outline: none !important; /* 클릭 시 파란색 border 제거 */
            -webkit-tap-highlight-color: transparent; /* 사파리 하이라이트 제거 */
          }
          .gm-style img {
            max-width: none !important;
          }
          [data-obj] {
            outline: none !important;
          }
        `}</style>
      </div>
    );
  },
);

export default GoogleMap;
