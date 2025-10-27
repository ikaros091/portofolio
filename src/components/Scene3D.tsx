'use client'

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface FloatingParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
  opacity: number;
}

export default function Scene3D() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  
  const [isDragging, setIsDragging] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Generate particles on mount
  useEffect(() => {
    setIsMounted(true);
    
    const newParticles: FloatingParticle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      duration: 3 + Math.random() * 4,
      delay: Math.random() * 3,
      opacity: Math.random() * 0.5 + 0.3,
    }));
    setParticles(newParticles);
  }, []);

  useEffect(() => {
    if (glowRef.current) {
      // Glow pulse animation only
      gsap.to(glowRef.current, {
        opacity: 0.6,
        scale: 1.05,
        duration: 2,
        ease: 'power1.inOut',
        repeat: -1,
        yoyo: true,
      });
    }
  }, []);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isDragging || !containerRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const frameWidth = 320 * scale;
      const frameHeight = 400 * scale;

      // Calculate boundaries - frame harus tetap dalam container
      const maxX = (containerRect.width - frameWidth) / 2;
      const maxY = (containerRect.height - frameHeight) / 2;

      let newX = e.clientX - dragStart.x;
      let newY = e.clientY - dragStart.y;

      // Constrain position within container boundaries
      newX = Math.max(-maxX, Math.min(maxX, newX));
      newY = Math.max(-maxY, Math.min(maxY, newY));

      setPosition({ x: newX, y: newY });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleGlobalMouseMove);
      window.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, scale]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    
    if (!containerRef.current) return;
    
    const containerRect = containerRef.current.getBoundingClientRect();
    const baseWidth = 320;
    const baseHeight = 400;
    
    // Calculate max scale to fit container (mentok sama background)
    const maxScaleX = containerRect.width / baseWidth;
    const maxScaleY = containerRect.height / baseHeight;
    const maxScale = Math.min(maxScaleX, maxScaleY) * 0.95; // 95% to leave small margin
    
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.max(1, Math.min(maxScale, scale + delta)); // min 1 (size awal), max sampai mentok
    
    setScale(newScale);

    // Adjust position to keep within boundaries when scaling
    const frameWidth = baseWidth * newScale;
    const frameHeight = baseHeight * newScale;
    const maxX = (containerRect.width - frameWidth) / 2;
    const maxY = (containerRect.height - frameHeight) / 2;

    setPosition({
      x: Math.max(-maxX, Math.min(maxX, position.x)),
      y: Math.max(-maxY, Math.min(maxY, position.y)),
    });
  };

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center relative"
    >
      {/* Background glow effect */}
      <div
        ref={glowRef}
        className="absolute w-[400px] h-[500px] rounded-3xl opacity-40 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, rgba(0,153,255,0.2) 50%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Main photo container with 3D effect - DRAGGABLE */}
      <div
        ref={imageRef}
        className="relative cursor-grab active:cursor-grabbing select-none"
        style={{
          width: '320px',
          height: '400px',
          perspective: '1000px',
          transformStyle: 'preserve-3d',
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
          transition: isDragging ? 'none' : 'transform 0.2s ease-out',
        }}
        onMouseDown={handleMouseDown}
        onWheel={handleWheel}
      >
        {/* Outer neon glow border */}
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, #00d4ff, #0099ff)',
            padding: '3px',
            transform: 'translateZ(-20px)',
          }}
        >
          {/* Middle border */}
          <div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(135deg, rgba(0,212,255,0.5), rgba(0,153,255,0.5))',
              filter: 'blur(8px)',
            }}
          />
        </div>

        {/* Photo frame */}
        <div className="relative w-full h-full rounded-2xl overflow-hidden border-4 border-cyan-400/30 shadow-[0_0_30px_rgba(0,212,255,0.5)] pointer-events-none">
          <Image
            src="/MyPhoto.png"
            alt="Profile Photo"
            fill
            className="object-cover select-none"
            priority
            draggable={false}
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-cyan-900/20 via-transparent to-cyan-900/20" />
        </div>

        {/* Corner decorations */}
        <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-cyan-400 rounded-tl-lg pointer-events-none" />
        <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-cyan-400 rounded-tr-lg pointer-events-none" />
        <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-cyan-400 rounded-bl-lg pointer-events-none" />
        <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-cyan-400 rounded-br-lg pointer-events-none" />
      </div>

      {/* Floating particles effect using CSS - only render when mounted */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute bg-cyan-400 rounded-full"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                animation: `float ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                opacity: particle.opacity,
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
