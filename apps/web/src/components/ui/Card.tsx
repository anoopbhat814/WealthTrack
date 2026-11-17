import type { ReactNode } from 'react';

interface CardProps {
  title?: string;
  action?: ReactNode;
  children: ReactNode;
}

export function Card({ title, action, children }: CardProps) {
  return (
    <section className="card">
      {(title || action) && (
        <header className="card__header">
          {title && <h3>{title}</h3>}
          {action}
        </header>
      )}
      <div className="card__body">{children}</div>
    </section>
  );
}
