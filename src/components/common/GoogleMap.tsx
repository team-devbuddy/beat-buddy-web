'use client';
import { forwardRef, useImperativeHandle, useEffect, useRef, useState, SetStateAction } from 'react';
import { Loader } from '@googlemaps/js-api-loader';
import { MapStyles } from '@/assets/map_styles/dark';
import Image from 'next/image';

interface GoogleMapProp {
  addresses: string[];
  minHeight?: string;
  onAddressesInBounds?: (addresses: string[]) => void;
}

const GoogleMap = forwardRef<{ filterAddressesInView: () => void }, GoogleMapProp>(
  ({ addresses, minHeight, onAddressesInBounds }, ref) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
    const [currentLocationMarker, setCurrentLocationMarker] = useState<google.maps.Marker | null>(null);

    const MARKER_ICON_URL = '/icons/map_marker.svg';
    const CURRENT_LOCATION_MARKER_URL = '/icons/menow.svg';
    const CURRENT_LOCATION_BUTTON_URL = '/icons/currentLocation.png';
    const CURRENT_LOCATION_BUTTON_HOVER_URL = '/icons/currentLocationHover.png';

    useImperativeHandle(ref, () => ({
      filterAddressesInView,
    }));

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

            addresses.forEach((address) => {
              geocodeOperations++;
              geocoder.geocode({ address }, (results, status) => {
                if (status === 'OK' && results) {
                  const location = results[0].geometry.location;
                  initialBounds.extend(location);
                  const marker = new google.maps.Marker({
                    map: mapInstance,
                    position: location,
                    icon: MARKER_ICON_URL,
                  });
                  markers.push(marker);
                }
                geocodeOperations--;
                if (geocodeOperations === 0) {
                  mapInstance.fitBounds(initialBounds);
                }
              });
            });
          }
        })
        .catch((error) => {
          console.error('Error loading Google Maps JavaScript API', error);
        });

      return () => markers.forEach((marker) => marker.setMap(null)); // Cleanup markers
    }, [addresses]);

    const handleCurrentLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map?.setCenter(pos);
            map?.setZoom(15);

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
          // Remove all markers
          markers.forEach((marker) => marker.setMap(null));
          setMarkers([]);

          const newMarkers: google.maps.Marker[] = []; // 여기를 변경
          addresses.forEach((address) => {
            const geocoder = new google.maps.Geocoder();
            geocoder.geocode({ address }, (results, status) => {
              if (status === 'OK' && results) {
                const location = results[0].geometry.location;
                if (bounds.contains(location)) {
                  const marker = new google.maps.Marker({
                    map,
                    position: location,
                    icon: MARKER_ICON_URL,
                  });
                  newMarkers.push(marker);
                }
              }
            });
          });
          setMarkers(newMarkers);
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
        <div className={`rounded border border-gray400 p-2`} style={{ minHeight }} ref={mapRef} />
        <style jsx>{`
          .current-location-button {
            transition: opacity 0.3s;
          }
          .current-location-button:hover {
            content: url(${CURRENT_LOCATION_BUTTON_HOVER_URL});
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
