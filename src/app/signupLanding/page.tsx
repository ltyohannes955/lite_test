"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

const LandingPage = () => {
  const router = useRouter();

  return (
    <motion.div
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      className="flex items-center justify-center min-h-screen bg-gray-100 h-screen"
    >
      <motion.div
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="flex items-center justify-center bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-20 rounded-lg shadow-lg w-full h-full"
      >
        <div className="bg-white shadow-lg w-1/2 h-1/2 rounded-lg p-10 text-center space-y-8">
          <h1 className="text-5xl font-bold text-purple-600 mb-4">LIYT</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Revolutionize Your Delivery System
          </h2>
          <p className="text-lg text-gray-600 mb-8">I am</p>
          <div className="flex justify-center gap-4">
            <motion.button
              initial={{ opacity: 0, x: -100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="w-1/2 px-6 py-3 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition duration-300"
              onClick={() => router.push("/signup")}
            >
              Business Owner
            </motion.button>
            <motion.button
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="w-1/2 px-6 py-3 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition duration-300"
              onClick={() => router.push("/signupDriver")}
            >
              Driver
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LandingPage;
