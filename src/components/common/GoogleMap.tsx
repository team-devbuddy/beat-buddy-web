'use client';
import { useEffect, useRef, useState } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapStyles } from '@/assets/map_styles/dark';
import { GoogleMapProps } from '@/lib/types';

const GoogleMap = ({ addresses, minHeight }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  useEffect(() => {
    const loader = new Loader({
      apiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string,
      version: 'weekly',
    });

    loader
      .load()
      .then(() => {
        if (!google || !google.maps) {
          console.error('Google Maps JavaScript API not loaded correctly');
          return;
        }

        const mapInstance = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center: { lat: 37.5665, lng: 126.978 }, // 기본 중심 좌표 (서울 시청)
          zoom: 13,
          styles: MapStyles,
          disableDefaultUI: true,
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });

        setMap(mapInstance);

        const geocoder = new google.maps.Geocoder();
        const bounds = new google.maps.LatLngBounds();

        addresses.forEach((address) => {
          geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results) {
              const location = results[0].geometry.location;
              new google.maps.Marker({
                map: mapInstance,
                position: location,
                icon: '/icons/map_marker.svg', // 커스텀 마커 URL
              });
              bounds.extend(location);
              mapInstance.fitBounds(bounds);
            } else {
              console.error(`Geocode was not successful for the following reason: ${status}`);
            }
          });
        });
      })
      .catch((error) => {
        console.error('Error loading Google Maps JavaScript API', error);
      });
  }, [addresses]);

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          if (map) {
            map.setCenter(pos);
            new google.maps.Marker({
              map: map,
              position: pos,
              icon: '/icons/map_marker.svg', // 현위치 마커 URL
            });
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

  return (
    <div className="relative">
      <div
        className="absolute right-4 top-4 z-10 cursor-pointer rounded bg-white p-2 shadow-md"
        onClick={handleCurrentLocation}>
        현위치에서 검색
      </div>
      <div className={`rounded border border-gray400 p-2`} style={{ minHeight }} ref={mapRef} />
    </div>
  );
};

export default GoogleMap;
