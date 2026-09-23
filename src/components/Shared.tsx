import type { ReactNode } from 'react';
import { Icon, type IconName } from './icons';

export function EmptyState({
  icon,
  title,
  message,
  action,
}: {
  icon: IconName;
  title: string;
  message: string;
  action?: ReactNode;
}) {
  return (
    <div className="empty-state glass">
      <Icon name={icon} size={46} />
      <h3>{title}</h3>
      <p>{message}</p>
      {action}
    </div>
  );
}

export function Alert({
  kind,
  title,
  children,
}: {
  kind: 'info' | 'ok' | 'danger';
  title?: string;
  children: ReactNode;
}) {
  const icon: IconName = kind === 'ok' ? 'check' : kind === 'danger' ? 'alert' : 'info';
  return (
    <div className={`alert alert--${kind}`} role={kind === 'danger' ? 'alert' : 'status'}>
      <Icon name={icon} size={19} />
      <div>
        {title && <strong>{title}</strong>}
        {title && ' '}
        {children}
      </div>
    </div>
  );
}

export function TypePill({ type }: { type: string }) {
  return <span className="chip chip--blue">{type}</span>;
}

export function StatusChip({ status }: { status: string }) {
  const classByStatus: Record<string, string> = {
    Open: 'chip--ok',
    Upcoming: 'chip--blue',
    Ongoing: 'chip--warn',
    Filled: 'chip',
    Past: 'chip',
  };
  return (
    <span className={`chip ${classByStatus[status] ?? ''}`}>
      <span className="badge-dot" />
      {status}
    </span>
  );
}