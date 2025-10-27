'use client'

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  delay: number;
  duration: number;
  opacity: number;
}

interface CircuitLine {
  id: number;
  height: number;
  left: number;
  top: number;
  rotation: number;
  duration: number;
}

interface DataStreamLine {
  id: number;
  top: number;
  opacity: number;
  duration: number;
  delay: number;
}

export default function PortalTransition() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  // Generate particles on client side to avoid hydration mismatch
  const [particles, setParticles] = useState<Particle[]>([]);
  const [circuitLines, setCircuitLines] = useState<CircuitLine[]>([]);
  const [dataStreamLines, setDataStreamLines] = useState<DataStreamLine[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Generate particles
    const newParticles: Particle[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      size: Math.random() * 3 + 1,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      duration: Math.random() * 2 + 2,
      opacity: Math.random() * 0.6 + 0.2,
    }));
    setParticles(newParticles);

    // Generate circuit lines
    const newLines: CircuitLine[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      height: Math.random() * 200 + 100,
      left: Math.random() * 100,
      top: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: Math.random() * 2 + 1,
    }));
    setCircuitLines(newLines);

    // Generate data stream lines
    const newDataStreams: DataStreamLine[] = Array.from({ length: 8 }, (_, i) => ({
      id: i,
      top: Math.random() * 100,
      opacity: Math.random() * 0.5 + 0.3,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setDataStreamLines(newDataStreams);
  }, []);

  useEffect(() => {
    if (!containerRef.current || !isMounted) return;

    const ctx = gsap.context(() => {
      // Main timeline untuk scroll-triggered animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=150%',
          scrub: 1.5,
          pin: true,
        },
      });

      // Grid expands and zooms in
      tl.to(gridRef.current, {
        scale: 5,
        z: 2000,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.inOut',
      }, 0);

      // Particles rush forward
      tl.to(particlesRef.current, {
        z: 3000,
        opacity: 0,
        duration: 1.2,
        ease: 'power2.in',
      }, 0);

      // Center expands (zoom in effect)
      tl.to(centerRef.current, {
        scale: 25,
        opacity: 0,
        duration: 1.2,
        ease: 'power3.inOut',
      }, 0.2);

      // Text fades out with scale
      tl.to(textRef.current, {
        opacity: 0,
        scale: 2,
        z: -1000,
        duration: 0.8,
        ease: 'power2.in',
      }, 0);

      // Entire container fades out - overlapping with hero fade in
      tl.to(containerRef.current, {
        opacity: 0,
        duration: 0.8,
        ease: 'power2.inOut',
      }, 0.6);

    }, containerRef);

    return () => ctx.revert();
  }, [particles, circuitLines, dataStreamLines, isMounted]);

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full relative flex items-center justify-center overflow-hidden"
      style={{
        perspective: '1000px',
        background: 'radial-gradient(circle at center, #001a33, #000000)',
      }}
    >
      {/* Animated wireframe grid - system theme */}
      <div
        ref={gridRef}
        className="absolute inset-0"
        style={{
          transformStyle: 'preserve-3d',
          background: `
            linear-gradient(0deg, transparent 24%, rgba(0, 212, 255, 0.15) 25%, rgba(0, 212, 255, 0.15) 26%, transparent 27%, transparent),
            linear-gradient(90deg, transparent 24%, rgba(0, 212, 255, 0.15) 25%, rgba(0, 212, 255, 0.15) 26%, transparent 27%, transparent)
          `,
          backgroundSize: '60px 60px',
          backgroundPosition: 'center center',
        }}
      />

      {/* Digital particles rushing forward - only render when mounted */}
      {isMounted && (
        <>
          <div
            ref={particlesRef}
            className="absolute inset-0"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute bg-cyan-400 rounded-sm"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: `${particle.left}%`,
                  top: `${particle.top}%`,
                  animation: `particleRush ${particle.duration}s linear ${particle.delay}s infinite`,
                  opacity: particle.opacity,
                  boxShadow: '0 0 4px rgba(0, 212, 255, 0.8)',
                }}
              />
            ))}
          </div>

          {/* Circuit lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {circuitLines.map((line) => (
              <div
                key={line.id}
                className="absolute"
                style={{
                  width: '2px',
                  height: `${line.height}px`,
                  left: `${line.left}%`,
                  top: `${line.top}%`,
                  background: 'linear-gradient(to bottom, transparent, rgba(0, 212, 255, 0.5), transparent)',
                  transform: `rotate(${line.rotation}deg)`,
                  animation: `pulse ${line.duration}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </>
      )}

      {/* Center glow effect */}
      <div
        ref={centerRef}
        className="absolute w-96 h-96 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0, 212, 255, 0.3), rgba(0, 153, 255, 0.1), transparent)',
          filter: 'blur(40px)',
        }}
      />

      {/* Hexagon tech pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="hexagons" x="0" y="0" width="50" height="43.4" patternUnits="userSpaceOnUse">
              <polygon points="24.8,22 37.3,29.2 37.3,43.7 24.8,50.9 12.3,43.7 12.3,29.2" 
                fill="none" stroke="rgba(0, 212, 255, 0.3)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagons)" />
        </svg>
      </div>

      {/* Center text */}
      <div
        ref={textRef}
        className="absolute z-10 text-center"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <h2 className="text-4xl md:text-6xl font-bold mb-4 text-white">
          Entering System
        </h2>
        <div className="flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-100" />
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse delay-200" />
        </div>
      </div>

      {/* Data stream lines - only render when mounted */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {dataStreamLines.map((stream) => (
            <div
              key={stream.id}
              className="absolute h-px w-full"
              style={{
                top: `${stream.top}%`,
                background: `linear-gradient(to right, transparent, rgba(0, 212, 255, ${stream.opacity}), transparent)`,
                animation: `slideRight ${stream.duration}s linear ${stream.delay}s infinite`,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
