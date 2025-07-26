'use client';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function GameOver() {
  const router = useRouter();
  const [score, setScore] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem('score');
    if (stored) setScore(Number(stored));
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
      <h1 className="text-4xl mb-4 font-bold">Game Over</h1>
      <p className="text-2xl mb-8">Your Score: {score}</p>
      <button
        onClick={() => {
          if (typeof window !== 'undefined') {
            sessionStorage.setItem('pacman-session', '1');
          }
          router.push('/game');
        }}
        className="px-6 py-3 bg-yellow-400 text-black font-bold rounded hover:bg-yellow-300"
      >
        Play Again
      </button>
    </div>
  );
}
