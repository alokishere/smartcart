"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  Tag,
  ShieldCheck,
  Receipt,
  PackageOpen,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  increaseCartQuantity,
  decreaseCartQuantity,
  removeCartItem,
} from "@/redux/cartSlice";
import mongoose from "mongoose";


const PROMO_CODE = "SMART10";

const CartPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { cartData ,subTotal,deliveryFee,discount,finalTotal } = useSelector((state: RootState) => state.cart);

  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [promoError, setPromoError] = useState(false);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});



  const handlePromo = () => {
    if (promoApplied) return;
    if (promoInput.trim().toUpperCase() === PROMO_CODE) {
      setPromoApplied(true);
      setPromoError(false);
    } else {
      setPromoError(true);
      setTimeout(() => setPromoError(false), 1500);
    }
  };

  const handleDecrease = (id: any) => {
    const item = cartData.find((i) => i._id === id);
    if (!item) return;
    if (item.quantity <= 1) {
      dispatch(removeCartItem(id));
    } else {
      dispatch(decreaseCartQuantity(id));
    }
  };

  // ── Empty state ──────────────────────────────────────────────────────────
  if (cartData.length === 0) {
    return (
      <div className="min-h-screen bg-green-50/40 flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <PackageOpen className="w-12 h-12 text-green-400" strokeWidth={1.5} />
          </div>
          <h2 className="text-2xl font-extrabold text-green-800 mb-2">
            Your cart is empty
          </h2>
          <p className="text-gray-500 text-sm mb-8 max-w-xs mx-auto">
            Looks like you haven&apos;t added anything yet. Start shopping and
            fill it up!
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-green-700 text-white font-bold
                       px-7 py-3 rounded-2xl hover:bg-green-800 transition-colors text-sm"
          >
            <ShoppingCart className="w-4 h-4" />
            Start Shopping
          </Link>
        </motion.div>
      </div>
    );
  }

  // ── Cart page ────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-green-50/40 py-6 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-3 mb-7">
          <Link
            href="/"
            className="w-9 h-9 bg-white border border-green-100 rounded-full
                       flex items-center justify-center text-green-700
                       hover:bg-green-50 transition-colors shadow-sm"
            aria-label="Go back"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <h1 className="text-xl font-extrabold text-green-900">My Cart</h1>
          <span className="bg-green-100 text-green-700 text-[11px] font-bold px-3 py-0.5 rounded-full">
            {subTotal} item{subTotal !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-5 items-start">

          {/* ── Items list ── */}
          <div className="flex flex-col gap-3">
            <AnimatePresence initial={false}>
              {cartData.map((item,index) => (
                <motion.div
                  key={index}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40, height: 0, marginBottom: 0 }}
                  transition={{ duration: 0.28 }}
                  className="bg-white border border-green-100 rounded-[18px] p-3 sm:p-4
                             flex gap-3 sm:gap-4 items-start
                             hover:border-green-300 hover:shadow-[0_4px_16px_rgba(46,125,50,0.08)]
                             transition-all duration-200"
                >
                  {/* Image */}
                  <div className="relative w-[76px] h-[76px] rounded-2xl bg-green-50 shrink-0 overflow-hidden">
                    {!imgErrors[index] ? (
                      <Image    
                        src={item.image}
                        alt={item.name}
                        fill
                        sizes="80px"
                        className="object-cover"
                        onError={() =>
                          setImgErrors((e) => ({ ...e, [index]: true }))
                        }
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🛒
                      </div>
                    )}
                  </div>

                  {/* Body */}
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold text-green-500 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="text-sm font-bold text-gray-800 leading-snug mt-0.5 truncate">
                      {item.name}
                    </h3>
                    <p className="text-[11px] text-gray-400 font-semibold mb-2">
                      {item.unit}
                    </p>

                    <div className="flex items-center justify-between gap-2">
                      {/* Line price */}
                      <div>
                        <span className="text-base font-extrabold text-green-700">
                          ₹{parseFloat(item.price) * item.quantity}
                        </span>
                        {item.quantity > 1 && (
                          <span className="text-[11px] text-gray-400 ml-1">
                            (₹{item.price} each)
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Stepper */}
                        <div className="flex items-center gap-1.5 bg-green-50 rounded-xl px-2 py-1">
                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => handleDecrease(item._id)}
                            aria-label="Decrease quantity"
                            className="w-6 h-6 rounded-full bg-red-100 text-red-500 flex items-center justify-center
                                       hover:bg-red-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" strokeWidth={3} />
                          </motion.button>

                          <span className="text-sm font-bold text-green-800 min-w-[18px] text-center">
                            {item.quantity}
                          </span>

                          <motion.button
                            whileTap={{ scale: 0.88 }}
                            onClick={() => dispatch(increaseCartQuantity(item._id as mongoose.Types.ObjectId))}
                            aria-label="Increase quantity"
                            className="w-6 h-6 rounded-full bg-green-200 text-green-700 flex items-center justify-center
                                       hover:bg-green-300 transition-colors"
                          >
                            <Plus className="w-3 h-3" strokeWidth={3} />
                          </motion.button>
                        </div>

                        {/* Remove */}
                        <motion.button
                          whileTap={{ scale: 0.88 }}
                          onClick={() => dispatch(removeCartItem(item._id as mongoose.Types.ObjectId))}
                          aria-label={`Remove ${item.name}`}
                          className="w-7 h-7 rounded-xl flex items-center justify-center
                                     text-gray-300 hover:text-red-400 hover:bg-red-50
                                     transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* ── Order Summary ── */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-green-100 rounded-[20px] p-5 lg:sticky lg:top-6"
          >
            <h2 className="flex items-center gap-2 text-base font-extrabold text-green-900 mb-5">
              <Receipt className="w-4 h-4 text-green-500" />
              Order Summary
            </h2>

            {/* Rows */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal ({cartData.reduce((acc, item) => acc + item.quantity, 0)} item{cartData.length !== 1 ? "s" : ""})
                </span>
                <span className="font-bold text-gray-800">₹{subTotal}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Delivery fee</span>
                <span className="font-bold text-gray-800">₹{deliveryFee}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Discount</span>
                <span
                  className={`font-bold ${discount > 0 ? "text-red-500" : "text-gray-400"}`}
                >
                  {discount > 0 ? `-₹${discount}` : "—"}
                </span>
              </div>
            </div>

            <div className="border-t border-dashed border-green-100 my-4" />

            <div className="flex justify-between items-center text-base font-extrabold text-green-900 mb-4">
              <span>Total</span>
              <span>₹{finalTotal}</span>
            </div>

            {/* Savings badge */}
            <AnimatePresence>
              {discount > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-green-50 rounded-xl px-3 py-2 flex items-center gap-2 mb-4"
                >
                  <Tag className="w-3.5 h-3.5 text-green-500 shrink-0" />
                  <span className="text-xs font-bold text-green-700">
                    You save ₹{discount} on this order!
                  </span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Promo */}
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={promoInput}
                onChange={(e) => setPromoInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePromo()}
                disabled={promoApplied}
                placeholder="Promo code"
                className={`flex-1 border rounded-xl px-3 py-2 text-xs font-semibold outline-none transition-colors
                           ${promoError
                             ? "border-red-300 bg-red-50"
                             : promoApplied
                             ? "border-green-300 bg-green-50 text-green-700"
                             : "border-green-100 focus:border-green-400"
                           }`}
              />
              <button
                onClick={handlePromo}
                disabled={promoApplied}
                className={`px-4 py-2 rounded-xl text-xs font-bold border transition-colors
                           ${promoApplied
                             ? "bg-green-100 border-green-200 text-green-700 cursor-default"
                             : "bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                           }`}
              >
                {promoApplied ? "Applied ✓" : "Apply"}
              </button>
            </div>
            {promoError && (
              <p className="text-[11px] text-red-500 font-semibold -mt-2 mb-3">
                Invalid promo code. Try <strong>SMART10</strong>
              </p>
            )}

            {/* Checkout */}
            <Link
              href="/user/checkout"

              className="w-full bg-green-700 hover:bg-green-800 text-white font-extrabold
                         py-3.5 rounded-2xl flex items-center justify-center gap-2 text-sm
                         duration-200 active:scale-95 hover:cursor-pointer transition-colors"
            >
              <ShieldCheck className="w-4 h-4" />
              Proceed to Checkout
            </Link>

            <p className="text-center text-[11px] text-gray-400 mt-3 flex items-center justify-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              Secure &amp; encrypted checkout
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;