import React, { useEffect } from "react";
import { FiArrowRight } from "react-icons/fi";
import { Link } from "react-router-dom";


const LandingPage = () => {

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <div
        className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `url("https://i.postimg.cc/6qZSwzWd/sfondo-about.jpg")`
        }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        <div className="relative text-center px-4 sm:px-6 lg:px-8" data-aos="fade-up">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
          Sustainability and Innovation, at your feet.
          </h1>
          <p className="text-xl sm:text-2xl text-gray-100 mb-8 text-shadow-lg">
          The first eco-friendly footwear marketplace where sustainability meets Web3 innovation.
          </p>
          <Link to="/aboutus">
  <button className="bg-white/10 backdrop-blur-md
    border border-white/20
    text-white font-semibold
    px-8 py-3 rounded-lg
    transition duration-300
    transform hover:scale-105
    hover:bg-white/20
    flex items-center mx-auto">
    Explore Our Mission
    <FiArrowRight className="ml-2" />
  </button>
</Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
