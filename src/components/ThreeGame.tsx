'use client';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

type PacManProps = {
  position: [number, number, number];
};
function PacMan({ position }: PacManProps) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(...position);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="yellow" />
    </mesh>
  );
}
type GhostProps = {
  pacPos: [number, number, number];
  position: [number, number, number];
};
function Ghost({ pacPos, position }: GhostProps) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame(() => {
    if (ref.current) {
      ref.current.position.set(...position);
    }
  });
  return (
    <mesh ref={ref}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial color="red" />
    </mesh>
  );
}

const MAZE = [
  [1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 1, 0, 1],
  [1, 1, 1, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1],
];

function MazeWalls() {
  const blocks = [];

  for (let z = 0; z < MAZE.length; z++) {
    for (let x = 0; x < MAZE[z].length; x++) {
      if (MAZE[z][x] === 1) {
        blocks.push(
          <mesh key={`${x}-${z}`} position={[x, 1, z]}>
            <boxGeometry args={[1, 2, 1]} />
            <meshStandardMaterial color="blue" />
          </mesh>
        );
      }
    }
  }

  return <>{blocks}</>;
}


export default function ThreeGame() {
  const [score, setScore] = useState(0);
  const router = useRouter();
  // Pac-Man and Ghost positions
  const [pacPos, setPacPos] = useState<[number, number, number]>([1, 1, 1]);
  const [ghostPos, setGhostPos] = useState<[number, number, number]>([5, 1, 5]);
  
  const [dots, setDots] = useState(() =>
    MAZE.map((row, z) => row.map((cell, x) => cell === 0 && !(x === 1 && z === 1)))
  );

  const [gameWon, setGameWon] = useState(false);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!sessionStorage.getItem('pacman-session')) {
        router.replace('/');
      } else {
        // Remove session flag if game is won
        if (gameWon) sessionStorage.removeItem('pacman-session');
      }
    }
  }, [router, gameWon]);

  // Set session flag on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('pacman-session', '1');
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const [x, y, z] = pacPos;
      let nx = x, nz = z;
      switch (e.key) {
        case 'ArrowUp':
        case 'w':
          nz = z - 1;
          break;
        case 'ArrowDown':
        case 's':
          nz = z + 1;
          break;
        case 'ArrowLeft':
        case 'a':
          nx = x - 1;
          break;
        case 'ArrowRight':
        case 'd':
          nx = x + 1;
          break;
        default:
          return;
      }
      // Check wall collision
      if (MAZE[nz] && MAZE[nz][nx] === 0) {
        setPacPos([nx, y, nz]);
        // Eat dot if present
        setDots(prev => {
          if (prev[nz][nx]) {
            const newDots = prev.map(row => [...row]);
            newDots[nz][nx] = false;
            setScore(s => s + 1);
            // Win if all dots eaten
            if (newDots.flat().filter(Boolean).length === 0) {
              setGameWon(true);
            }
            return newDots;
          }
          return prev;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pacPos, router, score]);

  // Ghost AI movement
  useEffect(() => {
    const interval = setInterval(() => {
      const [px, , pz] = pacPos;
      let [gx, gy, gz] = ghostPos;
      // Simple chase: move closer in x or z, avoid walls
      let options: [number, number][] = [];
      if (gx < px && MAZE[gz][gx + 1] === 0) options.push([gx + 1, gz]);
      if (gx > px && MAZE[gz][gx - 1] === 0) options.push([gx - 1, gz]);
      if (gz < pz && MAZE[gz + 1][gx] === 0) options.push([gx, gz + 1]);
      if (gz > pz && MAZE[gz - 1][gx] === 0) options.push([gx, gz - 1]);
      
      if (options.length > 0) {
        [gx, gz] = options[0];
      }
      setGhostPos([gx, gy, gz]);
      
      if (gx === px && gz === pz) {
        localStorage.setItem('score', score.toString());
        if (typeof window !== 'undefined') sessionStorage.removeItem('pacman-session');
        router.push('/game-over');
      }
    }, 500);
    return () => clearInterval(interval);
  }, [pacPos, ghostPos, router, score]);

  
  const Dots = () => (
    <>
      {dots.map((row, z) =>
        row.map((hasDot, x) =>
          hasDot ? (
            <mesh key={`dot-${x}-${z}`} position={[x, 1, z]}>
              <sphereGeometry args={[0.15, 8, 8]} />
              <meshStandardMaterial color="white" />
            </mesh>
          ) : null
        )
      )}
    </>
  );

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div style={{
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
        background: 'rgba(0,0,0,0.6)',
        color: 'white',
        padding: '8px 16px',
        borderRadius: 8,
        fontSize: 20,
        fontFamily: 'monospace',
        userSelect: 'none',
      }}>
        Score: {score}
      </div>
      {gameWon && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'rgba(0,0,0,0.8)',
          color: '#ffe066',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 48,
          fontWeight: 'bold',
          zIndex: 100,
          flexDirection: 'column',
          letterSpacing: 2,
          textShadow: '0 2px 16px #000',
        }}>
          Game Won!
          <div style={{ fontSize: 24, color: '#fff', marginTop: 16 }}>You ate all the dots!</div>
        </div>
      )}
      <Canvas camera={{ position: [3, 10, 10], fov: 60 }}>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <MazeWalls />
        <Dots />
        <PacMan position={pacPos} />
        <Ghost pacPos={pacPos} position={ghostPos} />
        <OrbitControls />
      </Canvas>
    </div>
  );
}
