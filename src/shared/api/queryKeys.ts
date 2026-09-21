export const queryKeys = {
  all: ['nubi'] as const,
  stops: {
    nearby: (params: {
      latitude: number;
      longitude: number;
      radiusMeters: number;
      limit: number;
    }) => ['nubi', 'stops', 'nearby', params] as const,
    detail: (stopId: number) => ['nubi', 'stops', stopId] as const,
    arrivals: (stopId: number) =>
      ['nubi', 'stops', stopId, 'arrivals'] as const,
  },
  routes: {
    detail: (routeId: number) => ['nubi', 'routes', routeId] as const,
  },
};
