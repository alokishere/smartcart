"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Apple,
  Baby,
  Box,
  ChevronLeft,
  ChevronRight,
  Coffee,
  Cookie,
  Fish,
  Heart,
  Home,
  Leaf,
  Milk,
  Snowflake,
  Wheat,
} from "lucide-react";

const categories = [
  { name: "Fruits & Vegetables", icon: Apple,    bg: "bg-green-50",  iconBg: "bg-green-200",  text: "text-green-800"  },
  { name: "Dairy & Eggs",         icon: Milk,     bg: "bg-yellow-50", iconBg: "bg-yellow-200", text: "text-yellow-800" },
  { name: "Rice, Atta & Grains",  icon: Wheat,    bg: "bg-orange-50", iconBg: "bg-orange-200", text: "text-orange-800" },
  { name: "Snacks & Biscuits",    icon: Cookie,   bg: "bg-pink-50",   iconBg: "bg-pink-200",   text: "text-pink-800"   },
  { name: "Beverages",            icon: Coffee,   bg: "bg-lime-50",   iconBg: "bg-lime-200",   text: "text-lime-800"   },
  { name: "Personal Care",        icon: Heart,    bg: "bg-teal-50",   iconBg: "bg-teal-200",   text: "text-teal-800"   },
  { name: "Household",            icon: Home,     bg: "bg-purple-50", iconBg: "bg-purple-200", text: "text-purple-800" },
  { name: "Instant Food",         icon: Box,      bg: "bg-red-50",    iconBg: "bg-red-200",    text: "text-red-800"    },
  { name: "Baby & Pet Care",      icon: Baby,     bg: "bg-indigo-50", iconBg: "bg-indigo-200", text: "text-indigo-800" },
  { name: "Meat & Seafood",       icon: Fish,     bg: "bg-blue-50",   iconBg: "bg-blue-200",   text: "text-blue-800"   },
  { name: "Frozen Foods",         icon: Snowflake,bg: "bg-cyan-50",   iconBg: "bg-cyan-200",   text: "text-cyan-800"   },
  { name: "Organic",              icon: Leaf,     bg: "bg-emerald-50",iconBg: "bg-emerald-200",text: "text-emerald-800"},
];

const STEP = 320;
const AUTO_SPEED = 1.4; // px per frame at ~60fps

export default function CategorySlider() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const dirRef    = useRef<1 | -1>(1);
  const pausedRef = useRef(false);
  const rafRef    = useRef<number | null>(null);
  const [activeDot, setActiveDot] = useState(0);

  /* ── auto-scroll via requestAnimationFrame ── */
  const tick = useCallback(() => {
    const el = scrollRef.current;
    if (el && !pausedRef.current) {
      const max = el.scrollWidth - el.clientWidth;
      if (dirRef.current === 1 && el.scrollLeft >= max - 2)  dirRef.current = -1;
      if (dirRef.current === -1 && el.scrollLeft <= 2)        dirRef.current =  1;
      el.scrollLeft += dirRef.current * AUTO_SPEED;
    }
    rafRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [tick]);

  /* ── pause on hover / touch ── */
  const pause   = () => { pausedRef.current = true; };
  const resume  = () => { pausedRef.current = false; };
  const resumeDelayed = () => { setTimeout(() => { pausedRef.current = false; }, 1200); };

  /* ── button scroll ── */
  const scrollBy = (delta: number) => {
    scrollRef.current?.scrollBy({ left: delta, behavior: "smooth" });
  };

  /* ── dot sync ── */
  const onScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const cardW = 144 + 14; // min-w + gap
    const idx = Math.round(el.scrollLeft / (cardW * 4));
    setActiveDot(Math.min(idx, dotsCount - 1));
  };

  const dotsCount = Math.ceil(categories.length / 4);

  const scrollToDot = (i: number) => {
    const cardW = 144 + 14;
    scrollRef.current?.scrollTo({ left: i * cardW * 4, behavior: "smooth" });
  };

  return (
    <motion.section
      initial={{ y: 20, opacity: 0, scale: 0.97 }}
      whileInView={{ y: 0, opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      viewport={{ once: false, amount: 0.4 }}
      className="w-[90vw] md:w-[82vw] mx-auto mt-12 pb-10"
    >
      {/* ── Header ── */}
      <div className="text-center mb-7">
        <span className="inline-block bg-green-100 text-green-700 text-[11px] font-bold tracking-widest uppercase px-4 py-1 rounded-full mb-3">
          Browse all
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 leading-tight">
          🛒 Shop by{" "}
          <span className="text-green-600">Category</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1.5">
          Everything you need, delivered fresh to your door
        </p>
      </div>

      {/* ── Track ── */}
      <div className="relative">
        {/* fade edges */}
        <div className="pointer-events-none absolute left-0 inset-y-0 w-14 bg-linear-to-r from-white to-transparent z-10" />
        <div className="pointer-events-none absolute right-0 inset-y-0 w-14 bg-linear-to-l from-white to-transparent z-10" />

        {/* Left button */}
        <button
          onMouseEnter={pause}
          onMouseLeave={resume}
          onClick={() => scrollBy(-STEP)}
          aria-label="Scroll left"
          className="absolute left-0 top-1/2 -translate-y-1/2 z-20
                     w-9 h-9 rounded-full bg-white border border-green-200
                     text-green-700 shadow-md flex items-center justify-center
                     hover:bg-green-50 hover:border-green-400
                     active:scale-95 transition-all duration-150"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Scroll track */}
        <div
          ref={scrollRef}
          onScroll={onScroll}
          onMouseEnter={pause}
          onMouseLeave={resume}
          onTouchStart={pause}
          onTouchEnd={resumeDelayed}
          className="flex overflow-x-auto gap-3.5 px-12 py-3 scrollbar-hide scroll-smooth"
        >
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.name}
                whileHover={{ y: -6, scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                transition={{ type: "spring", stiffness: 340, damping: 22 }}
                className={`
                  flex-none w-[130px] md:w-[144px]
                  ${cat.bg} rounded-2xl
                  flex flex-col items-center justify-start
                  pt-5 pb-4 px-3
                  border border-transparent
                  hover:border-opacity-30
                  cursor-pointer
                  shadow-sm hover:shadow-md
                  transition-shadow duration-200
                `}
              >
                <div className={`${cat.iconBg} w-14 h-14 rounded-full flex items-center justify-center mb-3 shadow-sm`}>
                  <Icon className={`w-7 h-7 ${cat.text}`} />
                </div>
                <span className={`text-[11.5px] md:text-xs text-center font-bold leading-snug ${cat.text}`}>
                  {cat.name}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Right button */}
        <button
          onMouseEnter={pause}
          onMouseLeave={resume}
          onClick={() => scrollBy(STEP)}
          aria-label="Scroll right"
          className="absolute right-0 top-1/2 -translate-y-1/2 z-20
                     w-9 h-9 rounded-full bg-white border border-green-200
                     text-green-700 shadow-md flex items-center justify-center
                     hover:bg-green-50 hover:border-green-400
                     active:scale-95 transition-all duration-150"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* ── Dot pagination ── */}
      <div className="flex justify-center gap-2 mt-4">
        {Array.from({ length: dotsCount }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToDot(i)}
            aria-label={`Go to page ${i + 1}`}
            className={`
              h-1.5 rounded-full transition-all duration-300
              ${activeDot === i ? "w-5 bg-green-600" : "w-1.5 bg-green-200"}
            `}
          />
        ))}
      </div>
    </motion.section>
  );
}