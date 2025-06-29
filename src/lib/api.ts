// API base URL and configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.fung.es';

// Common API response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface Species {
  id: string;
  name: string;
  scientificName: string;
  type: 'mushroom' | 'plant' | 'berry' | 'nut' | 'flower';
  description: string;
  edible: boolean;
  poisonous: boolean;
  season: string[];
  region: string[];
  imageUrl?: string;
}

export interface Recipe {
  id: string;
  name: string;
  ingredients: string[];
  instructions: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  prepTime: number;
  cookTime: number;
  servings: number;
  imageUrl?: string;
}

export interface MapRegion {
  id: string;
  name: string;
  coordinates: [number, number];
  weatherData: {
    temperature: number;
    humidity: number;
    precipitation: number;
  };
  soilData: {
    ph: number;
    moisture: number;
    type: string;
  };
}

// API functions
export const api = {
  // Species API
  species: {
    async getAll(): Promise<Species[]> {
      const response = await fetch(`${API_BASE_URL}/species`);
      if (!response.ok) {
        throw new Error('Failed to fetch species');
      }
      return response.json();
    },

    async getById(id: string): Promise<Species> {
      const response = await fetch(`${API_BASE_URL}/species/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch species ${id}`);
      }
      return response.json();
    },

    async search(query: string): Promise<Species[]> {
      const response = await fetch(`${API_BASE_URL}/species/search?q=${encodeURIComponent(query)}`);
      if (!response.ok) {
        throw new Error('Failed to search species');
      }
      return response.json();
    },
  },

  // Recipes API
  recipes: {
    async getAll(): Promise<Recipe[]> {
      const response = await fetch(`${API_BASE_URL}/recipes`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes');
      }
      return response.json();
    },

    async getById(id: string): Promise<Recipe> {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch recipe ${id}`);
      }
      return response.json();
    },

    async getByIngredient(ingredient: string): Promise<Recipe[]> {
      const response = await fetch(`${API_BASE_URL}/recipes/by-ingredient/${encodeURIComponent(ingredient)}`);
      if (!response.ok) {
        throw new Error('Failed to fetch recipes by ingredient');
      }
      return response.json();
    },
  },

  // Map API
  map: {
    async getRegions(): Promise<MapRegion[]> {
      const response = await fetch(`${API_BASE_URL}/map/regions`);
      if (!response.ok) {
        throw new Error('Failed to fetch map regions');
      }
      return response.json();
    },

    async getWeather(regionId: string): Promise<MapRegion['weatherData']> {
      const response = await fetch(`${API_BASE_URL}/map/weather/${regionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch weather for region ${regionId}`);
      }
      return response.json();
    },

    async getSoil(regionId: string): Promise<MapRegion['soilData']> {
      const response = await fetch(`${API_BASE_URL}/map/soil/${regionId}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch soil data for region ${regionId}`);
      }
      return response.json();
    },
  },

  // AI Classification API
  classification: {
    async classifyImage(imageFile: File): Promise<{ species: string; confidence: number }[]> {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await fetch(`${API_BASE_URL}/classify`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to classify image');
      }

      return response.json();
    },
  },
}; 