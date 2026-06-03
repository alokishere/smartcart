'use client'
import React from "react";
import { motion } from "framer-motion";
import GroceryItemsCard from "./GroceryItemsCard";

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.07,
    },
  },
};

const PopularProducts = ({ groceryItems }: any) => {


  return (
    <section className="w-full py-10 px-4">
      {/* ── Header ── */}
      <div className="text-center mb-8">
        <span className="inline-block bg-green-100 text-green-700 text-[11px] font-bold
                         tracking-widest uppercase px-4 py-1 rounded-full mb-3">
          Trending now
        </span>
        <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800">
          Popular{" "}
          <span className="text-green-600">Products</span>
        </h2>
        <p className="text-sm text-gray-500 mt-1.5 max-w-sm mx-auto">
          Handpicked freshness — top-rated by your neighbours
        </p>
      </div>

      {/* ── Grid ── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.1 }}
        className="
          w-full max-w-6xl mx-auto
          grid
          grid-cols-2
          sm:grid-cols-3
          md:grid-cols-4
          lg:grid-cols-5
          gap-3 sm:gap-4
        "
      >
        {groceryItems.map((item: any) => (
          <GroceryItemsCard
            key={item._id?.toString() ?? item.name}
            item={JSON.parse(JSON.stringify(item))}
          />
        ))}
      </motion.div>

      {/* ── View all link ── */}
      <div className="text-center mt-8">
        <button className="text-green-700 text-sm font-bold border border-green-300
                           hover:bg-green-50 px-6 py-2 rounded-full transition-colors duration-200">
          View all products →
        </button>
      </div>
    </section>
  );
};

export default PopularProducts;