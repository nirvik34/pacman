'use client';
import dynamic from 'next/dynamic';

const ThreeGame = dynamic(() => import('@/components/ThreeGame'), { ssr: false });

export default function GamePage() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <ThreeGame />
    </div>
  );
}
