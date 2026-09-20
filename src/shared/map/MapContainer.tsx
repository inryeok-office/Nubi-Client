import type { MapMarker, MapProviderAdapter, MapViewport } from './types';

type MapContainerProps = {
  viewport?: MapViewport;
  markers?: MapMarker[];
  currentLocation?: MapViewport;
  provider?: MapProviderAdapter;
  onViewportChange?: (viewport: MapViewport) => void;
};

const defaultProvider: MapProviderAdapter = {
  name: '미정 지도 Provider',
  isAvailable: false,
};

export function MapContainer({
  viewport,
  markers = [],
  currentLocation,
  provider = defaultProvider,
  onViewportChange,
}: MapContainerProps) {
  void viewport;
  void currentLocation;
  void onViewportChange;

  return (
    <section className="map-container" aria-label="지도 영역" role="region">
      <div className="map-grid" aria-hidden="true" />
      <div className="map-placeholder">
        <span className="map-icon" aria-hidden="true">
          ◉
        </span>
        <h2>지도 영역</h2>
        <p>
          {provider.isAvailable
            ? `${provider.name} 연결을 준비하고 있어요.`
            : '지도 Provider가 결정되면 주변 정류장을 표시할 수 있어요.'}
        </p>
        {markers.length > 0 && (
          <p className="map-marker-count">표시할 위치 {markers.length}곳</p>
        )}
      </div>
    </section>
  );
}
