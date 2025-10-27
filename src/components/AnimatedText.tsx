'use client'

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function AnimatedText() {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);
  const roles = ['Fullstack Developer', 'Frontend Developer', 'Backend Developer'];
  const currentRoleIndex = useRef(0);

  useEffect(() => {
    // Animate name entrance
    if (nameRef.current) {
      gsap.fromTo(
        nameRef.current,
        { opacity: 0, x: -100 },
        { opacity: 1, x: 0, duration: 1.5, ease: 'power3.out' }
      );
    }

    // Animate role text rotation
    const animateRole = () => {
      if (roleRef.current) {
        const currentRole = roles[currentRoleIndex.current];
        roleRef.current.textContent = currentRole;

        gsap.fromTo(
          roleRef.current,
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            onComplete: () => {
              gsap.to(roleRef.current, {
                opacity: 0,
                y: -20,
                duration: 0.8,
                delay: 2,
                ease: 'power2.in',
                onComplete: () => {
                  currentRoleIndex.current = (currentRoleIndex.current + 1) % roles.length;
                  animateRole();
                }
              });
            }
          }
        );
      }
    };

    const timer = setTimeout(() => {
      animateRole();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <h1
        ref={nameRef}
        className="text-7xl font-bold tracking-tight"
        style={{
          background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 50%, #0055ff 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          textShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
        }}
      >
        Muhammad Haidar Hisbullah
      </h1>
      <div className="text-3xl font-medium text-cyan-400 h-12 relative overflow-hidden">
        <span className="text-white">I am a </span>
        <span
          ref={roleRef}
          className="inline-block"
          style={{
            color: '#00d4ff',
            textShadow: '0 0 20px rgba(0, 212, 255, 0.8)',
          }}
        >
          {roles[0]}
        </span>
      </div>
    </div>
  );
}
