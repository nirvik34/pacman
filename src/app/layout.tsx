import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Pac-Man',
  description: 'A simple 3D Pac-Man Game in Next.js + Three.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
