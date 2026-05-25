"use client";

import { useState } from "react";

import Link from "next/link";
import {
  Eye,
  EyeOff,
  Leaf,
  Mail,
  User,
  Lock,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { motion } from "framer-motion";
import axios from "axios";
import { signIn } from "next-auth/react";
type PrevProps = {
  setStep: (step: number) => void;
};

const RegisterForm = ({ setStep }: PrevProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const registerUserhandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await axios.post("/api/auth/register", {
        name: name,
        email: email,
        password: password,
      });
      console.log(result.data);
      setLoading(false);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };


  const GoogleSignup =async () =>{
    await signIn("google");
  }
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-white px-6 py-10">
      {/* Back Button */}
      <button
        onClick={() => setStep(0)}
        className="absolute left-8 top-6 text-green-600 font-medium hover:text-   green-700 transition"
      >
        ← Back
      </button>

      <div className="w-full max-w-md">
        {/* Heading */}
        <div className="text-center space-y-2">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold text-green-600"
          >
            Create Account
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex items-center justify-center gap-1 text-gray-500"
          >
            Join SmartCart today
            <Leaf size={16} className="text-green-600" />
          </motion.p>
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mt-8 space-y-4 max-w-[420px] mx-auto"
          onSubmit={registerUserhandler}
        >
          {/* Name */}
          <div className="relative">
            <User
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Your Name"
              required
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              onChange={(e) => setname(e.target.value)}
              value={name}
            />
          </div>

          {/* Email */}
          <div className="relative">
            <Mail
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="email"
              placeholder="Your Email"
              required
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-4 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
          </div>

          {/* Password */}
          <div className="relative">
            <Lock
              size={20}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Your Password"
              required
              className="w-full rounded-xl border border-gray-200 py-3 pl-12 pr-12 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-100"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
            >
              {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
            </button>
          </div>

          {/* Register Button */}
          <button
            type="submit"
            className="w-full rounded-xl cursor-pointer active:scale-95 bg-gray-200 py-3 font-semibold text-gray-700 transition hover:bg-green-600 hover:text-white"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 mx-auto animate-spin" />
            ) : (
              "Register"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">OR</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Google Button */}
          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-gray-200 py-3 cursor-pointer font-medium text-gray-700 transition hover:bg-gray-50 active:scale-95"
            onClick={GoogleSignup}
          >
            <img
              src="https://www.svgrepo.com/show/475656/google-color.svg"
              alt="google"
              className="h-5 w-5"
            />
            Continue with Google
          </button>

          {/* Sign In */}
          <p className="text-center text-sm text-gray-500">
            Already have an account ?
            <Link
              href="/login"
              className="ml-2 inline-flex items-center gap-1 font-medium text-green-600 hover:text-green-700"
            >
              <ArrowRight size={14} />
              Sign in
            </Link>
          </p>
        </motion.form>
      </div>
    </div>
  );
};

export default RegisterForm;
