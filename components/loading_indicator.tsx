"use client";

import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <motion.div
        className="w-12 h-12 border-4 border-t-transparent border-blue-500 rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      />
    </div>
  );
};

export default LoadingSpinner;
