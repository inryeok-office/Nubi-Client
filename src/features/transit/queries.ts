import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../shared/api/queryKeys';
import type { Coordinate } from '../../shared/map/types';

import { getNearbyStops, getRoute, getStop, getStopArrivals } from './api';

const nearbyParams = {
  radiusMeters: 500,
  limit: 20,
} as const;

export function useNearbyStops(position: Coordinate | null) {
  const params = position ? { ...position, ...nearbyParams } : null;

  return useQuery({
    queryKey: params
      ? queryKeys.stops.nearby(params)
      : ['nubi', 'stops', 'nearby', 'idle'],
    queryFn: () => getNearbyStops(params!),
    enabled: params !== null,
    staleTime: 30_000,
  });
}

export function useStop(stopId: number | null) {
  return useQuery({
    queryKey:
      stopId === null
        ? ['nubi', 'stops', 'detail', 'idle']
        : queryKeys.stops.detail(stopId),
    queryFn: () => getStop(stopId!),
    enabled: stopId !== null,
    staleTime: 5 * 60_000,
  });
}

export function useStopArrivals(stopId: number | null) {
  return useQuery({
    queryKey:
      stopId === null
        ? ['nubi', 'stops', 'arrivals', 'idle']
        : queryKeys.stops.arrivals(stopId),
    queryFn: () => getStopArrivals(stopId!),
    enabled: stopId !== null,
    staleTime: 10_000,
    refetchInterval: 30_000,
  });
}

export function useRoute(routeId: number | null) {
  return useQuery({
    queryKey:
      routeId === null
        ? ['nubi', 'routes', 'idle']
        : queryKeys.routes.detail(routeId),
    queryFn: () => getRoute(routeId!),
    enabled: routeId !== null,
    staleTime: 5 * 60_000,
  });
}
