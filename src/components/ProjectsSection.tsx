'use client'

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  tags: string[];
  link: string;
}

interface FloatingParticle {
  id: number;
  size: number;
  startX: number;
  startY: number;
  duration: number;
  delay: number;
  opacity: number;
}

interface CircuitLine {
  id: number;
  width: number;
  height: number;
  left: number;
  top: number;
  rotation: number;
  duration: number;
  opacity: number;
}

export default function ProjectsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [circuitLines, setCircuitLines] = useState<CircuitLine[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [allProjects, setAllProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const projectsPerPage = 10;

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/projects`);
        const data = await response.json();
        
        if (data.success) {
          setAllProjects(data.data);
        }
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Calculate pagination
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = allProjects.slice(indexOfFirstProject, indexOfLastProject);
  const totalPages = Math.ceil(allProjects.length / projectsPerPage);

  // Generate particles and lines on client side
  useEffect(() => {
    setIsMounted(true);
    
    const newParticles: FloatingParticle[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.4 + 0.2,
    }));
    setParticles(newParticles);

    const newLines: CircuitLine[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      width: 1,
      height: Math.random() * 300 + 100,
      left: Math.random() * 100,
      top: Math.random() * 100,
      rotation: Math.random() * 360,
      duration: Math.random() * 3 + 2,
      opacity: Math.random() * 0.3 + 0.2,
    }));
    setCircuitLines(newLines);
  }, []);

  useEffect(() => {
    if (sectionRef.current && titleRef.current && gridRef.current && isMounted) {
      const ctx = gsap.context(() => {
        // Section fade in animation on scroll
        gsap.fromTo(
          sectionRef.current,
          { opacity: 0, y: 100 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 80%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Title animation with scroll trigger
        gsap.fromTo(
          titleRef.current,
          { opacity: 0, y: 50, scale: 0.9 },
          { 
            opacity: 1, 
            y: 0, 
            scale: 1, 
            duration: 1.2, 
            ease: 'power3.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          }
        );

        // Grid items animation with scroll trigger
        const gridItems = gridRef.current?.children;
        if (gridItems) {
          gsap.fromTo(
            gridItems,
            { opacity: 0, y: 80, scale: 0.8 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 1,
              ease: 'power3.out',
              stagger: {
                amount: 0.6,
                from: 'start',
                ease: 'power2.inOut'
              },
              scrollTrigger: {
                trigger: gridRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [currentPage, particles, circuitLines, isMounted]);

  // Function to determine grid item class based on index and total
  const getGridItemClass = (index: number, total: number) => {
    // 1 item: Full width
    if (total === 1) return 'col-span-4';
    
    // 2 items: 2 side by side
    if (total === 2) return 'col-span-2';
    
    // 3 items: 2 atas, 1 bawah panjang
    if (total === 3) {
      if (index === 0 || index === 1) return 'col-span-2';
      return 'col-span-4';
    }
    
    // 4 items: 2x2 grid
    if (total === 4) return 'col-span-2';
    
    // 5 items: 2 atas, 1 panjang tengah, 2 bawah
    if (total === 5) {
      if (index === 0 || index === 1) return 'col-span-2';
      if (index === 2) return 'col-span-4';
      return 'col-span-2';
    }
    
    // 6 items: 3 baris panjang
    if (total === 6) return 'col-span-4';
    
    // 7 items: Layout 8 dengan 1 kosong (3 atas, 3 bawah, 1 samping kiri)
    if (total === 7) {
      if (index < 3) return 'col-span-1'; // 3 atas
      if (index === 3) return 'col-span-1 row-span-2'; // Samping kiri panjang
      return 'col-span-1'; // 3 bawah kanan
    }
    
    // 8 items: 3 atas, 2 samping vertikal, 3 bawah
    if (total === 8) {
      if (index < 3) return 'col-span-1'; // 3 atas
      if (index === 3 || index === 4) return 'col-span-1 row-span-2'; // 2 samping vertikal
      return 'col-span-1'; // 3 bawah
    }
    
    // 9 items: 3x3 grid
    if (total === 9) return 'col-span-1';
    
    // 10 items: 4 atas, 2 tengah panjang, 4 bawah
    if (total === 10) {
      if (index < 4) return 'col-span-1'; // 4 atas
      if (index === 4 || index === 5) return 'col-span-2'; // 2 tengah
      return 'col-span-1'; // 4 bawah
    }
    
    return 'col-span-1';
  };

  // Function to get grid container class based on total items
  const getGridClass = (total: number) => {
    if (total <= 4) return 'grid-cols-4';
    if (total <= 6) return 'grid-cols-4';
    if (total <= 9) return 'grid-cols-4';
    return 'grid-cols-4';
  };

  // Function to get min height based on position
  const getMinHeight = (index: number, total: number) => {
    // Untuk items yang row-span-2, buat lebih tinggi
    if (total === 7 && index === 3) return '400px';
    if (total === 8 && (index === 3 || index === 4)) return '400px';
    
    // Items panjang horizontal lebih pendek
    if (total === 3 && index === 2) return '250px';
    if (total === 5 && index === 2) return '250px';
    if (total === 6) return '250px';
    
    // Default height
    return '300px';
  };

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="min-h-screen relative py-20 px-6 lg:px-16"
    >
      {/* Neon glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Neon glow effects - matching Hero section */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-blue-500/15 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Moving Digital Particles - only render when mounted */}
      {isMounted && (
        <>
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particles.map((particle) => (
              <div
                key={particle.id}
                className="absolute bg-cyan-400 rounded-sm"
                style={{
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  left: `${particle.startX}%`,
                  top: `${particle.startY}%`,
                  animation: `floatParticle ${particle.duration}s ease-in-out ${particle.delay}s infinite`,
                  opacity: particle.opacity,
                  boxShadow: '0 0 3px rgba(0, 212, 255, 0.6)',
                }}
              />
            ))}
          </div>

          {/* Circuit Connection Lines */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {circuitLines.map((line) => (
              <div
                key={line.id}
                className="absolute"
                style={{
                  width: `${line.width}px`,
                  height: `${line.height}px`,
                  left: `${line.left}%`,
                  top: `${line.top}%`,
                  background: `linear-gradient(to bottom, transparent, rgba(0, 212, 255, ${line.opacity}), transparent)`,
                  transform: `rotate(${line.rotation}deg)`,
                  animation: `pulse ${line.duration}s ease-in-out infinite`,
                }}
              />
            ))}
          </div>
        </>
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-6xl font-bold text-center mb-16"
          style={{
            background: 'linear-gradient(135deg, #00d4ff 0%, #0099ff 50%, #0055ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(0, 212, 255, 0.5)',
          }}
        >
          My Projects
        </h2>

        {/* Bento Grid */}
        <div
          ref={gridRef}
          className={`grid ${getGridClass(currentProjects.length)} gap-4 mb-12 auto-rows-fr`}
        >
          {currentProjects.map((project, index) => (
            <div
              key={project.id}
              className={`${getGridItemClass(index, currentProjects.length)} group relative rounded-2xl overflow-hidden border-2 border-cyan-500/30 bg-gradient-to-br from-gray-900/50 to-blue-950/50 backdrop-blur-sm hover:border-cyan-500 transition-all duration-300 cursor-pointer`}
              style={{
                minHeight: getMinHeight(index, currentProjects.length),
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
              }}
            >
              {/* Project Image */}
              <div className="absolute inset-0">
                {project.image ? (
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cyan-900/20 to-blue-900/20 text-cyan-400/50 text-6xl">
                    {project.title.charAt(0)}
                  </div>
                )}
              </div>

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-cyan-400 mb-2">
                  {project.title}
                </h3>
                <p className="text-gray-300 mb-4 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 text-xs bg-cyan-500/20 text-cyan-400 rounded-full border border-cyan-500/30"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors self-start inline-block"
                  onClick={(e) => e.stopPropagation()}
                >
                  View Project
                </a>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-2 left-2 w-6 h-6 border-t-2 border-l-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute top-2 right-2 w-6 h-6 border-t-2 border-r-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 left-2 w-6 h-6 border-b-2 border-l-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
              <div className="absolute bottom-2 right-2 w-6 h-6 border-b-2 border-r-2 border-cyan-400 opacity-50 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-3">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-semibold transition-all duration-300 ${
                  currentPage === page
                    ? 'bg-cyan-500 text-white shadow-[0_0_20px_rgba(0,212,255,0.5)]'
                    : 'bg-gray-800/50 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20'
                }`}
              >
                {page}
              </button>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
