
export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface Restaurant {
  name: string;
  price: string | null;
  distance: number;
  travelTime: string;
  isOpen: boolean;
  isUpdatingPrice?: boolean;
}

export interface GeminiResponse {
  restaurants: Restaurant[];
  summary: string;
}