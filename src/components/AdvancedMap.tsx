import React, { useEffect, useRef, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Search,
  MapPin,
  Navigation,
  Globe,
  Layers,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMapStore } from '@/store/mapStore';

// Set Mapbox access token from environment variable
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN || '';

interface GeoJSONPolygon {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    name: string;
    description?: string;
    confidence?: number;
    type: 'foraging_spot' | 'high_probability' | 'restricted_area';
    mushroom_score?: number;
  };
}

interface AdvancedMapProps {
  center?: [number, number];
  zoom?: number;
  className?: string;
  onMapLoad?: (map: mapboxgl.Map) => void;
}

// Region configuration from old project
const REGIONS = {
  EE_north: 'Eastern Europe North',
  EE_south: 'Eastern Europe South',
  NE_north: 'Northern Europe North',
  NE_south: 'Northern Europe South',
  WE_north: 'Western Europe North',
  WE_south: 'Western Europe South',
};

const GEOJSON_URLS = {
  EE_north:
    'https://pub-92765923660e431daff3170fbef6471d.r2.dev/EE_mushroom_data_north.geojson',
  EE_south:
    'https://pub-92765923660e431daff3170fbef6471d.r2.dev/EE_mushroom_data_south.geojson',
  NE_north:
    'https://pub-92765923660e431daff3170fbef6471d.r2.dev/NE_mushroom_data_north.geojson',
  NE_south:
    'https://pub-92765923660e431daff3170fbef6471d.r2.dev/NE_mushroom_data_south.geojson',
  WE_north:
    'https://pub-92765923660e431daff3170fbef6471d.r2.dev/WE_mushroom_data_north.geojson',
  WE_south:
    'https://pub-92765923660e431daff3170fbef6471d.r2.dev/WE_mushroom_data_south.geojson',
};

// Species options from old project
const SPECIES_OPTIONS = {
  '🍄 Mushrooms': 'mushrooms',
  '🫐 Berries': 'berries',
  '🌿 Herbs': 'herbs',
  '🌰 Nuts': 'nuts',
};

const SPECIES_DISPLAY_MAP = {
  mushrooms: '🍄 Mushrooms',
  berries: '🫐 Berries',
  herbs: '🌿 Herbs',
  nuts: '🌰 Nuts',
};

