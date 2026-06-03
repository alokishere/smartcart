"use client";
import mongoose from "mongoose";
import Image from "next/image";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, ShoppingCart, Check, Star } from "lucide-react";

interface IGrocery {
  _id?: mongoose.Types.ObjectId;
  name: string;
  price: string;
  image: string;
  category: string;
  unit: string;
  rating?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

const GroceryItemsCard = ({ item }: { item: IGrocery }) => {
  const [added, setAdded]       = useState(false);
  const [wished, setWished]     = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = () => {
    if (added) return;
    setAdded(true);
    setTimeout(() => setAdded(false), 1600);
  };

  const stars = Math.round(item.rating ?? 4.5);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.025 }}
      className="group relative bg-white border border-green-100 rounded-[20px]
                 overflow-hidden flex flex-col
                 hover:border-green-300 hover:shadow-[0_12px_32px_rgba(46,125,50,0.12)]
                 transition-shadow duration-300"
    >
      {/* ── Image area ── */}
      <div className="relative bg-green-50 h-[140px] sm:h-[160px] flex items-center justify-center overflow-hidden">
        {!imgError ? (
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <span className="text-5xl select-none">🛒</span>
        )}

        {/* Category badge */}
        <span className="absolute top-2.5 left-2.5 bg-green-700 text-white
                         text-[10px] font-bold tracking-wide px-2.5 py-0.5 rounded-full
                         uppercase">
          {item.category}
        </span>

        {/* Wishlist button */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setWished((w) => !w)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-2 right-2.5 w-7 h-7 rounded-full border flex items-center justify-center
                      transition-colors duration-200 bg-white
                      ${wished
                        ? "border-red-300 text-red-400"
                        : "border-green-100 text-gray-300 hover:border-red-200 hover:text-red-300"
                      }`}
        >
          <Heart
            className="w-3.5 h-3.5"
            fill={wished ? "currentColor" : "none"}
            strokeWidth={2}
          />
        </motion.button>
      </div>

      {/* ── Body ── */}
      <div className="flex flex-col flex-1 p-3 sm:p-3.5">
        {/* Name */}
        <h3 className="text-[13px] sm:text-sm font-bold text-gray-800 leading-snug line-clamp-2 mb-1">
          {item.name}
        </h3>

        {/* Unit */}
        <p className="text-[11px] text-gray-400 font-semibold mb-2">{item.unit}</p>

        {/* Stars */}
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-3 h-3 ${i < stars ? "text-amber-400" : "text-gray-200"}`}
              fill={i < stars ? "currentColor" : "none"}
              strokeWidth={1.5}
            />
          ))}
          <span className="text-[10px] text-gray-400 font-semibold ml-0.5">
            {(item.rating ?? 4.5).toFixed(1)}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between mt-auto gap-2">
          <div>
            <span className="text-base sm:text-lg font-extrabold text-green-700">
              ₹{item.price}
            </span>
            <span className="text-[10px] text-green-400 font-semibold"> /unit</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.93 }}
            onClick={handleAddToCart}
            aria-label={`Add ${item.name} to cart`}
            className={`flex items-center gap-1.5 text-white text-[11px] sm:text-xs
                        font-bold px-3 py-1.5 rounded-xl transition-all duration-200
                        ${added
                          ? "bg-green-500 cursor-default"
                          : "bg-green-700 hover:bg-green-800 active:scale-95"
                        }`}
          >
            <AnimatePresence mode="wait" initial={false}>
              {added ? (
                <motion.span
                  key="check"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
                  Added!
                </motion.span>
              ) : (
                <motion.span
                  key="cart"
                  initial={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.7 }}
                  transition={{ duration: 0.18 }}
                  className="flex items-center gap-1"
                >
                  <ShoppingCart className="w-3.5 h-3.5" strokeWidth={2} />
                  Add
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default GroceryItemsCard;