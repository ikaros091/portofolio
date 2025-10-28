"use client";

import { useEffect, useRef } from "react";
import dynamic from "next/dynamic";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { GrGithub, GrLinkedinOption } from "react-icons/gr";
import { SiWhatsapp } from "react-icons/si";
import AnimatedText from "../components/AnimatedText";
import ProjectsSection from "../components/ProjectsSection";
import CertificateSection from "../components/CertificateSection";
import PortalTransition from "../components/PortalTransition";
import Link from "next/link";

gsap.registerPlugin(ScrollTrigger);

// Dynamically import Scene3D with no SSR to avoid Three.js issues
const Scene3D = dynamic(() => import("../components/Scene3D"), {
  ssr: false,
});

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const descRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const socialsRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!heroRef.current) return;

    const ctx = gsap.context(() => {
      // Hero section starts invisible and fades in as portal fades out
      gsap.fromTo(
        heroRef.current,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: heroRef.current,
            start: "top bottom",
            end: "top center",
            scrub: 1,
          },
        }
      );

      // Animate hero content elements
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: heroContentRef.current,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });

      tl.fromTo(
        descRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }
      )
        .fromTo(
          buttonsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        )
        .fromTo(
          socialsRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" },
          "-=0.4"
        );

      // Animate 3D scene
      gsap.fromTo(
        sceneRef.current,
        { opacity: 0, scale: 0.9, rotateY: -20 },
        {
          opacity: 1,
          scale: 1,
          rotateY: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sceneRef.current,
            start: "top 80%",
            toggleActions: "play none none reverse",
          },
        }
      );
    }, heroRef);

    return () => ctx.revert();
  }, []);

  const scrollToProjects = () => {
    const projectsSection = document.getElementById("projects");
    if (projectsSection) {
      projectsSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative overflow-x-hidden">
      {/* Continuous background for all sections */}
      <div className="fixed inset-0 -z-10 bg-gradient-to-b from-gray-950 via-blue-950 to-gray-900" />

      {/* Portal Transition Opening */}
      <PortalTransition />

      {/* Hero Section - starts with opacity 0, overlaps with portal */}
      <div
        id="home"
        ref={heroRef}
        className="relative min-h-screen overflow-hidden -mt-[100vh]"
        style={{ opacity: 0 }}
      >
        {/* Animated background grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0099ff15_1px,transparent_1px),linear-gradient(to_bottom,#0099ff15_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Neon glow effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700" />

        <main className="relative z-10 flex min-h-screen items-center justify-center px-4 sm:px-6 lg:px-16 pt-16 md:pt-0">
          <div className="w-full max-w-7xl grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Left side - Text Content */}
            <div
              ref={heroContentRef}
              className="flex flex-col gap-4 sm:gap-6 md:gap-8 order-2 lg:order-1"
            >
              <AnimatedText />

              {/* Additional description */}
              <p
                ref={descRef}
                className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-xl leading-relaxed"
                style={{ opacity: 0 }}
              >
                Crafting digital experiences with cutting-edge technologies.
                Passionate about building scalable applications and elegant user
                interfaces.
              </p>

              {/* CTA Buttons */}
              <div
                ref={buttonsRef}
                className="flex gap-3 sm:gap-4 flex-wrap"
                style={{ opacity: 0 }}
              >
                <button
                  onClick={scrollToProjects}
                  className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base bg-cyan-500 text-white font-semibold rounded-lg
                    hover:bg-cyan-600 transition-all duration-300 
                    shadow-[0_0_20px_rgba(0,212,255,0.5)] hover:shadow-[0_0_30px_rgba(0,212,255,0.8)]"
                >
                  View Projects
                </button>
                <Link
                  href="https://mail.google.com/mail/u/0/?fs=1&tf=cm&source=mailto&to=mohammadhaidarhisbullah@gmail.com"
                  className="px-6 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base border-2 border-cyan-500 text-cyan-400 font-semibold rounded-lg
                    hover:bg-cyan-500/10 transition-all duration-300"
                >
                  Contact Me
                </Link>
              </div>

              {/* Social Links */}
              <div
                ref={socialsRef}
                className="flex gap-4 sm:gap-6 items-center"
                style={{ opacity: 0 }}
              >
                <Link
                  href="https://github.com/ikaros091"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all cursor-pointer"
                >
                  <GrGithub className="text-cyan-400" size="20px" />
                </Link>
                <Link
                  href="www.linkedin.com/in/mohammad-haidar-hisbullah-901922298"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all cursor-pointer"
                >
                  <GrLinkedinOption className="text-cyan-400" size="20px" />
                </Link>
                <Link
                  href="https://wa.link/mah57z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-cyan-500/50 flex items-center justify-center hover:border-cyan-500 hover:bg-cyan-500/10 transition-all cursor-pointer"
                >
                  <SiWhatsapp className="text-cyan-400" size="20px" />
                </Link>
              </div>
            </div>

            {/* Right side - 3D Scene */}
            <div
              ref={sceneRef}
              className="relative h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] order-1 lg:order-2"
              style={{ opacity: 0 }}
            >
              <div className="absolute inset-0 rounded-2xl overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 backdrop-blur-sm rounded-2xl border border-cyan-500/20" />
                <Scene3D />
              </div>
            </div>
          </div>
        </main>

        {/* Bottom decoration */}
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
      </div>

      {/* Projects Section */}
      <ProjectsSection />

      {/* Certificates Section */}
      <CertificateSection />
    </div>
  );
}
