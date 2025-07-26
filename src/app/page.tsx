'use client';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute left-1/2 top-1/3 -translate-x-1/2 w-[400px] h-[400px] bg-yellow-400 opacity-20 blur-3xl rounded-full animate-pulse" />
        <div className="absolute right-10 bottom-10 w-40 h-40 bg-blue-500 opacity-10 blur-2xl rounded-full" />
      </div>
      {/* Pac-Man Icon from SVG file */}
      <div className="mb-8 z-10">
        <svg width="100" height="100" viewBox="0 0 496.2 496.2" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
          <path style={{ fill: '#EA4949' }} d="M496.2,248.1C496.2,111.1,385.1,0,248.1,0S0,111.1,0,248.1s111.1,248.1,248.1,248.1 S496.2,385.1,496.2,248.1z" />
          <path style={{ fill: '#EFCE2B' }} d="M399.7,158.5C369,106.7,312.6,72,248.1,72C150.9,72,72,150.8,72,248.1c0,97.2,78.8,176.1,176.1,176.1 c64.5,0,120.9-34.7,151.5-86.4l-152.8-89.6L399.7,158.5z M225,157.4c0-12,9.7-21.8,21.8-21.8c12.1,0,21.8,9.7,21.8,21.8 s-9.7,21.8-21.8,21.8S225,169.4,225,157.4z" />
        </svg>
      </div>
      <h1 className="text-5xl font-extrabold mb-6 text-yellow-300 drop-shadow-lg z-10 tracking-tight">3D Pac-Man</h1>
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('pacman-session', '1');
          }
          router.push('/game');
        }}
        className="relative z-10 flex items-center gap-4 px-10 py-5 rounded-full bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 shadow-2xl border-2 border-yellow-200/60 hover:from-yellow-400 hover:to-yellow-300 hover:scale-105 active:scale-95 transition-all duration-200 text-2xl font-extrabold text-black tracking-wide outline-none focus:ring-4 focus:ring-yellow-500/50 backdrop-blur-md"
        style={{ boxShadow: '0 4px 32px 0 #ffe06699, 0 1.5px 0 #fff inset' }}
      >
        
        <span className="drop-shadow">Play Game</span>
      </button>
    </div>
  );
}
