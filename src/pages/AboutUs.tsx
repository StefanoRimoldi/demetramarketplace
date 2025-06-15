import React from "react";
import { Link } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50">
        <div
                className="relative min-h-screen flex items-center justify-center bg-cover bg-center"
                style={{
                  backgroundImage: `url("https://i.postimg.cc/HkzNprgP/Firefly-20250424000207.png")`
                }}
              >
                <div className="absolute inset-0 bg-black bg-opacity-40"></div>
                <div className="relative text-center px-4 sm:px-6 lg:px-8" data-aos="fade-up">
                  <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
                  Innovating Fashion for a Better Tomorrow
                  </h1>
                  <p className="text-xl sm:text-2xl text-gray-100 mb-8 text-shadow-lg">
                  Where innovation meets sustainability, shaping the fashion of tomorrow.
                  </p>
                  <Link to="/">
          <button className="bg-white/10 backdrop-blur-md
            border border-white/20
            text-white font-semibold
            px-8 py-3 rounded-lg
            transition duration-300
            transform hover:scale-105
            hover:bg-white/20
            flex items-center mx-auto">
            Return to Gallery
            <FiArrowLeft className="ml-2" />
            </button>
            </Link>
                </div>
              </div>

      <div className="px-6 py-10 bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] min-h-screen">
  <section className="py-14">
    <div className="flex flex-col md:flex-row items-center justify-center gap-12">
      
      {/* Text content */}
      <div className="text-center md:text-left max-w-xl pl-6 md:pl-16">
        <h2 className="text-3xl font-bold text-gray-300 mb-6">Our Mission</h2>
        <p className="text-xl text-gray-400 leading-relaxed">
        We aim to create sustainable and accessible footwear for everyone, without compromising on quality, comfort, or style.
Our sneakers are designed to fit your active, urban lifestyle, using innovative materials and low-impact production methods
such as bio-polymers, regenerated and cruelty-free fabrics, and plastic-free, 100% recyclable packaging.
        </p>
      </div>

      {/* Image */}
      <div className="flex justify-center md:justify-end">
        <img 
          src="/images/materials.png" 
          alt="Our Mission Visual" 
          className="max-w-md w-full h-auto"
        />
      </div>

    </div>
  </section>




  <section className="py-4">
  <div className="flex flex-col md:flex-row-reverse items-center max-w-7xl mx-auto px-6 md:px-12">
    {/* Testo - prima su mobile */}
    <div className="w-full md:w-1/2 md:pr-12 text-center md:text-left">
      <h2 className="text-3xl font-bold text-gray-300 mb-6">The Difference We Make</h2>
      <p className="text-xl text-gray-400 leading-relaxed">
      Fashion can be a force for good. Every choice we make from local production to the selection of our suppliers is guided by respect for the environment and for people.
      We reduce waste, give new value to leftovers, and invest in research to build a more responsible future.
      </p>
    </div>

    {/* Immagine - sotto su mobile */}
    <div className="w-full md:w-1/2 mb-10 md:mb-0">
      <img 
        src="https://i.postimg.cc/s27C3VTB/shoes-sustain.png"  // <-- aggiorna il percorso se necessario
        alt="Impact Visual" 
        className="w-full h-auto max-w-md mx-auto md:mx-0"
      />
    </div>
  </div>
</section>



<section className="py-4 border-b border-gray-200">
  <div className="flex flex-col-reverse md:flex-row-reverse items-center max-w-7xl mx-auto px-10 md:px-12">
    {/* Immagine - sotto su mobile, sinistra su desktop */}
    <div className="w-full ml-10 mt-10 md:w-1/2 mb-10 md:mb-0">
      <img 
        src="/images/3440658.png"  // <-- aggiorna il percorso se necessario
        alt="Demetra Web3 Visual" 
        className="w-full h-auto max-w-md mx-auto md:mx-0"
      />
    </div>

    {/* Testo - sopra su mobile, destra su desktop */}
    <div className="w-full md:w-1/2 md:pl-12 text-center md:text-left">
      <h2 className="text-3xl font-bold text-gray-300 mb-6">Demetra and Web3</h2>
      <p className="text-xl text-gray-400 leading-relaxed">
      With Demetra, we aim to bring sustainable fashion into the digital world by building an active and conscious community through Web3 technology.
Each NFT represents not just a collectible item, but also a way to support ethical values and take part in the development of the project.


      </p>
    </div>

  </div>
</section>


        <section className="py-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-300">What’s included with a Demetra NFT?</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Exclusive discounts</h3>
              <p className="text-gray-400">Exclusive discounts on all current and future collections</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Exclusive Events</h3>
              <p className="text-gray-400">Exclusive online and in-person events</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Inclusive Design</h3>
              <p className="text-gray-400">Opportunity to participate in the design of future limited editions</p>
            </div>
            <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow">
              <h3 className="text-xl font-semibold text-gray-300 mb-4">Premium NFT</h3>
              <p className="text-gray-400">A unique, collectible digital item, verified on the blockchain</p>
            </div>
          </div>
        </section>
        <div className="flex justify-center mt-8 mb-8">

        <button 
            onClick={() => window.location.href = '/'} // Sostituisci con il percorso della tua galleria
            className="bg-emerald-500 text-white py-3 px-8 rounded-full text-xl font-semibold transition duration-300 transform hover:scale-105 hover:bg-emerald-600"
            >
            Explore Our Gallery
            </button>
            </div>


        <div className="bg-black py-20 px-6 text-center rounded-xl shadow-lg">
            <p className="text-white text-2xl md:text-3xl font-semibold max-w-4xl mx-auto leading-snug">
                We believe in change <span className="text-emerald-400">and we walk it, one step at a time.</span>
            </p>
            </div>

      </div>
    </div>
  );
};

export default AboutUs;