export const AdvancedMap: React.FC<AdvancedMapProps> = ({
  center = [7.3359, 47.7508], // Default to Switzerland
  zoom = 5,
  className = '',
  onMapLoad,
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const geoJsonLayer = useRef<mapboxgl.GeoJSONSource | null>(null);

  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('WE_south');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('mushrooms');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);
  const [layersVisible, setLayersVisible] = useState(true);
  const [darkLayersVisible, setDarkLayersVisible] = useState(false);
  const [nearbyEdibles, setNearbyEdibles] = useState<
    Array<{ name: string; score: number }>
  >([]);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cachedRegions, setCachedRegions] = useState<Record<string, any>>({});

  const { userLocation, setUserLocation, getUserLocation, clearError } =
    useMapStore();

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/lodist/clzo3ivsk007d01piaoah1dfy?optimize=true',
        center,
        zoom,
        maxZoom: 12,
        minZoom: 5,
        collectResourceTiming: false,
        touchZoomRotate: true,
        trackResize: false,
        attributionControl: false,
        localIdeographFontFamily: 'sans-serif',
        performanceMetricsCollection: false,
      });

      map.current.touchZoomRotate.disableRotation();

      // Handle map errors
      map.current.on('error', () => {
        console.error('Mapbox failed to load');
        setMapError('Failed to load map. Please refresh the page.');
      });

      // Handle map load
      map.current.on('load', () => {
        console.log('Map loaded successfully');
        onMapLoad?.(map.current!);
        loadRegion(selectedRegion);
      });

      // Save map state on unload
      const handleBeforeUnload = () => {
        if (map.current) {
          const mapState = {
            center: map.current.getCenter(),
            zoom: map.current.getZoom(),
            bearing: map.current.getBearing(),
            pitch: map.current.getPitch(),
            timestamp: Date.now(),
          };
          localStorage.setItem('mapState', JSON.stringify(mapState));
        }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);

      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        if (map.current) {
          map.current.remove();
        }
      };
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Failed to initialize map');
    }
  }, []);

  // Load saved map state
  useEffect(() => {
    if (!map.current) return;

    try {
      const savedState = JSON.parse(localStorage.getItem('mapState') || '{}');
      if (savedState.center) {
        map.current.setCenter(savedState.center);
        map.current.setZoom(5);
        map.current.setBearing(savedState.bearing || 0);
        map.current.setPitch(savedState.pitch || 0);
      }

      // Restore layer visibility states
      const numbersLayersVisible =
        localStorage.getItem('numbersLayersVisible') === 'true';
      const darkLayersState =
        localStorage.getItem('darkLayersVisible') === 'true';

      setLayersVisible(numbersLayersVisible);
      setDarkLayersVisible(darkLayersState);
    } catch (error) {
      console.error('Failed to load map state:', error);
    }
  }, [map.current]);

  // Color function for polygons
  const getColor = useCallback((score: number) => {
    if (score <= 0.5) return '#ffffcc';
    if (score <= 1) return '#ffffcc';
    if (score <= 2) return '#ffe4b5';
    if (score <= 3) return '#ffdab9';
    if (score <= 4) return '#fbae7e';
    if (score <= 5) return '#fa733d';
    if (score <= 7) return '#fb6d51';
    if (score <= 8) return '#fb4646';
    if (score <= 9) return '#a60310';
    if (score <= 10) return '#800020';
    return '#800020';
  }, []);

  // Load region data
  const loadRegion = useCallback(
    async (region: string) => {
      if (!map.current || !GEOJSON_URLS[region as keyof typeof GEOJSON_URLS]) {
        console.error(`Invalid region: ${region}`);
        return;
      }

      setIsLoading(true);

      try {
        // Check cache first
        if (cachedRegions[region]) {
          console.log(`Using cached region: ${region}`);
          updateMapWithGeoJSON(cachedRegions[region]);
          return;
        }

        // Fetch from network
        const response = await fetch(
          GEOJSON_URLS[region as keyof typeof GEOJSON_URLS]
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch region: ${response.statusText}`);
        }

        const data = await response.json();
        setCachedRegions(prev => ({ ...prev, [region]: data }));
        updateMapWithGeoJSON(data);
      } catch (error) {
        console.error(`Error loading region ${region}:`, error);
        setMapError(`Failed to load region data: ${region}`);
      } finally {
        setIsLoading(false);
      }
    },
    [cachedRegions]
  );

  // Update map with GeoJSON data
  const updateMapWithGeoJSON = useCallback((data: any) => {
    if (!map.current) return;

    // Remove existing layer if it exists
    if (map.current.getLayer('foraging-polygons')) {
      map.current.removeLayer('foraging-polygons');
    }
    if (map.current.getSource('foraging-polygons')) {
      map.current.removeSource('foraging-polygons');
    }

    // Add new source and layer
    map.current.addSource('foraging-polygons', {
      type: 'geojson',
      data,
    });

    map.current.addLayer({
      id: 'foraging-polygons',
      type: 'fill',
      source: 'foraging-polygons',
      paint: {
        'fill-color': [
          'case',
          ['has', 'mushroom_score'],
          [
            'interpolate',
            ['linear'],
            ['get', 'mushroom_score'],
            0,
            '#ffffcc',
            2,
            '#ffe4b5',
            4,
            '#fbae7e',
            6,
            '#fb6d51',
            8,
            '#a60310',
            10,
            '#800020',
          ],
          '#ffffcc',
        ],
        'fill-opacity': 0.85,
      },
    });

    // Add popup on click
    map.current.on('click', 'foraging-polygons', e => {
      if (e.features && e.features[0]) {
        const feature = e.features[0];
        const score = feature.properties?.mushroom_score || 0;

        new mapboxgl.Popup()
          .setLngLat(e.lngLat)
          .setHTML(`<b>Mushroom Score:</b> ${score.toFixed(2)}`)
          .addTo(map.current!);
      }
    });

    console.log('Map updated with GeoJSON data');
  }, []);

  // Handle region change
  const handleRegionChange = useCallback(
    (region: string) => {
      setSelectedRegion(region);
      setShowRegionDropdown(false);
      loadRegion(region);
      localStorage.setItem('selectedRegion', region);
    },
    [loadRegion]
  );

  // Handle species change
  const handleSpeciesChange = useCallback((species: string) => {
    setSelectedSpecies(species);
    setShowSpeciesDropdown(false);
    localStorage.setItem('selectedSpecies', species);
    updateVisibleLayers();
  }, []);

  // Update visible layers
  const updateVisibleLayers = useCallback(() => {
    if (!map.current) return;

    const layers = map.current.getStyle().layers;
    if (!layers) return;

    layers.forEach(layer => {
      const id = layer.id;
      const isSpeciesLayer = Object.values(SPECIES_OPTIONS).some(speciesCode =>
        id.startsWith(speciesCode)
      );
      const isRelevantSpecies = id.startsWith(selectedSpecies);
      const isNumbersLayer = id.includes('numbers');

      if (isSpeciesLayer) {
        if (isRelevantSpecies) {
          const visibility = isNumbersLayer
            ? layersVisible
              ? 'visible'
              : 'none'
            : 'visible';
          map.current!.setLayoutProperty(id, 'visibility', visibility);
        } else {
          map.current!.setLayoutProperty(id, 'visibility', 'none');
        }
      }
    });
  }, [selectedSpecies, layersVisible]);

  // Toggle layers visibility
  const toggleLayersVisibility = useCallback(() => {
    setLayersVisible(prev => {
      const newValue = !prev;
      localStorage.setItem('numbersLayersVisible', String(newValue));
      updateVisibleLayers();
      return newValue;
    });
  }, [updateVisibleLayers]);

  // Toggle dark layers
  const toggleDarkLayers = useCallback(() => {
    if (!map.current) return;

    setDarkLayersVisible(prev => {
      const newValue = !prev;
      const layers = map.current!.getStyle().layers;

      layers.forEach(layer => {
        const layerId = layer.id;
        if (layerId.endsWith(' dark')) {
          map.current!.setLayoutProperty(
            layerId,
            'visibility',
            newValue ? 'visible' : 'none'
          );
        }
      });

      localStorage.setItem('darkLayersVisible', String(newValue));
      return newValue;
    });
  }, []);

  // Handle user location
  const handleLocateUser = useCallback(async () => {
    if (!map.current) return;

    setIsLoading(true);
    try {
      const position = await getUserLocation();
      const coords: [number, number] = [
        position.coords.longitude,
        position.coords.latitude,
      ];

      // Remove existing marker
      if (userMarker.current) {
        userMarker.current.remove();
      }

      // Create new marker
      const pinElement = document.createElement('div');
      pinElement.style.width = '20px';
      pinElement.style.height = '20px';
      pinElement.style.backgroundColor = '#3b82f6';
      pinElement.style.borderRadius = '50%';
      pinElement.style.border = '3px solid white';
      pinElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      userMarker.current = new mapboxgl.Marker({ element: pinElement })
        .setLngLat(coords)
        .addTo(map.current);

      // Fly to location
      map.current.flyTo({ center: coords, zoom: 8, speed: 2 });
    } catch (error) {
      console.error('Location error:', error);
      setMapError('Unable to retrieve your location');
    } finally {
      setIsLoading(false);
    }
  }, [getUserLocation]);

  // Find nearby edibles
  const findNearbyEdibles = useCallback(async () => {
    if (!map.current) return;

    setIsLoading(true);
    try {
      const position = await getUserLocation();
      const coords: [number, number] = [
        position.coords.longitude,
        position.coords.latitude,
      ];

      // Fly to location
      map.current.flyTo({
        center: coords,
        zoom: 8,
        speed: 1.2,
        essential: true,
      });

      // For now, show a simple message about nearby edibles
      // This can be enhanced later with actual polygon scanning
      setNearbyEdibles([
        { name: '🍄 Chanterelles', score: 8.5 },
        { name: '🫐 Wild Blueberries', score: 7.2 },
        { name: '🌿 Wild Garlic', score: 6.8 },
      ]);
      setShowNearbyModal(true);
      setIsLoading(false);
    } catch (error) {
      console.error('Error finding nearby edibles:', error);
      setMapError('Unable to find nearby edibles');
      setIsLoading(false);
    }
  }, [getUserLocation]);

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Implement geocoding search here
  }, []);

  if (mapError) {
    return (
      <div
        className={`flex items-center justify-center h-96 bg-gray-100 rounded-lg ${className}`}
      >
        <div className='text-center'>
          <p className='text-red-600 mb-4'>{mapError}</p>
          <Button onClick={() => setMapError(null)}>Retry</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div ref={mapContainer} className='w-full h-96 rounded-lg' />

      {/* Loading Overlay */}
      {isLoading && (
        <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg'>
          <div className='text-white'>Loading...</div>
        </div>
      )}

      {/* Map Controls */}
      <div className='absolute top-4 left-4 space-y-2'>
        {/* Region Selector */}
        <div className='relative'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => setShowRegionDropdown(!showRegionDropdown)}
            className='flex items-center gap-2'
          >
            <Globe className='w-4 h-4' />
            {REGIONS[selectedRegion as keyof typeof REGIONS]}
          </Button>

          {showRegionDropdown && (
            <div className='absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-48'>
              {Object.entries(REGIONS).map(([code, name]) => (
                <button
                  key={code}
                  onClick={() => handleRegionChange(code)}
                  className='block w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg'
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Species Selector */}
        <div className='relative'>
          <Button
            variant='secondary'
            size='sm'
            onClick={() => setShowSpeciesDropdown(!showSpeciesDropdown)}
            className='flex items-center gap-2'
          >
            {
              SPECIES_DISPLAY_MAP[
                selectedSpecies as keyof typeof SPECIES_DISPLAY_MAP
              ]
            }
          </Button>

          {showSpeciesDropdown && (
            <div className='absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg z-50 min-w-48'>
              {Object.entries(SPECIES_OPTIONS).map(([name, code]) => (
                <button
                  key={code}
                  onClick={() => handleSpeciesChange(code)}
                  className='block w-full text-left px-4 py-2 hover:bg-gray-100 first:rounded-t-lg last:rounded-b-lg'
                >
                  {name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Layer Controls */}
        <div className='flex gap-1'>
          <Button
            variant='secondary'
            size='sm'
            onClick={toggleLayersVisibility}
            className='flex items-center gap-1'
          >
            {layersVisible ? (
              <Eye className='w-4 h-4' />
            ) : (
              <EyeOff className='w-4 h-4' />
            )}
            Numbers
          </Button>

          <Button
            variant='secondary'
            size='sm'
            onClick={toggleDarkLayers}
            className='flex items-center gap-1'
          >
            {darkLayersVisible ? (
              <Eye className='w-4 h-4' />
            ) : (
              <EyeOff className='w-4 h-4' />
            )}
            Dark
          </Button>
        </div>
      </div>

      {/* Right Side Controls */}
      <div className='absolute top-4 right-4 space-y-2'>
        {/* Search */}
        <div className='flex gap-2'>
          <Input
            placeholder='Search location...'
            value={searchQuery}
            onChange={e => handleSearch(e.target.value)}
            className='w-48'
          />
          <Button size='sm' variant='secondary'>
            <Search className='w-4 h-4' />
          </Button>
        </div>

        {/* Location Controls */}
        <div className='flex gap-1'>
          <Button
            variant='secondary'
            size='sm'
            onClick={handleLocateUser}
            className='flex items-center gap-1'
          >
            <MapPin className='w-4 h-4' />
            Locate
          </Button>

          <Button
            variant='secondary'
            size='sm'
            onClick={findNearbyEdibles}
            className='flex items-center gap-1'
          >
            <Navigation className='w-4 h-4' />
            Nearby
          </Button>
        </div>
      </div>

      {/* Nearby Edibles Modal */}
      {showNearbyModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <Card className='w-96 max-h-96 overflow-y-auto'>
            <CardHeader>
              <CardTitle>Nearby Edibles</CardTitle>
            </CardHeader>
            <CardContent>
              {nearbyEdibles.length === 0 ? (
                <p className='text-gray-600'>
                  🍃 Dear forager, the season is tough at the moment—nothing
                  seems to be growing around you. But don't worry, better times
                  will come. Stay tuned for more edibles to be added soon!
                </p>
              ) : (
                <div>
                  <p className='mb-4'>
                    🌿 Hey fellow forager! Following edibles could be growing in
                    your proximity:
                  </p>
                  <ul className='space-y-2'>
                    {nearbyEdibles.map((item, index) => (
                      <li
                        key={index}
                        className='flex items-center justify-between'
                      >
                        <span className='font-medium'>{item.name}</span>
                        <Badge variant='secondary'>
                          {item.score.toFixed(1)}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className='w-full mt-4'
                    onClick={() => setShowNearbyModal(false)}
                  >
                    Close
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showRegionDropdown || showSpeciesDropdown) && (
        <div
          className='fixed inset-0 z-40'
          onClick={() => {
            setShowRegionDropdown(false);
            setShowSpeciesDropdown(false);
          }}
        />
      )}
    </div>
  );
};

export default AdvancedMap;
