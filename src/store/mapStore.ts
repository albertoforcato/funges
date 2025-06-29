import { create } from 'zustand';

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
  latitude: number;
  longitude: number;
  type: 'mushroom' | 'plant' | 'berry' | 'herb';
  species: string[];
  probability: number; // 0-1
  lastUpdated: number;
  notes?: string;
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
  // Map viewport
  viewport: MapViewport;

  // Foraging spots
  foragingSpots: ForagingSpot[];
  selectedSpot: ForagingSpot | null;

  // Overlays
  overlays: MapOverlay[];

  // Map settings
  showForagingSpots: boolean;
  showWeatherOverlay: boolean;
  showSoilOverlay: boolean;
  showSpeciesOverlay: boolean;

  // Map controls
  isMapLoading: boolean;
  mapStyle: 'streets' | 'satellite' | 'outdoors' | 'light' | 'dark';

  // Actions
  setViewport: (viewport: Partial<MapViewport>) => void;
  setForagingSpots: (spots: ForagingSpot[]) => void;
  addForagingSpot: (spot: ForagingSpot) => void;
  updateForagingSpot: (id: string, updates: Partial<ForagingSpot>) => void;
  removeForagingSpot: (id: string) => void;
  setSelectedSpot: (spot: ForagingSpot | null) => void;
  addOverlay: (overlay: MapOverlay) => void;
  updateOverlay: (id: string, updates: Partial<MapOverlay>) => void;
  removeOverlay: (id: string) => void;
  toggleForagingSpots: () => void;
  toggleWeatherOverlay: () => void;
  toggleSoilOverlay: () => void;
  toggleSpeciesOverlay: () => void;
  setMapLoading: (loading: boolean) => void;
  setMapStyle: (style: MapState['mapStyle']) => void;
  flyToLocation: (latitude: number, longitude: number, zoom?: number) => void;
}

const defaultViewport: MapViewport = {
  latitude: 46.8182, // Switzerland center
  longitude: 8.2275,
  zoom: 8,
  bearing: 0,
  pitch: 0,
};

export const useMapStore = create<MapState>((set, get) => ({
  // Initial state
  viewport: defaultViewport,
  foragingSpots: [],
  selectedSpot: null,
  overlays: [],
  showForagingSpots: true,
  showWeatherOverlay: false,
  showSoilOverlay: false,
  showSpeciesOverlay: false,
  isMapLoading: false,
  mapStyle: 'streets',

  // Actions
  setViewport: (newViewport: Partial<MapViewport>) =>
    set(state => ({
      viewport: { ...state.viewport, ...newViewport },
    })),

  setForagingSpots: (spots: ForagingSpot[]) => set({ foragingSpots: spots }),

  addForagingSpot: (spot: ForagingSpot) =>
    set(state => ({
      foragingSpots: [...state.foragingSpots, spot],
    })),

  updateForagingSpot: (id: string, updates: Partial<ForagingSpot>) =>
    set(state => ({
      foragingSpots: state.foragingSpots.map(spot =>
        spot.id === id ? { ...spot, ...updates } : spot
      ),
    })),

  removeForagingSpot: (id: string) =>
    set(state => ({
      foragingSpots: state.foragingSpots.filter(spot => spot.id !== id),
    })),

  setSelectedSpot: (spot: ForagingSpot | null) => set({ selectedSpot: spot }),

  addOverlay: (overlay: MapOverlay) =>
    set(state => ({
      overlays: [...state.overlays, overlay],
    })),

  updateOverlay: (id: string, updates: Partial<MapOverlay>) =>
    set(state => ({
      overlays: state.overlays.map(overlay =>
        overlay.id === id ? { ...overlay, ...updates } : overlay
      ),
    })),

  removeOverlay: (id: string) =>
    set(state => ({
      overlays: state.overlays.filter(overlay => overlay.id !== id),
    })),

  toggleForagingSpots: () =>
    set(state => ({ showForagingSpots: !state.showForagingSpots })),

  toggleWeatherOverlay: () =>
    set(state => ({ showWeatherOverlay: !state.showWeatherOverlay })),

  toggleSoilOverlay: () =>
    set(state => ({ showSoilOverlay: !state.showSoilOverlay })),

  toggleSpeciesOverlay: () =>
    set(state => ({ showSpeciesOverlay: !state.showSpeciesOverlay })),

  setMapLoading: (loading: boolean) => set({ isMapLoading: loading }),

  setMapStyle: (style: MapState['mapStyle']) => set({ mapStyle: style }),

  flyToLocation: (latitude: number, longitude: number, zoom: number = 12) =>
    set(state => ({
      viewport: {
        ...state.viewport,
        latitude,
        longitude,
        zoom,
      },
    })),
}));
