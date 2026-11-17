import type { ReactNode } from 'react';
import Link from 'next/link';
import './globals.css';

export const metadata = { title: 'WealthTrack', description: 'Personal wealth and portfolio tracker' };

const NAV = [
  ['/dashboard', 'Dashboard'],
  ['/portfolios', 'Portfolios'],
  ['/budgets', 'Budgets'],
  ['/goals', 'Goals'],
  ['/tax', 'Tax'],
  ['/alerts', 'Alerts'],
  ['/forecast', 'Forecast'],
] as const;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <nav className="sidebar">
          <h1>WealthTrack</h1>
          {NAV.map(([href, label]) => (
            <Link key={href} href={href}>{label}</Link>
          ))}
        </nav>
        <main className="content">{children}</main>
      </body>
    </html>
  );
}
