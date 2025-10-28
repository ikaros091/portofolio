'use client'

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

gsap.registerPlugin(ScrollTrigger);

interface Certificate {
  id: number;
  title: string;
  issuer: string;
  date: string;
  image: string;
  credentialUrl?: string;
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

export default function CertificateSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [particles, setParticles] = useState<FloatingParticle[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [allCertificates, setAllCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCertificate, setActiveCertificate] = useState<number | null>(null);
  
  const certificatesPerSlide = 8;

  // Fetch certificates from API
  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/certificates`);
        const data = await response.json();
        
        if (data.success) {
          setAllCertificates(data.data);
        }
      } catch (error) {
        console.error('Error fetching certificates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCertificates();
  }, []);
  
  const totalSlides = Math.ceil(allCertificates.length / certificatesPerSlide);

  // Get current certificates to display
  const getCurrentCertificates = () => {
    const startIndex = currentSlide * certificatesPerSlide;
    return allCertificates.slice(startIndex, startIndex + certificatesPerSlide);
  };

  // Generate particles on client side
  useEffect(() => {
    setIsMounted(true);
    
    const newParticles: FloatingParticle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      startX: Math.random() * 100,
      startY: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.1,
    }));
    setParticles(newParticles);
  }, []);

  // Scroll animations
  useEffect(() => {
    if (sectionRef.current && titleRef.current && sliderRef.current && isMounted) {
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

        // Title animation
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

        // Initial cards animation - only on first load
        const cards = sliderRef.current?.children;
        if (cards) {
          gsap.fromTo(
            cards,
            { opacity: 0, scale: 0.8, y: 50 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              ease: 'power3.out',
              stagger: {
                amount: 0.4,
                from: 'start',
              },
              scrollTrigger: {
                trigger: sliderRef.current,
                start: 'top 85%',
                toggleActions: 'play none none reverse',
              },
            }
          );
        }
      }, sectionRef);

      return () => ctx.revert();
    }
  }, [isMounted]);

  // Simple fade for slide changes (no scroll trigger)
  useEffect(() => {
    if (sliderRef.current && isMounted && currentSlide > 0) {
      const cards = sliderRef.current.children;
      gsap.fromTo(
        cards,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 0.4,
          ease: 'power2.out',
          stagger: 0.05,
        }
      );
    }
  }, [currentSlide, isMounted]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev > 0 ? prev - 1 : totalSlides - 1));
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev < totalSlides - 1 ? prev + 1 : 0));
  };

  // Toggle certificate info on mobile
  const handleCertificateClick = (certId: number) => {
    if (activeCertificate === certId) {
      setActiveCertificate(null);
    } else {
      setActiveCertificate(certId);
    }
  };

  return (
    <section
      id="certificates"
      ref={sectionRef}
      className="min-h-screen relative py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-16"
    >
      {/* Neon glow effects */}
      <div className="absolute top-1/4 left-1/3 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/3 w-64 h-64 sm:w-80 sm:h-80 md:w-96 md:h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-pulse delay-700" />

      {/* Moving Digital Particles */}
      {isMounted && (
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
      )}

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Title */}
        <h2
          ref={titleRef}
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-8 sm:mb-12 md:mb-16"
          style={{
            background: 'linear-gradient(135deg, #a855f7 0%, #0099ff 50%, #00d4ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
          }}
        >
          Certificates
        </h2>

        {/* Certificates Grid - Responsive */}
        <div
          ref={sliderRef}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-8 sm:mb-12"
        >
          {getCurrentCertificates().map((cert) => (
            <div
              key={cert.id}
              onClick={() => handleCertificateClick(cert.id)}
              className="group relative rounded-lg sm:rounded-xl overflow-hidden border-2 border-cyan-500/30 bg-gradient-to-br from-gray-900/80 to-blue-950/80 backdrop-blur-sm hover:border-cyan-500 transition-all duration-300 cursor-pointer h-[280px] sm:h-[300px] md:h-[320px]"
              style={{
                boxShadow: '0 0 20px rgba(0, 212, 255, 0.1)',
              }}
            >
              {/* Certificate Image */}
              <div className="absolute inset-0">
                {cert.image ? (
                  <Image
                    src={cert.image}
                    alt={cert.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-purple-900/20 to-cyan-900/20 text-cyan-400/50 text-3xl sm:text-4xl md:text-5xl font-bold">
                    {cert.title.split(' ').map(word => word.charAt(0)).slice(0, 2).join('')}
                  </div>
                )}
              </div>

              {/* Content Overlay - Show on tap for mobile, hover for desktop */}
              <div className={`absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent flex flex-col justify-end p-4 sm:p-5 transition-opacity duration-300
                ${activeCertificate === cert.id ? 'opacity-100' : 'opacity-100 md:opacity-100'}`}>
                {/* Badge Icon */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-cyan-500/20 border-2 border-cyan-400 flex items-center justify-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>

                <h3 className="text-base sm:text-lg font-bold text-cyan-400 mb-1.5 sm:mb-2 line-clamp-2 group-hover:text-cyan-300 transition-colors">
                  {cert.title}
                </h3>
                <p className="text-gray-400 text-xs sm:text-sm mb-1">
                  {cert.issuer}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500 text-xs">{cert.date}</span>
                  {cert.credentialUrl && (
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 text-xs hover:text-cyan-300 transition-colors flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      View
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  )}
                </div>
              </div>

              {/* Corner decorations */}
              <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-l-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute top-1 right-1 sm:top-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 border-t-2 border-r-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-l-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
              <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 border-b-2 border-r-2 border-cyan-400/50 group-hover:border-cyan-400 transition-colors" />
            </div>
          ))}
        </div>

        {/* Slider Navigation */}
        {totalSlides > 1 && (
          <div className="flex items-center justify-center gap-4 sm:gap-6">
            {/* Previous Button */}
            <button
              onClick={handlePrevSlide}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-500 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 group"
              aria-label="Previous slide"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {/* Slide Indicators */}
            <div className="flex gap-2 sm:gap-3">
              {Array.from({ length: totalSlides }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlide(i)}
                  className={`transition-all duration-300 ${
                    currentSlide === i
                      ? 'w-8 sm:w-12 h-2.5 sm:h-3 bg-cyan-500 rounded-full shadow-[0_0_15px_rgba(0,212,255,0.6)]'
                      : 'w-2.5 sm:w-3 h-2.5 sm:h-3 bg-gray-600 rounded-full hover:bg-cyan-500/50'
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button
              onClick={handleNextSlide}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-500 text-cyan-400 flex items-center justify-center hover:bg-cyan-500/20 hover:border-cyan-400 transition-all duration-300 group"
              aria-label="Next slide"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
