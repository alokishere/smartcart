"use client";
import { motion } from "framer-motion";
import { Bike, ShoppingBasket } from "lucide-react";
type props = {
  setStep: (step: number) => void;
}
const Welcome = ({ setStep }: props) => {
  return (
    <div className="flex items-center flex-col text-center p-6 justify-center h-screen">
      <motion.div
        initial={{
          y: -20,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex items-center gap-2">
          <h1 className="text-6xl font-bold text-green-600">SmartCart</h1>
          <ShoppingBasket className="h-16 w-16 text-green-600" />
        </div>
      </motion.div>
      <motion.p
        initial={{
          y: 10,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ duration: 0.8 }}
        className="mt-4 text-gray-700 text-lg md:text-xl max-w-lg"
      >
        Your one-stop destination for all things grocery shopping, organic
        produce, and daily essentials. Freshness delivered to your doorstep.
      </motion.p>
      <div className="flex justify-center mt-4 gap-3">
        <motion.div
          initial={{
            x: -20,
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{ duration: 0.8 }}
        >
          <ShoppingBasket className="h-22 w-22 md:w-32 md:h-32 text-green-600" />
        </motion.div>
        <motion.div
          initial={{
            x: 20,
            opacity: 0,
            scale: 0.9,
          }}
          animate={{
            x: 0,
            opacity: 1,
            scale: 1,
          }}
          transition={{ duration: 0.8 }}
        >
          <Bike className="h-22 w-22 md:w-32 md:h-32 text-orange-500" />
        </motion.div>
      </div>
      <motion.button
        initial={{
          y: 10,
          opacity: 0,
        }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ duration: 0.8 }}
        className="px-8 py-2 mt-8 bg-green-600 text-white rounded-xl cursor-pointer font-medium hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
        onClick={() => setStep(1)}
      >
        Next &rarr;
      </motion.button>
    </div>
  );
};

export default Welcome;
