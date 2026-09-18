"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useCountdown } from "@/hooks/useCountdown";
import { Reveal } from "@/components/motion/Reveal";
import { useEffect, useRef, useState } from "react";

interface CountdownCardProps {
  value: string | number;
  label: string;
  delay: number;
}

function CountdownCard({ value, label, delay }: CountdownCardProps) {
  return (
    <Reveal delay={delay} direction="up">
      <motion.div
        className="card-glass flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 min-w-[72px] sm:min-w-[90px]"
        whileHover={{ y: -4, transition: { duration: 0.25 } }}
      >
        <motion.span
          key={value}
          initial={{ opacity: 0, y: -12, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
          className="font-serif text-3xl font-bold tabular-nums gold-text sm:text-4xl"
          aria-live="polite"
          aria-label={`${value} ${label}`}
        >
          {value}
        </motion.span>
        <span className="font-sans text-xs uppercase tracking-widest text-[color:var(--text-muted)]">
          {label}
        </span>
      </motion.div>
    </Reveal>
  );
}

// --- New Interactive Scratch Component ---
function ScratchToReveal({ children }: { children: React.ReactNode }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const isDrawing = useRef(false);
  const lastPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealed) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      // Size canvas exactly to its wrapper
      canvas.width = parent.offsetWidth;
      canvas.height = parent.offsetHeight;

      // Draw the scratch-off cover (Matches your dark/gold theme)
      ctx.fillStyle = "#111111"; // Very dark grey/black
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Add "Scratch to Reveal" text
      ctx.font = "italic 22px serif";
      ctx.fillStyle = "#D4AF37"; // Gold text
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Scratch to Reveal ✨", canvas.width / 2, canvas.height / 2);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, [isRevealed]);

  const checkRevealThreshold = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    let transparent = 0;

    // Check transparency of pixels
    for (let i = 3; i < pixels.length; i += 4) {
      if (pixels[i] === 0) transparent++;
    }

    const percentage = (transparent / (pixels.length / 4)) * 100;
    // Auto-reveal the rest if 35% is scratched off
    if (percentage > 35) {
      setIsRevealed(true);
    }
  };

  const getCoordinates = (e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();

    let clientX, clientY;
    if (window.TouchEvent && e instanceof TouchEvent) {
      clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
      clientY = e.touches[0]?.clientY || e.changedTouches[0]?.clientY;
    } else {
      clientX = (e as MouseEvent).clientX;
      clientY = (e as MouseEvent).clientY;
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (isRevealed) return;
    isDrawing.current = true;
    lastPos.current = getCoordinates(e.nativeEvent as MouseEvent | TouchEvent);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing.current || isRevealed) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || !lastPos.current) return;

    const currentPos = getCoordinates(e.nativeEvent as MouseEvent | TouchEvent);

    // This makes the stroke "erase" the canvas instead of drawing on top of it
    ctx.globalCompositeOperation = "destination-out";
    ctx.lineWidth = 45; // Width of the scratch brush
    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    lastPos.current = currentPos;

    // Throttle the threshold check slightly to prevent performance lag
    if (Math.random() > 0.8) {
      checkRevealThreshold();
    }
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPos.current = null;
    checkRevealThreshold();
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto rounded-3xl p-4 sm:p-8">
      {/* Underlying Content (Always rendered behind the canvas) */}
      <div className="flex w-full justify-center">
        {children}
      </div>

      {/* Scratch Canvas Overlay */}
      <AnimatePresence>
        {!isRevealed && (
          <motion.canvas
            ref={canvasRef}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
            // `touch-none` is crucial here so the user doesn't accidentally scroll the page while scratching on mobile
            className="absolute inset-0 z-10 cursor-pointer touch-none rounded-3xl"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function CountdownSection() {
  const { days, hours, minutes, seconds, isExpired } = useCountdown();

  return (
    <section
      id="countdown"
      className="relative py-20 section-padding overflow-hidden"
      aria-label="Wedding day countdown"
    >
      <div className="absolute inset-0 pointer-events-none" aria-hidden>
        <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
        <div className="absolute bottom-0 h-px w-full bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl">
        <Reveal direction="up">
          <div className="mb-12 flex flex-col items-center gap-3 text-center">
            <span className="font-sans text-xs uppercase tracking-[0.4em] text-[color:var(--text-muted)]">
              Towards the Big Day
            </span>
            <h2 className="font-serif text-3xl font-bold gold-text sm:text-4xl">
              Countdown
            </h2>
            <div className="gold-divider w-24" aria-hidden />
            <p className="font-sans text-sm text-[color:var(--text-secondary)]">
              Thursday, December 3, 2026
            </p>
          </div>
        </Reveal>

        {isExpired ? (
          <Reveal direction="up">
            <div className="text-center py-12">
              <p className="font-serif text-2xl italic text-[#D4AF37]">
                The beautiful day is here!
              </p>
              <p className="mt-2 font-sans text-sm text-[color:var(--text-muted)]">
                Thank you for your blessings and presence.
              </p>
            </div>
          </Reveal>
        ) : (
          <ScratchToReveal>
            <div className="flex items-center justify-center gap-3 sm:gap-5 flex-wrap">
              <CountdownCard value={days} label="Days" delay={0} />
              <Reveal delay={0.15}>
                <span
                  className="font-serif text-2xl font-bold text-[#D4AF37]/50 pb-2 self-center"
                  aria-hidden
                >
                  :
                </span>
              </Reveal>
              <CountdownCard value={hours} label="Hours" delay={0.1} />
              <Reveal delay={0.25}>
                <span
                  className="font-serif text-2xl font-bold text-[#D4AF37]/50 pb-2 self-center"
                  aria-hidden
                >
                  :
                </span>
              </Reveal>
              <CountdownCard value={minutes} label="Mins" delay={0.2} />
              <Reveal delay={0.35}>
                <span
                  className="font-serif text-2xl font-bold text-[#D4AF37]/50 pb-2 self-center"
                  aria-hidden
                >
                  :
                </span>
              </Reveal>
              <CountdownCard value={seconds} label="Secs" delay={0.3} />
            </div>
          </ScratchToReveal>
        )}
      </div>
    </section>
  );
}