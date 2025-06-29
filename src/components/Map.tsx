import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Set Mapbox access token from environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface MapProps {
  center?: [number, number]; // [longitude, latitude]
  zoom?: number;
  style?: string;
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

export const Map: React.FC<MapProps> = ({
  center = [-74.5, 40], // Default to New York area
  zoom = 9,
  style = import.meta.env.VITE_MAPBOX_TILES_URL ||
    'mapbox://styles/mapbox/outdoors-v11',
  className = '',
  onMapLoad,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Check if access token is available
    if (
      !mapboxgl.accessToken ||
      mapboxgl.accessToken === 'your_mapbox_access_token_here'
    ) {
      setMapError(
        'Mapbox access token not configured. Please set VITE_MAPBOX_ACCESS_TOKEN in your .env file.'
      );
      return;
    }

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style,
        center,
        zoom,
        attributionControl: true,
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add geolocate control
      map.current.addControl(
        new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true,
          },
          trackUserLocation: true,
          showUserHeading: true,
        }),
        'top-right'
      );

      // Handle map load
      map.current.on('load', () => {
        if (onMapLoad && map.current) {
          onMapLoad(map.current);
        }
      });

      // Handle map errors
      map.current.on('error', e => {
        console.error('Mapbox error:', e);
        setMapError(
          'Failed to load map. Please check your internet connection.'
        );
      });
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map.');
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [center, zoom, style, onMapLoad]);

  if (mapError) {
    return (
      <div
        className={`flex items-center justify-center bg-background-secondary rounded-lg p-8 ${className}`}
      >
        <div className='text-center'>
          <div className='text-error mb-2'>
            <svg
              className='w-8 h-8 mx-auto'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
          <p className='text-text-primary'>{mapError}</p>
          <p className='text-sm text-text-secondary mt-2'>
            Please check your .env file and ensure VITE_MAPBOX_ACCESS_TOKEN is
            set correctly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={mapContainer}
      className={`w-full h-full min-h-[400px] rounded-lg ${className}`}
    />
  );
};

export default Map;
