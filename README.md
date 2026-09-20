# Nubi Client

광주광역시 교통약자 이동지원 및 이동권 분석 플랫폼 **누비(NUBI)**의
시민용 Client입니다.

## 프로젝트 목적

Server API 계약과 공공데이터 조사가 진행되는 동안, 계약이 확정되는 즉시
기능 개발을 시작할 수 있는 안정적인 프론트엔드 기반을 준비합니다.

현재 목표 흐름은 다음과 같습니다.

출발지/목적지 → 주변 정류장 → 이용 가능한 대중교통 → 저상버스 정보 →
실시간 도착정보 → 이동경로

현재 단계에서는 실제 경로 알고리즘, 버스 API, 지도 Provider, 로그인과
기관용 분석 화면을 구현하지 않습니다.

## 요구사항

- Node.js 20.19 이상
- npm 10 이상

## 시작하기

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

macOS/Linux에서는 환경변수 파일 복사에 `cp .env.example .env.local`을
사용합니다.

## 환경변수

`.env.example`을 복사해 사용합니다.

| 변수                        | 설명                   | 기본값  |
| --------------------------- | ---------------------- | ------- |
| `VITE_API_BASE_URL`         | Server API base URL    | `/api`  |
| `VITE_MAP_PROVIDER_API_KEY` | 지도 Provider 키(선택) | 없음    |
| `VITE_API_TIMEOUT_MS`       | API 요청 timeout(ms)   | `10000` |

실제 키와 비밀값은 커밋하지 않습니다. 지도 Provider가 결정되기 전에는
키가 있어도 SDK를 활성화하지 않습니다.

## 품질 검사

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

GitHub Actions에서도 install, lint, typecheck, test, build를 동일하게
실행합니다.

## 구조

- `src/app`: 애플리케이션 진입, Router, QueryClient, Error Boundary
- `src/pages`: 화면 단위 구성
- `src/shared/api`: endpoint 없는 공통 API Client와 query key 규칙
- `src/shared/map`: 좌표·viewport·marker와 Provider-neutral 지도 계층
- `src/shared/ui`: loading/error/empty 상태 표현

## 현재 개발 단계

- 초기 Bootstrap과 접근성을 고려한 모바일 우선 shell 완료
- Server API 계약 대기 중
- 지도 Provider 결정 및 실제 SDK 연결 대기 중
- 실제 시민용 이동 기능과 기관용 분석 기능은 미구현
