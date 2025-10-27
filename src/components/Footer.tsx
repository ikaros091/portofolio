"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { GrGithub, GrLinkedinOption, GrMail } from "react-icons/gr";
import { SiWhatsapp } from "react-icons/si";
import Link from "next/link";

interface GridLine {
  id: number;
  x: number;
  y: number;
  width: number;
  height: number;
  opacity: number;
  delay: number;
}

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [gridLines, setGridLines] = useState<GridLine[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  // Generate wireframe grid lines
  useEffect(() => {
    setIsMounted(true);

    const lines: GridLine[] = [];
    // Vertical lines
    for (let i = 0; i < 15; i++) {
      lines.push({
        id: i,
        x: (i / 15) * 100,
        y: 0,
        width: 1,
        height: 100,
        opacity: Math.random() * 0.3 + 0.2,
        delay: Math.random() * 2,
      });
    }
    // Horizontal lines
    for (let i = 0; i < 8; i++) {
      lines.push({
        id: i + 15,
        x: 0,
        y: (i / 8) * 100,
        width: 100,
        height: 1,
        opacity: Math.random() * 0.3 + 0.2,
        delay: Math.random() * 2,
      });
    }
    setGridLines(lines);
  }, []);

  // Mouse move effect for 3D text
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (textRef.current) {
        const rect = textRef.current.getBoundingClientRect();

        // Check if mouse is within the text area
        const isInBounds =
          e.clientX >= rect.left &&
          e.clientX <= rect.right &&
          e.clientY >= rect.top &&
          e.clientY <= rect.bottom;

        if (isInBounds) {
          const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
          const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
          setMousePosition({ x, y });
        } else {
          // Reset to center when mouse leaves the area
          setMousePosition({ x: 0, y: 0 });
        }
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  // Animate 3D text based on mouse position
  useEffect(() => {
    if (textRef.current && isMounted) {
      gsap.to(textRef.current, {
        rotateY: mousePosition.x * 15,
        rotateX: -mousePosition.y * 15,
        duration: 0.5,
        ease: "power2.out",
      });
    }
  }, [mousePosition, isMounted]);

  return (
    <footer
      ref={footerRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden py-20 px-6 lg:px-16"
    >
      {/* Wireframe grid background */}
      {isMounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {gridLines.map((line) => (
            <div
              key={line.id}
              className="absolute bg-cyan-500"
              style={{
                left: `${line.x}%`,
                top: `${line.y}%`,
                width: line.width === 1 ? "1px" : `${line.width}%`,
                height: line.height === 1 ? "1px" : `${line.height}%`,
                opacity: line.opacity,
                animation: `pulse ${2 + line.delay}s ease-in-out infinite`,
              }}
            />
          ))}
        </div>
      )}

      {/* Animated corner brackets */}
      <div className="absolute top-8 left-8 w-20 h-20 border-t-4 border-l-4 border-cyan-500 opacity-50 animate-pulse" />
      <div className="absolute top-8 right-8 w-20 h-20 border-t-4 border-r-4 border-cyan-500 opacity-50 animate-pulse" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-b-4 border-l-4 border-cyan-500 opacity-50 animate-pulse" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-b-4 border-r-4 border-cyan-500 opacity-50 animate-pulse" />

      {/* Neon glow effects */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px]" />

      <div className="relative z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - About Section */}
          <div className="space-y-6">
            <h2
              className="text-5xl font-bold mb-8"
              style={{
                background:
                  "linear-gradient(135deg, #00d4ff 0%, #0099ff 50%, #0055ff 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
                textShadow: "0 0 30px rgba(0, 212, 255, 0.5)",
              }}
            >
              About Me
            </h2>

            <p className="text-gray-300 leading-relaxed text-lg">
              Hi, I'm Muhammad Haidar Hisbullah. I'm a highly driven and
              results-oriented Full-Stack Javascript Developer with expertise in
              Web and Cross-Platform Application Development. My core technical
              stack includes React, Next.js, React Native, and Expo, enabling
              the creation of robust, scalable applications.
            </p>

            <p className="text-gray-300 leading-relaxed text-lg">
              I possess foundational knowledge in integrating advanced features
              such as AI integration and leveraging diverse 3rd Party APIs. My
              career foundation as a full-stack web developer was established
              through the rigorous Hacktiv8 bootcamp. Committed to continuous
              growth, my clear goal is to excel as a Professional Programmer,
              dedicating my full effort to achieving significant Industry
              success.
            </p>

            {/* Social Links */}
            <div className="flex gap-6 items-center pt-4">
              <Link
                href="https://github.com/ikaros091"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
              >
                <GrGithub className="text-cyan-400" size="24px" />
              </Link>
              <Link
                href="www.linkedin.com/in/mohammad-haidar-hisbullah-901922298"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
              >
                <GrLinkedinOption className="text-cyan-400" size="24px" />
              </Link>
              <Link
                href="https://wa.link/mah57z"
                target="_blank"
                rel="noopener noreferrer"
                className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
              >
                <SiWhatsapp className="text-cyan-400" size="24px" />
              </Link>
              <Link
                href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=mohammadhaidarhisbullah@gmail.com"
                className="w-12 h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all"
              >
                <GrMail className="text-cyan-400" size="24px" />
              </Link>
            </div>
          </div>

          {/* Right side - 3D Interactive Text */}
          <div
            className="flex items-center justify-center"
            style={{ perspective: "1000px" }}
          >
            <div
              ref={textRef}
              className="relative"
              style={{
                transformStyle: "preserve-3d",
              }}
            >
              {/* Main 3D Text */}
              <div className="relative">
                <h1
                  className="text-8xl lg:text-9xl font-black tracking-wider"
                  style={{
                    background:
                      "linear-gradient(135deg, #00d4ff 0%, #0099ff 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    backgroundClip: "text",
                    textShadow: "0 0 40px rgba(0, 212, 255, 0.5)",
                    filter: "drop-shadow(0 0 20px rgba(0, 212, 255, 0.6))",
                  }}
                >
                  IKAROS
                </h1>

                {/* 3D depth layers */}
                {[...Array(5)].map((_, i) => (
                  <h1
                    key={i}
                    className="absolute top-0 left-0 text-8xl lg:text-9xl font-black tracking-wider text-cyan-500/20"
                    style={{
                      transform: `translateZ(-${(i + 1) * 10}px)`,
                      WebkitTextStroke: "1px rgba(0, 212, 255, 0.3)",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    IKAROS
                  </h1>
                ))}
              </div>

              {/* Wireframe cube decoration */}
              <div
                className="absolute -top-20 -right-20 w-32 h-32 border border-cyan-500/30 animate-spin-slow"
                style={{
                  transform: "rotateX(45deg) rotateY(45deg)",
                  transformStyle: "preserve-3d",
                }}
              >
                <div
                  className="absolute inset-0 border border-cyan-500/30"
                  style={{ transform: "translateZ(20px)" }}
                />
                <div
                  className="absolute inset-0 border border-cyan-500/30"
                  style={{ transform: "translateZ(-20px)" }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="mt-32 pt-6 border-t border-cyan-500/20 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} IKAROS. All rights reserved.
          </p>
          <p className="text-gray-500 text-xs mt-1">
            Crafted with passion and cutting-edge technologies.
          </p>
        </div>
      </div>
    </footer>
  );
}
