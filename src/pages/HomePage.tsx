import { MapContainer } from '../shared/map/MapContainer';
import { StatusPanel } from '../shared/ui/StatusPanel';

export function HomePage() {
  return (
    <main className="page-shell">
      <header className="app-header">
        <div>
          <p className="eyebrow">광주광역시 이동지원 플랫폼</p>
          <h1>누비</h1>
        </div>
        <span className="status-badge">기반 준비 중</span>
      </header>

      <section className="intro" aria-labelledby="intro-title">
        <p className="eyebrow">시민용 서비스</p>
        <h2 id="intro-title">편안한 이동을 위한 첫 화면</h2>
        <p>
          출발지와 목적지를 정하면 주변 정류장과 이동 정보를 확인할 수 있도록
          준비하고 있어요.
        </p>
      </section>

      <section className="location-card" aria-label="이동 장소 입력">
        <div className="location-field">
          <span
            className="location-dot location-dot--start"
            aria-hidden="true"
          />
          <div>
            <span className="field-label">출발지</span>
            <span className="field-placeholder">출발지를 선택해 주세요</span>
          </div>
        </div>
        <div className="location-divider" aria-hidden="true" />
        <div className="location-field">
          <span className="location-dot location-dot--end" aria-hidden="true" />
          <div>
            <span className="field-label">목적지</span>
            <span className="field-placeholder">목적지를 선택해 주세요</span>
          </div>
        </div>
      </section>

      <MapContainer />

      <StatusPanel
        kind="empty"
        title="이동 정보가 아직 준비되지 않았어요"
        description="Server API와 지도 Provider가 연결되면 주변 정류장과 대중교통 정보를 여기에서 확인할 수 있어요."
      />
    </main>
  );
}
