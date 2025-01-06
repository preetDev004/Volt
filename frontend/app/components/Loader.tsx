"use client";

import { motion } from "framer-motion";

interface LoaderProps {
  subtext?: string;
}

export default function Loader({ subtext = "Charging up..." }: LoaderProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 h-full">
      <div className="relative w-24 h-24 sm:w-32 sm:h-32">
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <motion.path
            d="M50 5 L30 50 L45 50 L25 95 L75 45 L55 45 L70 5 Z"
            fill="none"
            stroke="url(#purpleThunderGradient)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
              repeatType: "reverse",
            }}
          />
          <defs>
            <linearGradient
              id="purpleThunderGradient"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="#C084FC" /> {/* purple-400 */}
              <stop offset="50%" stopColor="#9333EA" /> {/* purple-600 */}
              <stop offset="100%" stopColor="#6B21A8" /> {/* purple-800 */}
            </linearGradient>
          </defs>
        </svg>
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background:
              "radial-gradient(circle, rgba(192,132,252,0.2) 0%, rgba(147,51,234,0.1) 50%, rgba(107,33,168,0) 70%)",
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      <div className="flex flex-col items-center justify-center gap-2">
        <motion.p
          className="mt-4 text-lg sm:text-xl text-white font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {subtext}
        </motion.p>
        <p className="text-sm font-normal text-zinc-400">
          Please wait it might take a few seconds!
        </p>
      </div>
    </div>
  );
}
