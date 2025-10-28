'use client'

import { useEffect, useState, useRef } from 'react';

interface Trail {
  x: number;
  y: number;
  id: number;
}

export default function CustomCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [trails, setTrails] = useState<Trail[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const trailIdRef = useRef(0);

  useEffect(() => {
    setIsMounted(true);

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });

      // Add trail
      const newTrail: Trail = {
        x: e.clientX,
        y: e.clientY,
        id: trailIdRef.current++,
      };

      setTrails((prev) => {
        const updated = [...prev, newTrail];
        // Keep only last 15 trails
        return updated.slice(-15);
      });
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.style.cursor === 'pointer'
      ) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  // Auto remove trails
  useEffect(() => {
    if (trails.length > 0) {
      const timer = setTimeout(() => {
        setTrails((prev) => prev.slice(1));
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [trails]);

  if (!isMounted) return null;

  return (
    <>
      {/* Hide default cursor */}
      <style jsx global>{`
        * {
          cursor: none !important;
        }
        a, button, [role="button"] {
          cursor: none !important;
        }
      `}</style>

      {/* Trail Effect */}
      {trails.map((trail, index) => {
        const opacity = (index + 1) / trails.length;
        const scale = 0.3 + (index / trails.length) * 0.7;
        
        return (
          <div
            key={trail.id}
            className="fixed pointer-events-none z-[9999] mix-blend-screen"
            style={{
              left: `${trail.x}px`,
              top: `${trail.y}px`,
              transform: `translate(-10%, -10%) scale(${scale})`,
              opacity: opacity * 0.5,
            }}
          >
            {/* Trail mini arrow */}
            <svg
              width="20"
              height="20"
              viewBox="0 0 32 32"
              style={{
                filter: 'drop-shadow(0 0 4px rgba(0, 212, 255, 0.6))',
              }}
            >
              {/* Simplified arrow for trail */}
              <path
                d="M 4 4 L 4 22 L 11 15 L 14 18 L 18 14 L 15 11 L 22 4 Z"
                fill="none"
                stroke="rgba(0, 212, 255, 0.6)"
                strokeWidth="1.5"
              />
              
              {/* Glow center */}
              <circle cx="10" cy="10" r="2" fill="rgba(0, 255, 255, 0.4)" />
            </svg>
          </div>
        );
      })}

      {/* Main Cursor - 3D Wireframe Arrow */}
      <div
        className="fixed pointer-events-none z-[10000] transition-transform duration-100 ease-out"
        style={{
          left: `${mousePosition.x}px`,
          top: `${mousePosition.y}px`,
          transform: `translate(-10%, -10%) scale(${isHovering ? 1.3 : 1})`,
        }}
      >
        <div className="relative" style={{ perspective: '800px' }}>
          {/* Main 3D Arrow Shape */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            className="relative"
            style={{
              filter: 'drop-shadow(0 0 8px rgba(0, 212, 255, 0.8)) drop-shadow(0 4px 6px rgba(0, 0, 0, 0.4))',
              transform: 'rotateX(10deg) rotateY(-10deg)',
              transformStyle: 'preserve-3d',
            }}
          >
            {/* Shadow layer (3D depth) */}
            <path
              d="M 4 4 L 4 22 L 11 15 L 14 18 L 18 14 L 15 11 L 22 4 Z"
              fill="rgba(0, 0, 0, 0.3)"
              transform="translate(1.5, 1.5)"
            />
            
            {/* Main arrow body - gradient fill */}
            <defs>
              <linearGradient id="arrowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#0099ff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#0066ff" stopOpacity="0.7" />
              </linearGradient>
              
              <linearGradient id="arrowGradient2" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#00ffff" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#00d4ff" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            
            {/* Back face (darker) */}
            <path
              d="M 4 4 L 4 22 L 11 15 L 14 18 L 18 14 L 15 11 L 22 4 Z"
              fill="url(#arrowGradient2)"
              opacity="0.5"
              transform="translate(0.5, 0.5)"
            />
            
            {/* Front face */}
            <path
              d="M 4 4 L 4 22 L 11 15 L 14 18 L 18 14 L 15 11 L 22 4 Z"
              fill="url(#arrowGradient)"
            />
            
            {/* Wireframe edges for 3D effect */}
            <path
              d="M 4 4 L 4 22 L 11 15 L 14 18 L 18 14 L 15 11 L 22 4 Z"
              fill="none"
              stroke="#00ffff"
              strokeWidth="1"
              strokeOpacity="0.8"
            />
            
            {/* Inner highlight lines */}
            <line x1="4" y1="4" x2="4" y2="16" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.6" />
            <line x1="4" y1="4" x2="16" y2="4" stroke="#ffffff" strokeWidth="0.5" strokeOpacity="0.6" />
            
            {/* Corner highlights for 3D depth */}
            <circle cx="4" cy="4" r="1.5" fill="#00ffff" opacity="0.8" />
            <circle cx="22" cy="4" r="1" fill="#00ffff" opacity="0.6" />
            <circle cx="4" cy="22" r="1" fill="#00ffff" opacity="0.6" />
            
            {/* Scanning line effect on arrow */}
            <line 
              x1="4" y1="8" x2="18" y2="8" 
              stroke="rgba(0, 255, 255, 0.6)" 
              strokeWidth="0.5"
              className="animate-scan-line"
            />
          </svg>
          
          {/* Wireframe outline layers for 3D depth */}
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            className="absolute top-0 left-0"
            style={{
              transform: 'translateZ(2px)',
              opacity: 0.4,
            }}
          >
            <path
              d="M 4 4 L 4 22 L 11 15 L 14 18 L 18 14 L 15 11 L 22 4 Z"
              fill="none"
              stroke="#00d4ff"
              strokeWidth="0.5"
              strokeDasharray="2,2"
            />
          </svg>
          
          {/* Grid lines for tech feel */}
          <div className="absolute top-0 left-0 w-8 h-8 opacity-20">
            <div className="absolute top-0 left-0 w-full h-px bg-cyan-400" />
            <div className="absolute top-2 left-0 w-full h-px bg-cyan-400" />
            <div className="absolute top-0 left-0 w-px h-full bg-cyan-400" />
            <div className="absolute top-0 left-2 w-px h-full bg-cyan-400" />
          </div>
          
          {/* Pulsing ring effect */}
          <div 
            className="absolute -top-1 -left-1 w-10 h-10 border border-cyan-400/30 rounded-full animate-ping"
            style={{ animationDuration: '2s' }}
          />
        </div>

        {/* Hover state - additional effects */}
        {isHovering && (
          <>
            {/* Expanding rings */}
            <div 
              className="absolute top-0 left-0 w-8 h-8 border-2 border-cyan-400/40 rounded-full animate-ping"
              style={{ animationDuration: '1s' }}
            />
            <div className="absolute -top-2 -left-2 w-12 h-12 border border-cyan-400/20 rounded-full" />
            
            {/* Corner brackets on hover */}
            <div className="absolute -top-2 -left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
            <div className="absolute -top-2 right-6 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
            <div className="absolute bottom-6 -left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
          </>
        )}
      </div>

      {/* Add scanning animation */}
      <style jsx>{`
        @keyframes scan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(200%);
            opacity: 0;
          }
        }
        
        @keyframes scan-line {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(20px);
            opacity: 0;
          }
        }
        
        .animate-scan-line {
          animation: scan-line 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}
