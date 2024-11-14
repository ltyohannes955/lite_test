"use client";
import React from "react";
import Footer from "../Footer/page";
import { VscAccount } from "react-icons/vsc";
import Link from "next/link";

const Landing = () => {
  const userid = localStorage.getItem("userId");
  return (
    <>
      <div className="h-[500px] w-full flex flex-col items-center justify-center bg-gradient-to-br from-[#5C1B96] via-[#5D4792] via-[#5E7E8C] via-[#7B549A] via-[#9E21AA] via-[#A5139C] to-[#C825B8]">
        {/* Header */}
        <div className="w-full flex justify-between items-center px-8 absolute top-0 h-16">
          <p className="text-white font-[Jaro] text-lg">LIYT</p>
          <div className="flex space-x-6 text-white">
            <Link href={"/Landing"}>
              {" "}
              <p>Home</p>
            </Link>
            <Link href={"/About"}>
              {" "}
              <p>About</p>
            </Link>
            {userid !== null ? (
              <Link href={"/Dashboard"}>
                {" "}
                <p>Dashboard</p>
              </Link>
            ) : null}
          </div>
          {userid === null ? (
            <button
              className="text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-purple-600 transition"
              onClick={() => (window.location.href = "/signup")}
            >
              Sign Up
            </button>
          ) : (
            <Link href={"/Profile"}>
              <VscAccount className="text-white text-4xl" />
            </Link>
          )}
        </div>

        {/* Main Content */}
        <h1 className="text-white text-5xl font-bold text-center mt-16">
          Revolutionize your delivery system
        </h1>
        <p className="text-white text-lg text-center max-w-md mt-4">
          Discover amazing features and learn more about us.
        </p>
        <button className="px-6 py-3 mt-8 bg-purple-600 rounded-lg text-white font-semibold hover:bg-purple-700 transition">
          Get Started
        </button>
      </div>

      <div className="w-full flex justify-center gap-8 mt-16 px-8 pb-16">
        {/* Card 1 */}
        <div
          className="relative w-[500px] h-[400px] bg-cover bg-center rounded-lg"
          style={{ backgroundImage: "url(img/image.svg)" }}
        >
          <div className="absolute bottom-4 left-4 w-full p-4">
            <p className="text-white text-xl font-bold">Card 1 Title</p>
            <p className="text-white text-sm">Description for card 1</p>
          </div>
        </div>

        {/* Card 2 */}
        <div
          className="relative w-[500px] h-[400px] bg-cover bg-center rounded-lg"
          style={{ backgroundImage: "url(img/image2.svg)" }}
        >
          <div className="absolute bottom-4 left-4 w-full p-4">
            <p className="text-white text-xl font-bold">Card 2 Title</p>
            <p className="text-white text-sm">Description for card 2</p>
          </div>
        </div>

        {/* Card 3 */}
        <div
          className="relative w-[500px] h-[400px] bg-cover bg-center rounded-lg"
          style={{ backgroundImage: "url(img/image3.svg)" }}
        >
          <div className="absolute bottom-4 left-4 w-full p-4">
            <p className="text-white text-xl font-bold">Card 3 Title</p>
            <p className="text-white text-sm">Description for card 3</p>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default Landing;
