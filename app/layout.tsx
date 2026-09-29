import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Riyo Shooter',
  description: '3D mobile shooter — Riyo Shooter',
  manifest: '/manifest.json',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  minimumScale: 1,
  userScalable: false, // hard-disables pinch/double-tap zoom at the browser level
  viewportFit: 'cover', // required for safe-area-inset-* to work under notches
  themeColor: '#0a0a0f',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="app-root no-select viewport-lock">{children}</body>
    </html>
  );
}
