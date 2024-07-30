'use client';
import { forwardRef, useImperativeHandle, useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapStyles } from '@/assets/map_styles/dark';
import Image from 'next/image';
import { Club } from '@/lib/types';
import { MarkerClusterer } from '@googlemaps/markerclusterer';
import { useRecoilState } from 'recoil';
import { clickedClubState } from '@/context/recoil-context';

interface GoogleMapProp {
  clubs: Club[];
  minHeight?: string;
  onAddressesInBounds?: (addresses: string[]) => void;
  zoom?: number;
}

const GoogleMap = forwardRef<{ filterAddressesInView: () => void }, GoogleMapProp>(
  ({ clubs, minHeight, onAddressesInBounds, zoom = 300 }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.Marker | null>(null);
    const [markerCluster, setMarkerCluster] = useState<MarkerClusterer | null>(null);
    const [clickedClub, setClickedClub] = useRecoilState(clickedClubState);

    const MARKER_ICON_URL = '/icons/map_marker.svg';
    const CURRENT_LOCATION_MARKER_URL = '/icons/menow.svg';
    const CURRENT_LOCATION_BUTTON_URL = '/icons/currentLocation.png';
    const CURRENT_LOCATION_BUTTON_HOVER_URL = '/icons/currentLocationHover.png';

    useImperativeHandle(ref, () => ({
      filterAddressesInView,
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
          text: club.englishName,
          color: '#FF4493',
          fontSize: '14px',
          fontWeight: 'bold',
          className: 'marker-label',
        },
      });

      marker.addListener('click', () => {
        setClickedClub({
          venue: club,
          isHeartbeat: false,
          tagList: club.tagList || [],
        });
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
              disableDefaultUI: true,
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
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
                      const color =
                        count > Math.max(5, stats.clusters.markers.mean)
                          ? "#EE1171"
                          : "#8F0B48";

                      return new google.maps.Marker({
                        position,
                        icon: {
                          url: createCustomClusterIcon(count, color),
                          scaledSize: new google.maps.Size(45, 45),
                        },
                        label: {
                          text: String(count),
                          color: "#fff",
                          fontSize: "12px",
                        },
                        zIndex: 1000 + count,
                      });
                    },
                  };

                  const markerClusterer = new MarkerClusterer({
                    map: mapInstance,
                    markers: markersArray,
                    renderer: customRenderer,
                  });

                  google.maps.event.addListener(markerClusterer, 'clusterclick', (cluster: { getBounds: () => google.maps.LatLngBounds | google.maps.LatLngBoundsLiteral; }) => {
                    mapInstance.fitBounds(cluster.getBounds());
                  });

                  mapInstance.addListener('click', () => {
                    setClickedClub(null);
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
    }, [clubs]);

    useEffect(() => {
      setClickedClub(null);
    }, [setClickedClub]);

    const handleCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map?.setCenter(pos);
            map?.setZoom(zoom);

            if (currentLocationMarker) {
              currentLocationMarker.setPosition(pos);
            } else {
              const marker = new google.maps.Marker({
                map: map,
                position: pos,
                icon: CURRENT_LOCATION_MARKER_URL,
              });
              setCurrentLocationMarker(marker);
            }
          },
          () => {
            console.error('Error: The Geolocation service failed.');
          },
        );
      } else {
        console.error("Error: Your browser doesn't support geolocation.");
      }
    };

    const filterAddressesInView = () => {
      if (map) {
        const bounds = map.getBounds();
        if (bounds) {
          // 초기화
          markerCluster?.clearMarkers();
          markers.forEach((marker) => marker.setMap(null));
          setMarkers([]);

          const newMarkers: google.maps.Marker[] = [];
          const geocodePromises: Promise<void>[] = clubs.map((club) => {
            return new Promise((resolve) => {
              const geocoder = new google.maps.Geocoder();
              geocoder.geocode({ address: club.address }, (results, status) => {
                if (status === 'OK' && results) {
                  const location = results[0].geometry.location;
                  if (bounds.contains(location)) {
                    const marker = createCustomMarker(club, location);
                    newMarkers.push(marker);
                  }
                }
                resolve();
              });
            });
          });

          Promise.all(geocodePromises).then(() => {
            newMarkers.forEach((marker) => marker.setMap(map));

            const customRenderer = {
              render: ({ count, position }: any, stats: any, map: any) => {
                const color =
                  count > Math.max(5, stats.clusters.markers.mean)
                    ? "#EE1171"
                    : "#8F0B48";

                return new google.maps.Marker({
                  position,
                  icon: {
                    url: createCustomClusterIcon(count, color),
                    scaledSize: new google.maps.Size(45, 45),
                  },
                  label: {
                    text: String(count),
                    color: "#fff",
                    fontSize: "12px",
                  },
                  zIndex: 1000 + count,
                });
              },
            };

            const newMarkerClusterer = new MarkerClusterer({
              map: map,
              markers: newMarkers,
              renderer: customRenderer,
            });

            setMarkers(newMarkers);
            setMarkerCluster(newMarkerClusterer);
          });
        }
      }
    };
    
    return (
      <div className="relative">
        <div className="absolute right-4 top-12 z-10 cursor-pointer" onClick={handleCurrentLocation}>
          <Image
            src={CURRENT_LOCATION_BUTTON_URL}
            alt="Current Location"
            width={40}
            height={40}
            className="current-location-button"
          />
        </div>
        <div className={`p-2`} style={{ minHeight }} ref={mapRef} />
        <style jsx>{`
          .current-location-button {
            transition: opacity 0.3s;
          }
          .current-location-button:hover {
            content: url(${CURRENT_LOCATION_BUTTON_HOVER_URL});
          }
          .marker-label {
            color: #ff4493;
            font-size: 14px;
            font-weight: bold;
            background: transparent;
            white-space: nowrap;
          }
          .gmnoprint,
          .gm-bundled-control {
            display: none !important;
          }
        `}</style>

      </div>
    );
  },
);

export default GoogleMap;
