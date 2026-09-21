import type { Coordinate } from '../../shared/map/types';

export type BusStop = Coordinate & {
  stopId: number;
  arsId: string | null;
  name: string;
};

export type NearbyBusStop = {
  stop: BusStop;
  distanceMeters: number;
};

export type NearbyStopsResponse = {
  latitude: number;
  longitude: number;
  radiusMeters: number;
  stops: NearbyBusStop[];
};

export type LowFloorStatus = 'low-floor' | 'standard' | 'unknown';

export type BusArrival = {
  routeId: number;
  routeName: string | null;
  vehicleId: string | null;
  remainingMinutes: number | null;
  remainingStops: number | null;
  lowFloorStatus: LowFloorStatus;
  currentStopId: number | null;
  observedAt: string;
};

export type ArrivalsResponse = {
  stopId: number;
  dataSource: string;
  fetchedAt: string;
  arrivals: BusArrival[];
};

export type BusRoute = {
  routeId: number;
  name: string;
  upwardDestination: string | null;
  downwardDestination: string | null;
  typeCode: string | null;
};
