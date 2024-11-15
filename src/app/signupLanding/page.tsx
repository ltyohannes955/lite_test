"use client";
import React from "react";
import { useRouter } from "next/navigation";

const LandingPage = () => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 p-20 rounded-lg shadow-lg">
        <div className="bg-white shadow-lg rounded-lg max-w-xl w-full p-10 text-center space-y-8">
          <h1 className="text-5xl font-bold text-purple-600 mb-4">LIYT</h1>
          <h2 className="text-3xl font-semibold text-gray-800 mb-6">
            Revolutionize Your Delivery System
          </h2>
          <p className="text-lg text-gray-600 mb-8">I am</p>
          <div className="flex justify-center gap-4">
            <button
              className="px-6 py-3 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition duration-300"
              onClick={() => router.push("/signup")}
            >
              Business Owner
            </button>
            <button
              className="px-6 py-3 border border-purple-500 text-purple-500 rounded-lg hover:bg-purple-500 hover:text-white transition duration-300"
              onClick={() => router.push("/signupDriver")}
            >
              Driver
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
