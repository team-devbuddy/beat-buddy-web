'use client';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapStyles } from '@/assets/map_styles/dark';
import { GoogleMapProps } from '@/lib/types';

const GoogleMap = ({ addresses, minHeight }: GoogleMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);

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

        const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
          center: { lat: 37.5665, lng: 126.978 }, // 기본 중심 좌표 (서울 시청)
          zoom: 13,
          styles: MapStyles,
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        });

        const geocoder = new google.maps.Geocoder();
        const bounds = new google.maps.LatLngBounds();

        addresses.forEach((address) => {
          geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK' && results) {
              const location = results[0].geometry.location;
              new google.maps.Marker({
                map: map,
                position: location,
                icon: '/icons/map_marker.svg', // 커스텀 마커 URL
              });
              bounds.extend(location);
              map.fitBounds(bounds);
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

  return <div className={`rounded border border-gray400 p-2`} style={{ minHeight }} ref={mapRef} />;
};

export default GoogleMap;
