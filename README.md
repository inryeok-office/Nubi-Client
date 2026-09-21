# Nubi Client

광주광역시 교통약자 이동지원 및 이동권 분석 플랫폼 **누비(NUBI)**의
시민용 Client입니다.

## 현재 데모 흐름

현재 위치 → 주변 정류장 → 정류장 선택 → 실시간 도착 차량 → 저상버스
관찰 상태

Server 계약이 확정된 범위에서 첫 시민용 흐름을 구현하고 있습니다. 저상버스
표시는 조회 시점의 원천 관찰값이며, 휠체어 탑승 가능이나 운행 지속을
보장하지 않습니다.

## Server 계약

현재 `inryeok-office/Nubi-Server`의 `main` 문서와 Controller 기준으로
다음 endpoint만 사용합니다.

- `GET /api/v1/stops/nearby?latitude={lat}&longitude={lon}&radiusMeters=500&limit=20`
- `GET /api/v1/stops/{stopId}`
- `GET /api/v1/stops/{stopId}/arrivals`
- `GET /api/v1/routes/{routeId}`

도착정보의 `lowFloorStatus`는 `low-floor`, `standard`, `unknown` 중 하나이며,
응답의 `dataSource`, `fetchedAt`, `observedAt`를 함께 사용합니다.

## 요구사항

- Node.js 20.19 이상
- npm 10 이상

## 시작하기

```bash
npm install
cp .env.example .env.local
npm run dev
```

Windows PowerShell에서는 `Copy-Item .env.example .env.local`을 사용합니다.

개발 서버는 기본적으로 `/api` 요청을 `http://localhost:8080`으로 proxy합니다.
이는 Server에 CORS를 임의로 완화하지 않고 로컬 Client와 Server를 연결하기
위한 개발 편의 설정입니다.

## 환경변수

| 변수                        | 설명                          | 기본값                  |
| --------------------------- | ----------------------------- | ----------------------- |
| `VITE_API_BASE_URL`         | Server API base URL           | `/api`                  |
| `VITE_API_PROXY_TARGET`     | Vite 개발 proxy 대상          | `http://localhost:8080` |
| `VITE_MAP_PROVIDER_API_KEY` | 지도 Provider 키(현재 미사용) | 없음                    |
| `VITE_API_TIMEOUT_MS`       | API 요청 timeout(ms)          | `10000`                 |

실제 Key와 Secret은 커밋하지 않습니다. 지도 Provider가 확정되기 전에는
`VITE_MAP_PROVIDER_API_KEY`가 있어도 SDK를 활성화하지 않습니다.

## 품질 검사

```bash
npm run format:check
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions에서도 install, lint, typecheck, test, build를 실행합니다.

## 구조

- `src/app`: Router, QueryClient, Error Boundary
- `src/features/location`: 브라우저 Geolocation 상태와 오류 처리
- `src/features/transit`: Server 계약 타입, API 함수, Query hook, 정류장/도착정보 UI
- `src/pages`: 화면 단위 구성
- `src/shared/api`: 공통 API Client와 query key 규칙
- `src/shared/map`: 좌표·viewport·marker와 Provider-neutral 지도 계층
- `src/shared/ui`: loading/error/empty 상태 표현

## 아직 구현하지 않은 기능

- 지도 Provider SDK 연결
- 완전한 출발지/목적지 경로 추천
- 탑승 가능 보장 또는 자체 접근성 점수
- 로그인, 개인정보 저장, 즐겨찾기, 알림
- 기관용 분석 대시보드
