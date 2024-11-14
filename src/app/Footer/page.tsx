import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-purple-700 via-purple-500 to-pink-500 text-white py-7 ">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-4">
          {/* Logo */}
          <div className="text-3xl font-bold">LIYT</div>

          {/* Text */}
          <div className="text-center md:text-left my-4 md:my-0">
            <p>Lorem Ipsum is simply dummy text of the</p>
            <p>printing and typesetting industry. Lorem Ipsum has been the</p>
          </div>

          {/* Navigation Links */}
          <div className="space-x-4 flex flex-row">
            <a href="#home" className="hover:text-gray-300">Home</a>
            <a href="#about" className="hover:text-gray-300">About</a>
            <a href="#services" className="hover:text-gray-300">Services</a>
            <a href="#contact" className="hover:text-gray-300">Contact</a>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-400 pt-4 text-center">
          <p>Copyright © 2024. All rights reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
