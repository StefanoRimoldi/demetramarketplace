import React, { useState } from "react";
import { FaFacebook, FaInstagram, FaLinkedin, FaAngleDown, FaAngleUp, FaGithub } from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  const [expandedSection, setExpandedSection] = useState(null);

  const handleSectionToggle = (section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  const footerSections = [
    {
      title: "Marketplace",
      links: [
        { name: "Products", href: "/" },
        { name: "About Us", href: "/aboutus" },
        { name: "My Collection", href: "/mynfts" },
        { name: "Swap", href: "/swap" },
        { name: "History", href: "/purchase-history" },
        { name: "Auction", href: "/auction" },
        { name: "Mint NFT", href: "/mintnft" }, // <-- qui il percorso corretto
      ],
    },
    {
      title: "Customer Support",
      links: [
        { name: "Help Center", href: "/help" },
        { name: "Shipping Information", href: "/shipping" },
        { name: "Returns Policy", href: "/returns" },
        { name: "Payment Methods", href: "/payments" },
        { name: "Customer Service", href: "/customer-service" },
      ],
    },
  ];
  

  const socialLinks = [
    { icon: <FaFacebook />, href: "#", label: "Facebook" },
    { icon: <FaInstagram />, href: "#", label: "Instagram" },
    { icon: <FaLinkedin />, href: "#", label: "LinkedIn" },
    { icon: <FaGithub />, href: "#", label: "Github" },
  ];

  return (
    <footer className="relative text-gray-200 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('https://i.postimg.cc/2jX855zy/sfondo-footer.jpg')" }}>
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Logo + Descrizione + Social */}
          <div className="space-y-6">
            <img 
              src="/images/logo-demetra.png" 
              alt="Demetra logo" 
              className="h-28 w-28 object-contain" 
            />
            <p className="text-sm mr-7 font-semibold">
            Blending innovation with ethical values, Demetra offers exclusive digital and physical collections, empowering a conscious community through Web3 technology.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="text-2xl hover:text-white transition-colors duration-200"
                  aria-label={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Sezioni Footer */}
          {footerSections.map((section, index) => (
            <div key={index} className="space-y-4">
              <div
                className="flex justify-between items-center md:block cursor-pointer md:cursor-default"
                onClick={() => handleSectionToggle(section.title)}
                onKeyPress={(e) => e.key === "Enter" && handleSectionToggle(section.title)}
                tabIndex={0}
                role="button"
                aria-expanded={expandedSection === section.title}
              >
                <h3 className="text-lg font-semibold text-white">{section.title}</h3>
                <span className="md:hidden">
                  {expandedSection === section.title ? <FaAngleUp /> : <FaAngleDown />}
                </span>
              </div>
              <ul className={`space-y-3 text-sm font-semibold ${expandedSection === section.title ? "block" : "hidden"} md:block`}>
              {section.links.map((link, linkIndex) => (
                <li key={linkIndex}>
                  <Link 
                    to={link.href} 
                    className="hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}

              </ul>
            </div>
          ))}

          {/* Stay in Loop */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-white">Stay in Loop</h3>
            <p className="text-sm">
              Subscribe to our newsletter for the latest updates and exclusive offers.
            </p>
            <form className="flex flex-col space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-2 bg-gray-800 border border-white text-black rounded-lg focus:outline-none focus:ring-2 focus:ring-white"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-white text-gray-900 font-semibold rounded-lg hover:bg-gray-200 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-900"
              >
                Sign Up
              </button>
            </form>
          </div>

        </div>

        {/* Footer Bottom */}
        <div className="mt-12 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm">
              © {new Date().getFullYear()} Demetra Shoes. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
