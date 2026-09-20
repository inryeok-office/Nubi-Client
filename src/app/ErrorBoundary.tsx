import { Component, type ErrorInfo, type ReactNode } from 'react';

type ErrorBoundaryProps = { children: ReactNode };
type ErrorBoundaryState = { hasError: boolean };

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Unhandled application error', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="page-shell page-shell--centered">
          <section className="status-panel" role="alert">
            <p className="eyebrow">누비</p>
            <h1>화면을 불러오지 못했어요.</h1>
            <p>잠시 후 다시 시도해 주세요.</p>
            <button
              className="button button--primary"
              onClick={() => window.location.reload()}
            >
              다시 불러오기
            </button>
          </section>
        </main>
      );
    }

    return this.props.children;
  }
}
