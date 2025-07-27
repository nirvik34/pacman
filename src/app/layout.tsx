import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '3D Pac-Man',
  description: 'A simple 3D Pac-Man Game',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className="bg-black text-white font-sans">
        <main>{children}</main>
      </body>
    </html>
  );
}
