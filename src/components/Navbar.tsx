'use client'

import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { GrGithub, GrLinkedinOption } from 'react-icons/gr';
import { SiWhatsapp } from "react-icons/si";
import Link from 'next/link';

export default function Navbar() {
  const [isVisible, setIsVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const mouseMoveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Set isScrolled if scrolled past Hero section (about 100vh)
      if (currentScrollY > 100) {
        setIsScrolled(true);
        
        // Start 10 second timer to hide navbar
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 10000); // 10 seconds
      } else {
        setIsScrolled(false);
        setIsVisible(true);
        
        // Clear hide timer when in Hero section
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
          hideTimeoutRef.current = null;
        }
      }
      
      lastScrollY = currentScrollY;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Show navbar when mouse is near top (within 100px)
      if (e.clientY < 100 && isScrolled) {
        setIsVisible(true);
        
        // Reset 10 second timer
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current);
        }
        
        hideTimeoutRef.current = setTimeout(() => {
          setIsVisible(false);
        }, 10000);
      }
      
      // Reset mouse move timeout
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
      
      // If scrolled and mouse moves anywhere, reset hide timer
      if (isScrolled) {
        mouseMoveTimeoutRef.current = setTimeout(() => {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
          }
          
          hideTimeoutRef.current = setTimeout(() => {
            setIsVisible(false);
          }, 10000);
        }, 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    // Initial check
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
      if (mouseMoveTimeoutRef.current) {
        clearTimeout(mouseMoveTimeoutRef.current);
      }
    };
  }, [isScrolled]);

  // Animate navbar visibility
  useEffect(() => {
    if (navRef.current) {
      gsap.to(navRef.current, {
        y: isVisible ? 0 : -100,
        opacity: isVisible ? 1 : 0,
        duration: 0.3,
        ease: 'power2.out',
      });
    }
  }, [isVisible]);

  const scrollToSection = (sectionId: string) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const handleDownloadCV = () => {
    // Replace with your actual CV file path
    const link = document.createElement('a');
    link.href = 'https://drive.google.com/file/d/1BjvdX6B4r-l39hV8gK4j0iZioGvz-lel/view?usp=sharing'; // Put your CV file in public folder
    link.download = 'https://drive.google.com/file/d/1BjvdX6B4r-l39hV8gK4j0iZioGvz-lel/view?usp=sharing';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      ref={navRef}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-gray-950/80 backdrop-blur-md border-b border-cyan-500/20' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-16">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo/Brand - Mobile */}
          <button
            onClick={() => scrollToSection('home')}
            className="text-lg md:text-xl font-bold text-cyan-400 hover:text-cyan-300 transition-colors lg:hidden"
          >
            IKAROS
          </button>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('home')}
              className="text-lg font-bold text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('projects')}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Projects
            </button>
            <button
              onClick={() => scrollToSection('certificates')}
              className="text-gray-300 hover:text-cyan-400 transition-colors"
            >
              Certificates
            </button>
          </div>

          {/* Center - Download CV Button (Desktop) */}
          <button
            onClick={handleDownloadCV}
            className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 px-6 xl:px-8 py-2 xl:py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm xl:text-base font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.4)] hover:shadow-[0_0_30px_rgba(0,212,255,0.6)] items-center gap-2"
          >
            <svg className="w-4 h-4 xl:w-5 xl:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span className="hidden xl:inline">Download CV</span>
            <span className="xl:hidden">CV</span>
          </button>

          {/* Right side - Social Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4">
            <Link
              href="https://github.com/ikaros091"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 xl:w-10 xl:h-10 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
            >
              <GrGithub className="text-cyan-400" size="18px" />
            </Link>
            <Link
              href="www.linkedin.com/in/mohammad-haidar-hisbullah-901922298"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 xl:w-10 xl:h-10 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
            >
              <GrLinkedinOption className="text-cyan-400" size="18px" />
            </Link>
            <Link
              href="https://wa.link/mah57z"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 xl:w-10 xl:h-10 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
            >
              <SiWhatsapp className="text-cyan-400" size="18px" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden w-10 h-10 rounded-lg border-2 border-cyan-500/50 flex flex-col items-center justify-center gap-1.5 hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
          >
            <span className={`w-5 h-0.5 bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-5 h-0.5 bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-0.5 bg-cyan-400 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div 
        className={`lg:hidden absolute top-full left-0 right-0 bg-gray-950/95 backdrop-blur-md border-b border-cyan-500/20 transition-all duration-300 ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
        }`}
      >
        <div className="px-4 py-6 space-y-4">
          {/* Navigation Links */}
          <button
            onClick={() => scrollToSection('home')}
            className="w-full text-left px-4 py-3 text-cyan-400 font-semibold hover:bg-cyan-500/10 rounded-lg transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('projects')}
            className="w-full text-left px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
          >
            Projects
          </button>
          <button
            onClick={() => scrollToSection('certificates')}
            className="w-full text-left px-4 py-3 text-gray-300 hover:text-cyan-400 hover:bg-cyan-500/10 rounded-lg transition-colors"
          >
            Certificates
          </button>

          {/* Download CV Button (Mobile) */}
          <button
            onClick={handleDownloadCV}
            className="w-full px-4 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold rounded-lg hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 shadow-[0_0_20px_rgba(0,212,255,0.4)] flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download CV
          </button>

          {/* Social Links (Mobile) */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-cyan-500/20">
            <Link
              href="https://github.com/ikaros091"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
            >
              <GrGithub className="text-cyan-400" size="20px" />
            </Link>
            <Link
              href="www.linkedin.com/in/mohammad-haidar-hisbullah-901922298"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
            >
              <GrLinkedinOption className="text-cyan-400" size="20px" />
            </Link>
            <Link
              href="https://wa.link/mah57z"
              target="_blank"
              rel="noopener noreferrer"
              className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
            >
              <SiWhatsapp className="text-cyan-400" size="20px" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
