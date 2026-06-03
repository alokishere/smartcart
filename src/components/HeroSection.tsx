"use client";
import React, { useEffect, useState } from "react";
import { Leaf, Truck, Smartphone, ArrowRight, ShoppingBasket } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
const HeroSection = () => {
  const slides = [
    {
      id: 1,
      icon: (
        <Leaf className="w-20 h-20 sm:w-28 sm:h-28 text-green-400 drop-shadow-1g" />
      ),
      title: "Fresh Organic Groceries 🥦",
      subtitle:
        "Farm-fresh fruits, vegetables, and daily essentials delivered to you.",
      btnText: "Shop Now",
      bg: "https://images.unsplash.com/photo-1652262968340-b735524f9ae4?q=80&w=760&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 2,
      icon: (
        <Truck className="w-20 h-20 sm:w-28 sm:h-28 text-yellow-400 drop-shadow-1g" />
      ),
      title: "Fast & Reliable Delivery 🚚",
      subtitle: "We ensure your groceries reach your doorstep in no time.",
      btnText: "Order Now",
      bg: "https://images.unsplash.com/photo-1617347454431-f49d7ff5c3b1?q=80&w=815&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
    {
      id: 3,
      icon: (
        <Smartphone className="w-20 h-20 sm:w-28 sm:h-28 text-blue-400 drop-shadow-1g" />
      ),
      title: "Shop Anytime, Anywhere 📱",
      subtitle: "Easy and seamless online grocery shopping experience.",
      btnText: "Get Started",
      bg: "https://images.unsplash.com/photo-1753354868504-db68f35d3b90?q=80&w=1031&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  ];
  const [current, setcurrent] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setcurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-[98%] mx-auto mt-32 h-[80vh] rounded-3xl overflow-hidden shadow-2xl">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            fill
            src={slides[current].bg}
            alt=""
            className="object-cover object-center"
            priority
          />
          {/* overlay */}
          <div className="absolute inset-0 bg-black/40 rounded-3xl"></div>
          {/* Content */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2  z-10 flex flex-col justify-center items-center h-full px-4 text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col items-center justify-center gap-4"
            >
             <div className="bg-white/10 rounded-full backdrop:backdrop-blur-md p-6 shadow-lg">{slides[current].icon}</div>
              <h1 className="text-3xl sm:text-5xl md:text-5xl text-center drop-shadow-lg tracking-tight font-extrabold">
                {slides[current].title}
              </h1>
              <p className="text-lg md:text-lg text-gray-200 text-center max-w-2xl mx-auto drop-shadow-md">
                {slides[current].subtitle}
              </p>
              <div className="flex justify-center mt-8">
                <motion.button
                whileTap={{scale:0.95}} className="px-8 py-3 bg-white text-green-700 font-semibold rounded-full hover:bg-green-100 hover:scale-105 transition-all duration-300 cursor-pointer shadow-lg flex items-center gap-2">
                  <ShoppingBasket className="w-5 h-5"/>
                  {slides[current].btnText}
                </motion.button>
              </div>
            </motion.div>
          </div>
          {/* Carousel dots */}
          <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-3 z-10">
            {slides.map((slide, index) => (
              <button
                key={slide.id}
                onClick={() => setcurrent(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  current === index ? "bg-white w-8" : "bg-white/50"
                }`}
                aria-label={`slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default HeroSection;
