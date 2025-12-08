"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  baseSize: number;
  targetSize: number;
  currentSize: number;
  opacity: number;
}

export default function Home() {
  const { user } = useAuth();
  const [mounted, setMounted] = useState(false);
  const particlesContainer = useRef<HTMLDivElement>(null);
  const animationFrameId = useRef<number | null>(null);
  const particles = useRef<Particle[]>([]);
  const particleIdCounter = useRef(0);
  const particleCount = 30; // Number of particles

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Initialize particles randomly across the screen
    const initParticles = () => {
      particles.current = [];
      for (let i = 0; i < particleCount; i++) {
        particles.current.push({
          id: particleIdCounter.current++,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          baseSize: 20 + Math.random() * 30,
          targetSize: 20 + Math.random() * 30,
          currentSize: 20 + Math.random() * 30,
          opacity: 0.3 + Math.random() * 0.4,
        });
      }
    };

    const animate = () => {
      // Update particles with simple floating animation
      if (particlesContainer.current) {
        particles.current = particles.current.map((particle) => {
          // Add some friction
          particle.vx *= 0.98;
          particle.vy *= 0.98;

          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Keep particles within bounds with bounce
          if (particle.x < 0 || particle.x > window.innerWidth) {
            particle.vx *= -0.8;
            particle.x = Math.max(0, Math.min(window.innerWidth, particle.x));
          }
          if (particle.y < 0 || particle.y > window.innerHeight) {
            particle.vy *= -0.8;
            particle.y = Math.max(0, Math.min(window.innerHeight, particle.y));
          }

          // Gentle size pulsing
          particle.targetSize = particle.baseSize;
          particle.currentSize +=
            (particle.targetSize - particle.currentSize) * 0.1;

          // Keep opacity consistent (don't change it every frame)
          // Opacity is already set during initialization

          return particle;
        });

        // Update DOM
        particlesContainer.current.innerHTML = particles.current
          .map(
            (particle) => `
            <div
              class="particle"
              style="
                position: absolute;
                left: ${particle.x}px;
                top: ${particle.y}px;
                width: ${particle.currentSize}px;
                height: ${particle.currentSize}px;
                border-radius: 50%;
                background: radial-gradient(circle, rgba(59, 130, 246, ${
                  particle.opacity * 0.6
                }) 0%, rgba(147, 51, 234, ${particle.opacity * 0.4}) 100%);
                filter: blur(${Math.max(2, particle.currentSize / 6)}px);
                transform: translate(-50%, -50%);
                pointer-events: none;
                transition: none;
              "
            ></div>
          `
          )
          .join("");
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Initialize particles
    initParticles();

    // Handle window resize
    const handleResize = () => {
      // Reposition particles if needed
      particles.current = particles.current.map((p) => ({
        ...p,
        x: Math.min(p.x, window.innerWidth),
        y: Math.min(p.y, window.innerHeight),
      }));
    };

    window.addEventListener("resize", handleResize);
    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="text-center p-4">
        <p className="text-gray-600">Loading...</p>
      </div>
    );
  }

  return (
    <>
      {/* Particles container */}
      <div
        ref={particlesContainer}
        className="fixed pointer-events-none z-40"
        style={{
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          overflow: "hidden",
        }}
      />

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            {/* Welcome Message */}
            <div className="mb-6 animate-fade-in">
              <span className="inline-block px-4 py-2 text-sm font-semibold text-navy bg-gray-100 rounded-full mb-4">
                ✨ Welcome Back
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              <span className="block">Welcome,</span>
              <span className="block text-navy">{user?.name || "Guest"}</span>
            </h1>

            {/* Subheading */}
            <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto leading-relaxed">
              Organize your life, one task at a time. Your productivity
              companion that helps you stay focused and achieve your goals.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link
                href="/todo"
                className="px-8 py-4 bg-navy text-white font-semibold rounded-lg shadow-sm hover:bg-navy-light hover:shadow-md transition-all duration-200 flex items-center gap-2"
              >
                Get Started
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </Link>
              {!user && (
                <Link
                  href="/login"
                  className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-lg shadow-sm hover:shadow-md border border-gray-200 hover:border-gray-300 transition-all duration-200"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24">
            {/* Feature 1 */}
            <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Organization
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Organize your tasks with categories, priorities, and due dates.
                Stay on top of everything that matters.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Real-time Sync
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your tasks sync across all devices instantly. Access your todo
                list anywhere, anytime.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="group bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200 border border-gray-200">
              <div className="w-12 h-12 bg-navy rounded-lg flex items-center justify-center mb-4">
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Secure & Private
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Your data is encrypted and secure. We prioritize your privacy
                and keep your information safe.
              </p>
            </div>
          </div>

          {/* Stats Section */}
          {user && (
            <div className="mt-24 bg-white rounded-xl p-8 shadow-sm border border-gray-200">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Your Productivity Hub
                </h2>
                <p className="text-gray-600">
                  Ready to tackle your tasks? Let's get started!
                </p>
              </div>
              <div className="flex justify-center">
                <Link
                  href="/todo"
                  className="px-8 py-4 bg-navy text-white font-semibold rounded-lg shadow-sm hover:bg-navy-light hover:shadow-md transition-all duration-200"
                >
                  View My Todos
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
