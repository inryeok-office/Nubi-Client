export type Coordinate = {
  latitude: number;
  longitude: number;
};

export type MapViewport = Coordinate & {
  zoom?: number;
};

export type MapMarker = {
  id: string;
  position: Coordinate;
  label?: string;
};

export type MapProviderAdapter = {
  name: string;
  isAvailable: boolean;
};
