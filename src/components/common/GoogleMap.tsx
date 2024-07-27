'use client';
import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapStyles } from '@/assets/map_styles/dark';
import { GoogleMapProps } from '@/lib/types';
import Image from 'next/image';

export type GoogleMapHandle = {
  getMap: () => google.maps.Map | null;
  getBounds: () => google.maps.LatLngBounds | null;
};

const GoogleMap = forwardRef<GoogleMapHandle, GoogleMapProps>(({ addresses, minHeight }, ref) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const MARKER_ICON_URL = '/icons/map_marker.svg';
  const CURRENT_LOCATION_MARKER_URL = '/icons/menow.svg';
  const CURRENT_LOCATION_BUTTON_URL = '/icons/currentLocation.png';
  const CURRENT_LOCATION_BUTTON_HOVER_URL = '/icons/currentLocationHover.png';

  useImperativeHandle(ref, () => ({
    getMap: () => map,
    getBounds: () => map?.getBounds() || null,
  }), [map]);

  useEffect(() => {
    console.log('CURRENT_LOCATION_BUTTON_URL:', CURRENT_LOCATION_BUTTON_URL);

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

        const mapInstance = new google.maps.Map(mapContainerRef.current as HTMLDivElement, {
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
                icon: MARKER_ICON_URL, // 커스텀 마커 URL
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
              icon: CURRENT_LOCATION_MARKER_URL, // 현위치 마커 URL
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
    <div className="relative" style={{ minHeight }}>
      <div className="absolute right-4 top-12 z-10 cursor-pointer" onClick={handleCurrentLocation}>
        <Image
          src={CURRENT_LOCATION_BUTTON_URL}
          alt="Current Location"
          width={40}
          height={40}
          className="current-location-button"
        />
      </div>
      <div ref={mapContainerRef} className="rounded border border-gray400 p-2" style={{ minHeight }} />
      <style jsx>{`
        .current-location-button {
          transition: opacity 0.3s;
        }
        .current-location-button:hover {
          content: url(${CURRENT_LOCATION_BUTTON_HOVER_URL});
        }
      `}</style>
    </div>
  );
});

GoogleMap.displayName = 'GoogleMap';

export default GoogleMap;
