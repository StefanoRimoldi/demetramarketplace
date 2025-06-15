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

      {/* Featured Section 
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-10 md:mb-0" data-aos="fade-right">
              <img
                src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800"
                alt="Featured"
                className="rounded-lg shadow-2xl"
              />
            </div>
            <div className="md:w-1/2 md:pl-12" data-aos="fade-left">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">
                Empower Your Business Growth
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Leverage our platform to scale your operations and reach new heights
              </p>
              <button className="bg-gray-900 hover:bg-gray-800 text-white font-semibold px-8 py-3 rounded-lg transition duration-300">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div> */}

      {/* Card Grid
      <div className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4" data-aos="fade-up">
              Why Choose Us
            </h2>
            <p className="text-xl text-gray-600" data-aos="fade-up" data-aos-delay="100">
              Discover the features that set us apart
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {cards.map((card, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg overflow-hidden transform hover:-translate-y-1 transition duration-300"
                data-aos="fade-up"
                data-aos-delay={index * 100}
              >
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-6">
                  <div className="text-3xl mb-4">{card.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {card.title}
                  </h3>
                  <p className="text-gray-600">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div> */}
    </div>
  );
};

export default LandingPage;
