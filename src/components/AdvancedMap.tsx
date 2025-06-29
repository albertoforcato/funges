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
  BarChart3,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useMapStore } from '@/store/mapStore';
import RealTimeDataOverlay from './RealTimeDataOverlay';
import { useTheme } from '@/hooks/use-theme';
import { getColorForScore, MAP_UI_COLORS, getScoreColor } from '@/lib/colors';

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
    berry_score?: number;
    herb_score?: number;
    nut_score?: number;
    season?: 'spring' | 'summer' | 'autumn' | 'winter' | 'year_round';
    elevation_min?: number;
    elevation_max?: number;
    habitat_type?: string;
    last_updated?: string;
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
  const nearbySpotMarkers = useRef<mapboxgl.Marker[]>([]);

  const [mapError, setMapError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState<string>('WE_south');
  const [selectedSpecies, setSelectedSpecies] = useState<string>('mushrooms');
  const [showRegionDropdown, setShowRegionDropdown] = useState(false);
  const [showSpeciesDropdown, setShowSpeciesDropdown] = useState(false);
  const [layersVisible, setLayersVisible] = useState(true);
  const [darkLayersVisible, setDarkLayersVisible] = useState(false);
  const [nearbyEdibles, setNearbyEdibles] = useState<
    Array<{ name: string; score: number; distance: string }>
  >([]);
  const [showNearbyModal, setShowNearbyModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [cachedRegions, setCachedRegions] = useState<Record<string, any>>({});
  const [showRealTimeData, setShowRealTimeData] = useState(false);
  const [showPolygonOverlays, setShowPolygonOverlays] = useState(true);
  const [currentCoordinates, setCurrentCoordinates] = useState<
    [number, number] | null
  >(null);

  const { userLocation, setUserLocation, getUserLocation, clearError } =
    useMapStore();

  const { theme } = useTheme();
  const currentTheme =
    theme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;

  // Handle map move to update current coordinates
  const handleMapMove = useCallback(() => {
    if (map.current) {
      const center = map.current.getCenter();
      setCurrentCoordinates([center.lng, center.lat]);
    }
  }, []);

  // Color function for polygons - now theme-aware
  const getColor = useCallback(
    (score: number) => {
      return getColorForScore(score, selectedSpecies, currentTheme);
    },
    [selectedSpecies, currentTheme]
  );

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

      // Handle map move
      map.current.on('moveend', handleMapMove);

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
  const updateMapWithGeoJSON = useCallback(
    (data: any) => {
      if (!map.current) return;

      // Remove existing layers and sources
      const existingLayers = [
        'foraging-polygons',
        'foraging-polygons-border',
        'foraging-polygons-hover',
      ];
      existingLayers.forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          map.current!.removeLayer(layerId);
        }
      });

      const existingSources = ['foraging-polygons'];
      existingSources.forEach(sourceId => {
        if (map.current!.getSource(sourceId)) {
          map.current!.removeSource(sourceId);
        }
      });

      // Add new source
      map.current.addSource('foraging-polygons', {
        type: 'geojson',
        data,
      });

      // Function to get color based on selected species and score - now theme-aware
      const getSpeciesColor = (properties: any) => {
        const score = properties[`${selectedSpecies}_score`] || 0;
        return getColorForScore(score, selectedSpecies, currentTheme);
      };

      // Add main polygon layer
      map.current.addLayer({
        id: 'foraging-polygons',
        type: 'fill',
        source: 'foraging-polygons',
        paint: {
          'fill-color': [
            'case',
            ['has', `${selectedSpecies}_score`],
            ['get', `${selectedSpecies}_score`],
            getColorForScore(0, selectedSpecies, currentTheme),
          ],
          'fill-opacity': [
            'case',
            ['has', `${selectedSpecies}_score`],
            0.7,
            0.3,
          ],
        },
        filter: ['has', `${selectedSpecies}_score`],
      });

      // Add border layer for better definition
      map.current.addLayer({
        id: 'foraging-polygons-border',
        type: 'line',
        source: 'foraging-polygons',
        paint: {
          'line-color': MAP_UI_COLORS.border[currentTheme],
          'line-width': 1,
          'line-opacity': 0.5,
        },
        filter: ['has', `${selectedSpecies}_score`],
      });

      // Add hover layer
      map.current.addLayer({
        id: 'foraging-polygons-hover',
        type: 'fill',
        source: 'foraging-polygons',
        paint: {
          'fill-color': MAP_UI_COLORS.hover[currentTheme],
          'fill-opacity': 0,
        },
        filter: ['has', `${selectedSpecies}_score`],
      });

      // Handle hover effects
      let hoveredPolygonId: string | null = null;

      map.current.on('mouseenter', 'foraging-polygons-hover', e => {
        if (e.features && e.features[0]) {
          map.current!.getCanvas().style.cursor = 'pointer';

          if (hoveredPolygonId !== null) {
            map.current!.setFeatureState(
              { source: 'foraging-polygons', id: hoveredPolygonId },
              { hover: false }
            );
          }

          hoveredPolygonId = e.features[0].id as string;
          map.current!.setFeatureState(
            { source: 'foraging-polygons', id: hoveredPolygonId },
            { hover: true }
          );
        }
      });

      map.current.on('mouseleave', 'foraging-polygons-hover', () => {
        map.current!.getCanvas().style.cursor = '';
        if (hoveredPolygonId !== null) {
          map.current!.setFeatureState(
            { source: 'foraging-polygons', id: hoveredPolygonId },
            { hover: false }
          );
        }
        hoveredPolygonId = null;
      });

      // Add click handler for detailed popup
      map.current.on('click', 'foraging-polygons-hover', e => {
        if (e.features && e.features[0]) {
          const feature = e.features[0];
          const properties = feature.properties;
          if (!properties) return;

          const score = properties[`${selectedSpecies}_score`] || 0;
          const season = properties.season || 'Unknown';
          const habitat = properties.habitat_type || 'Unknown';
          const elevation =
            properties.elevation_min && properties.elevation_max
              ? `${properties.elevation_min}-${properties.elevation_max}m`
              : 'Unknown';

          const popupContent = `
            <div class="p-3">
              <h3 class="font-bold text-lg mb-2">${properties.name || 'Foraging Area'}</h3>
              <div class="space-y-1 text-sm">
                <p><strong>${SPECIES_DISPLAY_MAP[selectedSpecies as keyof typeof SPECIES_DISPLAY_MAP]} Score:</strong> ${score.toFixed(1)}/10</p>
                <p><strong>Season:</strong> ${season}</p>
                <p><strong>Habitat:</strong> ${habitat}</p>
                <p><strong>Elevation:</strong> ${elevation}</p>
                ${properties.description ? `<p><strong>Notes:</strong> ${properties.description}</p>` : ''}
              </div>
            </div>
          `;

          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(popupContent)
            .addTo(map.current!);
        }
      });

      console.log('Map updated with enhanced GeoJSON data');
    },
    [selectedSpecies, currentTheme]
  );

  // Handle region change
  const handleRegionChange = useCallback(
    (region: string) => {
      setSelectedRegion(region);
      setShowRegionDropdown(false);

      // Only load GeoJSON data if polygon overlays are enabled
      if (showPolygonOverlays) {
        const geoJsonUrl = GEOJSON_URLS[region as keyof typeof GEOJSON_URLS];
        if (geoJsonUrl) {
          fetch(geoJsonUrl)
            .then(response => response.json())
            .then(data => {
              updateMapWithGeoJSON(data);
            })
            .catch(error => {
              console.error('Error loading GeoJSON data:', error);
            });
        }
      }
    },
    [updateMapWithGeoJSON, showPolygonOverlays]
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
      pinElement.style.backgroundColor = MAP_UI_COLORS.pin[currentTheme];
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
  }, [getUserLocation, currentTheme]);

  // Find nearby edibles
  const findNearbyEdibles = useCallback(async () => {
    if (!map.current) return;

    setIsLoading(true);
    try {
      const position = await getUserLocation();
      const userCoords: [number, number] = [
        position.coords.longitude,
        position.coords.latitude,
      ];

      // Remove existing user marker
      if (userMarker.current) {
        userMarker.current.remove();
      }

      // Create new user marker
      const pinElement = document.createElement('div');
      pinElement.style.width = '20px';
      pinElement.style.height = '20px';
      pinElement.style.backgroundColor = MAP_UI_COLORS.pin[currentTheme];
      pinElement.style.borderRadius = '50%';
      pinElement.style.border = '3px solid white';
      pinElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';

      userMarker.current = new mapboxgl.Marker({ element: pinElement })
        .setLngLat(userCoords)
        .addTo(map.current);

      // Fly to location
      map.current.flyTo({
        center: userCoords,
        zoom: 10,
        speed: 1.2,
        essential: true,
      });

      // Find nearby foraging areas from GeoJSON data
      const nearbyAreas = await findNearbyForagingAreas(userCoords);

      if (nearbyAreas.length > 0) {
        setNearbyEdibles(nearbyAreas);
        setShowNearbyModal(true);

        // Add markers for nearby foraging spots
        addNearbySpotMarkers(nearbyAreas, userCoords);
      } else {
        // Show fallback message if no nearby areas found
        setNearbyEdibles([
          { name: '🍄 Chanterelles', score: 8.5, distance: '2.3 km' },
          { name: '🫐 Wild Blueberries', score: 7.2, distance: '1.8 km' },
          { name: '🌿 Wild Garlic', score: 6.8, distance: '3.1 km' },
        ]);
        setShowNearbyModal(true);
      }
    } catch (error) {
      console.error('Error finding nearby edibles:', error);
      setMapError('Unable to find nearby edibles');
    } finally {
      setIsLoading(false);
    }
  }, [getUserLocation, currentTheme]);

  // Find nearby foraging areas from GeoJSON data
  const findNearbyForagingAreas = useCallback(
    async (userCoords: [number, number]) => {
      try {
        const geoJsonUrl =
          GEOJSON_URLS[selectedRegion as keyof typeof GEOJSON_URLS];
        if (!geoJsonUrl) return [];

        const response = await fetch(geoJsonUrl);
        const data = await response.json();

        const nearbyAreas: Array<{
          name: string;
          score: number;
          distance: string;
          coordinates: [number, number];
          type: string;
          season?: string;
        }> = [];

        // Calculate distance and filter nearby areas
        data.features?.forEach((feature: any) => {
          if (feature.geometry?.type === 'Polygon') {
            // Get centroid of polygon
            const centroid = getPolygonCentroid(
              feature.geometry.coordinates[0]
            );
            const distance = calculateDistance(userCoords, centroid);

            // Only include areas within 10km
            if (distance <= 10) {
              const properties = feature.properties;
              const score = properties[`${selectedSpecies}_score`] || 0;

              if (score > 0) {
                nearbyAreas.push({
                  name: properties.name || 'Foraging Area',
                  score: score,
                  distance: `${distance.toFixed(1)} km`,
                  coordinates: centroid,
                  type: properties.type || 'foraging_spot',
                  season: properties.season,
                });
              }
            }
          }
        });

        // Sort by score and distance
        return nearbyAreas
          .sort((a, b) => {
            // Prioritize by score, then by distance
            if (Math.abs(a.score - b.score) > 1) {
              return b.score - a.score;
            }
            return parseFloat(a.distance) - parseFloat(b.distance);
          })
          .slice(0, 10); // Limit to top 10
      } catch (error) {
        console.error('Error fetching nearby areas:', error);
        return [];
      }
    },
    [selectedRegion, selectedSpecies]
  );

  // Calculate polygon centroid
  const getPolygonCentroid = useCallback((coordinates: number[][]) => {
    let x = 0;
    let y = 0;

    coordinates.forEach(coord => {
      x += coord[0];
      y += coord[1];
    });

    return [x / coordinates.length, y / coordinates.length] as [number, number];
  }, []);

  // Calculate distance between two points in km
  const calculateDistance = useCallback(
    (coord1: [number, number], coord2: [number, number]) => {
      const R = 6371; // Earth's radius in km
      const dLat = ((coord2[1] - coord1[1]) * Math.PI) / 180;
      const dLon = ((coord2[0] - coord1[0]) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((coord1[1] * Math.PI) / 180) *
          Math.cos((coord2[1] * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    },
    []
  );

  // Add markers for nearby foraging spots
  const addNearbySpotMarkers = useCallback(
    (areas: any[], userCoords: [number, number]) => {
      if (!map.current) return;

      // Remove existing nearby spot markers
      if (nearbySpotMarkers.current.length > 0) {
        nearbySpotMarkers.current.forEach(marker => marker.remove());
        nearbySpotMarkers.current = [];
      }

      areas.forEach((area, index) => {
        const markerElement = document.createElement('div');
        markerElement.style.width = '16px';
        markerElement.style.height = '16px';
        markerElement.style.backgroundColor = getScoreColor(area.score);
        markerElement.style.borderRadius = '50%';
        markerElement.style.border = '2px solid white';
        markerElement.style.boxShadow = '0 2px 4px rgba(0,0,0,0.3)';
        markerElement.style.cursor = 'pointer';

        const marker = new mapboxgl.Marker({ element: markerElement })
          .setLngLat(area.coordinates)
          .addTo(map.current!);

        // Add popup
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${area.name}</h3>
            <p class="text-xs text-text-secondary">Score: ${area.score.toFixed(1)}/10</p>
            <p class="text-xs text-text-secondary">Distance: ${area.distance}</p>
            ${area.season ? `<p class="text-xs text-text-secondary">Season: ${area.season}</p>` : ''}
          </div>
        `);

        marker.setPopup(popup);
        nearbySpotMarkers.current.push(marker);
      });
    },
    []
  );

  // Get color based on score
  const getLocalScoreColor = useCallback(
    (score: number) => {
      return getScoreColor(score, currentTheme);
    },
    [currentTheme]
  );

  // Handle search
  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query);
    // Implement geocoding search here
  }, []);

  // Effect to handle polygon overlay visibility changes
  useEffect(() => {
    if (!map.current) return;

    if (!showPolygonOverlays) {
      // Remove polygon layers when disabled
      const layersToRemove = [
        'foraging-polygons',
        'foraging-polygons-border',
        'foraging-polygons-hover',
      ];
      layersToRemove.forEach(layerId => {
        if (map.current!.getLayer(layerId)) {
          map.current!.removeLayer(layerId);
        }
      });

      // Remove polygon source
      if (map.current.getSource('foraging-polygons')) {
        map.current.removeSource('foraging-polygons');
      }
    } else {
      // Reload polygon data when enabled
      const geoJsonUrl =
        GEOJSON_URLS[selectedRegion as keyof typeof GEOJSON_URLS];
      if (geoJsonUrl) {
        fetch(geoJsonUrl)
          .then(response => response.json())
          .then(data => {
            updateMapWithGeoJSON(data);
          })
          .catch(error => {
            console.error('Error loading GeoJSON data:', error);
          });
      }
    }
  }, [showPolygonOverlays, selectedRegion, updateMapWithGeoJSON]);

  // Cleanup nearby spot markers when region changes
  useEffect(() => {
    if (nearbySpotMarkers.current.length > 0) {
      nearbySpotMarkers.current.forEach(marker => marker.remove());
      nearbySpotMarkers.current = [];
    }
  }, [selectedRegion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (nearbySpotMarkers.current.length > 0) {
        nearbySpotMarkers.current.forEach(marker => marker.remove());
      }
      if (userMarker.current) {
        userMarker.current.remove();
      }
    };
  }, []);

  if (mapError) {
    return (
      <div
        className={`flex items-center justify-center h-96 bg-background-secondary rounded-lg ${className}`}
      >
        <div className='text-center'>
          <p className='text-error mb-4'>{mapError}</p>
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
                  className='block w-full text-left px-4 py-2 hover:bg-background-secondary first:rounded-t-lg last:rounded-b-lg'
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
                  className='block w-full text-left px-4 py-2 hover:bg-background-secondary first:rounded-t-lg last:rounded-b-lg'
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

        {/* Real-Time Data Toggle */}
        <Button
          variant='secondary'
          size='sm'
          onClick={() => setShowRealTimeData(!showRealTimeData)}
          className='flex items-center gap-1'
        >
          <BarChart3 className='w-4 h-4' />
          {showRealTimeData ? 'Hide' : 'Show'} Data
        </Button>

        {/* Polygon Overlays Toggle */}
        <Button
          variant='secondary'
          size='sm'
          onClick={() => setShowPolygonOverlays(!showPolygonOverlays)}
          className='flex items-center gap-1'
        >
          <Layers className='w-4 h-4' />
          {showPolygonOverlays ? 'Hide' : 'Show'} Areas
        </Button>
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

      {/* Real-Time Data Overlay */}
      <RealTimeDataOverlay
        coordinates={currentCoordinates}
        isVisible={showRealTimeData}
        onToggleVisibility={() => setShowRealTimeData(!showRealTimeData)}
      />

      {/* Nearby Edibles Modal */}
      {showNearbyModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
          <Card className='w-96 max-h-96 overflow-y-auto'>
            <CardHeader>
              <CardTitle>Nearby Edibles</CardTitle>
            </CardHeader>
            <CardContent>
              {nearbyEdibles.length === 0 ? (
                <p className='text-text-secondary'>
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
                        className='flex items-center justify-between p-2 bg-background-secondary rounded'
                      >
                        <div>
                          <span className='font-medium'>{item.name}</span>
                          {item.distance && (
                            <p className='text-xs text-text-tertiary'>
                              Distance: {item.distance}
                            </p>
                          )}
                        </div>
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
