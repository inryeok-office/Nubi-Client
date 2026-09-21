import { requestJson } from '../../shared/api/client';

import type {
  ArrivalsResponse,
  BusRoute,
  BusStop,
  NearbyStopsResponse,
} from './types';

type NearbyStopsParams = {
  latitude: number;
  longitude: number;
  radiusMeters?: number;
  limit?: number;
};

export function getNearbyStops({
  latitude,
  longitude,
  radiusMeters = 500,
  limit = 20,
}: NearbyStopsParams) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    radiusMeters: String(radiusMeters),
    limit: String(limit),
  });

  return requestJson<NearbyStopsResponse>(`v1/stops/nearby?${params}`);
}

export function getStop(stopId: number) {
  return requestJson<BusStop>(`v1/stops/${stopId}`);
}

export function getStopArrivals(stopId: number) {
  return requestJson<ArrivalsResponse>(`v1/stops/${stopId}/arrivals`);
}

export function getRoute(routeId: number) {
  return requestJson<BusRoute>(`v1/routes/${routeId}`);
}
