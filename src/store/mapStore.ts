import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface MapViewport {
  latitude: number;
  longitude: number;
  zoom: number;
  bearing: number;
  pitch: number;
}

export interface ForagingSpot {
  id: string;
  name: string;
  description: string;
  coordinates: [number, number];
  type: 'mushroom' | 'berry' | 'herb' | 'nut';
  season: string[];
  confidence: number;
  lastUpdated: string;
}

export interface MapOverlay {
  id: string;
  type: 'heatmap' | 'polygon' | 'marker' | 'route';
  data: any;
  visible: boolean;
  opacity: number;
  color?: string;
}

export interface MapState {
  // Map configuration
  center: [number, number];
  zoom: number;
  mapStyle: string;

  // User location
  userLocation: [number, number] | null;
  userLocationError: string | null;

  // Foraging data
  foragingSpots: ForagingSpot[];
  selectedSpot: ForagingSpot | null;

  // UI state
  isLoading: boolean;
  error: string | null;
  showSearch: boolean;
  showUserLocation: boolean;

  // Actions
  setCenter: (center: [number, number]) => void;
  setZoom: (zoom: number) => void;
  setMapStyle: (style: string) => void;
  setUserLocation: (location: [number, number] | null) => void;
  setUserLocationError: (error: string | null) => void;
  setForagingSpots: (spots: ForagingSpot[]) => void;
  addForagingSpot: (spot: ForagingSpot) => void;
  updateForagingSpot: (id: string, updates: Partial<ForagingSpot>) => void;
  removeForagingSpot: (id: string) => void;
  setSelectedSpot: (spot: ForagingSpot | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setShowSearch: (show: boolean) => void;
  setShowUserLocation: (show: boolean) => void;
  clearError: () => void;
  getUserLocation: () => Promise<GeolocationPosition>;
  fetchNearbySpots: (coordinates: [number, number]) => Promise<void>;
}

const defaultViewport: MapViewport = {
  latitude: 46.8182, // Switzerland center
  longitude: 8.2275,
  zoom: 8,
  bearing: 0,
  pitch: 0,
};

export const useMapStore = create<MapState>()(
  devtools(
    (set, get) => ({
      // Initial state
      center: [7.3359, 47.7508], // Switzerland
      zoom: 5,
      mapStyle:
        'mapbox://styles/lodist/clzo3ivsk007d01piaoah1dfy?optimize=true',
      userLocation: null,
      userLocationError: null,
      foragingSpots: [],
      selectedSpot: null,
      isLoading: false,
      error: null,
      showSearch: true,
      showUserLocation: true,

      // Actions
      setCenter: center => set({ center }),
      setZoom: zoom => set({ zoom }),
      setMapStyle: mapStyle => set({ mapStyle }),
      setUserLocation: userLocation => set({ userLocation }),
      setUserLocationError: userLocationError => set({ userLocationError }),
      setForagingSpots: foragingSpots => set({ foragingSpots }),
      setSelectedSpot: selectedSpot => set({ selectedSpot }),
      setIsLoading: isLoading => set({ isLoading }),
      setError: error => set({ error }),
      setShowSearch: showSearch => set({ showSearch }),
      setShowUserLocation: showUserLocation => set({ showUserLocation }),
      clearError: () => set({ error: null }),

      getUserLocation: (): Promise<GeolocationPosition> => {
        return new Promise((resolve, reject) => {
          if (!navigator.geolocation) {
            reject(new Error('Geolocation is not supported by this browser'));
            return;
          }

          navigator.geolocation.getCurrentPosition(
            position => {
              const coords: [number, number] = [
                position.coords.longitude,
                position.coords.latitude,
              ];
              set({ userLocation: coords, userLocationError: null });
              resolve(position);
            },
            error => {
              const errorMessage = `Unable to retrieve your location: ${error.message}`;
              set({ userLocationError: errorMessage });
              reject(error);
            },
            {
              enableHighAccuracy: true,
              timeout: 15000,
              maximumAge: 0,
            }
          );
        });
      },

      fetchNearbySpots: async coordinates => {
        set({ isLoading: true, error: null });
        try {
          // Simulate API call - replace with actual API endpoint
          const response = await fetch(
            `/api/foraging-spots?lat=${coordinates[1]}&lng=${coordinates[0]}`
          );
          if (!response.ok) {
            throw new Error('Failed to fetch nearby spots');
          }
          const spots = await response.json();
          set({ foragingSpots: spots, isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Unknown error',
            isLoading: false,
          });
        }
      },

      // Foraging spot actions
      addForagingSpot: spot =>
        set(state => ({
          foragingSpots: [...state.foragingSpots, spot],
        })),

      updateForagingSpot: (id, updates) =>
        set(state => ({
          foragingSpots: state.foragingSpots.map(spot =>
            spot.id === id ? { ...spot, ...updates } : spot
          ),
        })),

      removeForagingSpot: id =>
        set(state => ({
          foragingSpots: state.foragingSpots.filter(spot => spot.id !== id),
        })),
    }),
    {
      name: 'map-store',
    }
  )
);
