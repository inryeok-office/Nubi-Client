import type { ReactNode } from 'react';

type StatusKind = 'loading' | 'error' | 'empty';

type StatusPanelProps = {
  kind: StatusKind;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function StatusPanel({
  kind,
  title,
  description,
  action,
}: StatusPanelProps) {
  return (
    <section className={`status-panel status-panel--${kind}`} role="status">
      <span className="status-panel__icon" aria-hidden="true">
        {kind === 'loading' ? '…' : kind === 'error' ? '!' : 'i'}
      </span>
      <div>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
        {action}
      </div>
    </section>
  );
}
