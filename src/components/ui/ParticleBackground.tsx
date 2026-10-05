"use client";

import { useLayoutEffect, useRef } from "react";

type ParticleBackgroundProps = {
  count?: number;
  cycleDurationSec?: number;
  opacity?: number;
  showConnections?: boolean;
};

type Particle = {
  el: HTMLSpanElement;
  phase: number;
  speed: number;
  xPct: number;
  yPct: number;
  size: number;
};

const COLORS = [
  "bg-brand-400",
  "bg-brand-500",
  "bg-indigo-400",
  "bg-violet-400",
  "bg-sky-400",
];

export function ParticleBackground({
  count = 28,
  cycleDurationSec = 14,
  opacity = 0.55,
  showConnections = true,
}: ParticleBackgroundProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const particles: Particle[] = [];
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < count; i++) {
      const el = document.createElement("span");
      const size = 3 + Math.random() * 7;
      const xPct = Math.random() * 100;
      const phase = Math.random();
      const speed = 0.6 + Math.random() * 0.8;
      const color = COLORS[i % COLORS.length] ?? COLORS[0]!;

      el.className =
        `absolute rounded-full ${color} ` +
        "will-change-transform pointer-events-none";
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.left = `${xPct}%`;
      el.style.top = "0";
      el.style.transform = "translate3d(0, -20px, 0)";
      el.style.opacity = "0";
      el.style.boxShadow =
        "0 0 12px 2px rgba(99,102,241,0.35), 0 0 4px 1px rgba(99,102,241,0.5)";
      el.style.filter = "blur(0.3px)";

      fragment.appendChild(el);
      particles.push({
        el,
        phase,
        speed,
        xPct,
        yPct: 0,
        size,
      });
    }

    container.appendChild(fragment);

    if (prefersReduced) {
      for (const p of particles) {
        const y = Math.random() * 100;
        p.el.style.transform = `translate3d(0, ${y}vh, 0)`;
        p.el.style.opacity = "0.35";
        p.yPct = y;
      }
      return () => {
        container.innerHTML = "";
      };
    }

    let rafId = 0;
    let paused = false;
    let pauseStartedAt = 0;
    let pauseOffset = 0;
    const startTime = performance.now();

    const handleVisibility = () => {
      if (document.hidden) {
        paused = true;
        pauseStartedAt = performance.now();
      } else if (paused) {
        pauseOffset += performance.now() - pauseStartedAt;
        paused = false;
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);

    const tick = (now: number) => {
      if (paused) {
        rafId = requestAnimationFrame(tick);
        return;
      }

      const elapsed = (now - startTime - pauseOffset) / 1000;
      const h = container.clientHeight || 800;
      const w = container.clientWidth || 1400;

      for (const p of particles) {
        const t = ((elapsed * p.speed) / cycleDurationSec + p.phase) % 1;
        const y = t * (h + 60) - 30;
        const fadeIn = Math.min(t / 0.12, 1);
        const fadeOut = Math.min((1 - t) / 0.12, 1);
        const alpha = Math.min(fadeIn, fadeOut) * opacity;

        p.el.style.transform = `translate3d(0, ${y}px, 0)`;
        p.el.style.opacity = alpha.toFixed(3);
        p.yPct = (y / h) * 100;
      }

      if (showConnections && svgRef.current) {
        const svg = svgRef.current;
        const maxDist = 130;
        let markup = "";

        for (let i = 0; i < particles.length; i++) {
          const a = particles[i]!;
          const ax = (a.xPct / 100) * w;
          const ay = (a.yPct / 100) * h;

          for (let j = i + 1; j < particles.length; j++) {
            const b = particles[j]!;
            const bx = (b.xPct / 100) * w;
            const by = (b.yPct / 100) * h;
            const dx = ax - bx;
            const dy = ay - by;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < maxDist) {
              const aOpacity = Number(a.el.style.opacity) || 0;
              const bOpacity = Number(b.el.style.opacity) || 0;
              const lineAlpha =
                (1 - dist / maxDist) * Math.min(aOpacity, bOpacity) * 0.5;

              if (lineAlpha > 0.02) {
                markup +=
                  `<line x1="${ax.toFixed(1)}" y1="${ay.toFixed(1)}" ` +
                  `x2="${bx.toFixed(1)}" y2="${by.toFixed(1)}" ` +
                  `stroke="rgba(99,102,241,${lineAlpha.toFixed(3)})" ` +
                  `stroke-width="0.7" />`;
              }
            }
          }
        }

        svg.innerHTML = markup;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener("visibilitychange", handleVisibility);
      container.innerHTML = "";
      if (svgRef.current) svgRef.current.innerHTML = "";
    };
  }, [count, cycleDurationSec, opacity, showConnections]);

  return (
    <div
      ref={containerRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden"
    >
      {showConnections ? (
        <svg
          ref={svgRef}
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        />
      ) : null}
    </div>
  );
}
