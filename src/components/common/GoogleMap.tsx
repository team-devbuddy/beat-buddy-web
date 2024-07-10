'use client';
import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapStyles } from '@/assets/map_styles/dark';

import { GoogleMapProps } from '@/lib/types';

const GoogleMap = ({ address, minHeight }: GoogleMapProps) => {

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

        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: address }, (results, status) => {
          if (status === 'OK' && results) {
            const map = new google.maps.Map(mapRef.current as HTMLDivElement, {
              center: results[0].geometry.location,
              zoom: 13,
              styles: MapStyles,
            });
            new google.maps.Marker({
              map: map,
              position: results[0].geometry.location,
            });
          } else {
            console.error(`Geocode was not successful for the following reason: ${status}`);
          }
        });
      })
      .catch((error) => {
        console.error('Error loading Google Maps JavaScript API', error);
      });
  }, [address]);


  return <div className={`rounded border border-gray400 p-2`} style={{ minHeight }} ref={mapRef} />;

};

export default GoogleMap;
