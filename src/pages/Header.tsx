import React, { useState, useEffect } from "react";
import { FiMenu, FiX, FiSun, FiMoon } from "react-icons/fi";
import { FaTimes, FaCopy, FaExchangeAlt } from "react-icons/fa";
import { BiNetworkChart } from "react-icons/bi";
import { useWallet } from '../components/context/WalletContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isEthToggled, setIsEthToggled] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  const {
    isWalletConnected,
    account,
    balance,
    network,
    connectWallet,
    disconnectWallet,
  } = useWallet();

  const toggleEth = () => {
    if (isWalletConnected) setIsEthToggled((prev) => !prev);
  };

  const navItems = [
    { id: 1, name: "Marketplace", to: "/" },
    { id: 2, name: "My Collection", to: "/mynfts" },
    { id: 3, name: "Auction", to: "/auction" },
    { id: 4, name: "Swap", to: "/swap" },
    { id: 5, name: "Mint NFT", to: "/mintnft" },
    { id: 6, name: "History", to: "/purchase-history" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const truncateAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const copyToClipboard = async () => {
    try {
      if (!account) return;
      await navigator.clipboard.writeText(account);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch {
      console.error("Copy failed");
    }
  };

  return (
    <header className={`fixed w-full top-0 z-50 transition-all duration-300 ${
    isScrolled
      ? "bg-white/10 backdrop-blur-md shadow-lg"
      : "bg-black-800"}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to="/">
              <img src="/images/logo-demetra.png" alt="Demetra logo" className="h-28 w-28 object-contain" />
            </Link>
          </div>

          <nav className="hidden md:flex flex-1 justify-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.to} // Usa 'to' al posto di 'href'
                className="text-sm text-gray-300 hover:text-orange-400 px-3 py-2 rounded-md font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            {/*<button onClick={toggleDarkMode} className="text-white hover:text-orange-400 p-2 rounded-md transition-colors duration-200">
              {isDarkMode ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>*/}

            {!isWalletConnected ? (
              <button onClick={connectWallet} className="bg-orange-500 hover:bg-orange-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                Connect Wallet
              </button>
            ) : (
              <button onClick={toggleEth} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                {truncateAddress(account)}
              </button>
            )}

            <button onClick={toggleMenu} className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-orange-400 focus:outline-none z-[60]">
              {isOpen ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
          <nav className="md:hidden absolute inset-0 min-h-screen backdrop-blur-md 
            bg-white/70 border border-white/20 z-40 flex flex-col items-center justify-center space-y-8 px-3">
            
            {/* Logo con ombra */}
            <div className="flex flex-col items-center justify-center">
              <img
                src="/images/logo-demetra-shadow.png"
                alt="Logo"
                className="w-36 h-36 object-contain "
              />
            </div>

            {/* Account + Balance in un unico riquadro */}
              <div className="w-full max-w-xs bg-white/50 rounded-xl px-4 py-2 text-center shadow-md border border-gray-200 space-y-1">
              {/* Indirizzo abbreviato più lungo */}
              <div className="font-mono text-sm text-gray-800 font-semibold">
                {account ? `${account.slice(0, 10)}...${account.slice(-4)}` : '0x...'}
              </div>
              {/* Balance con solo le prime cifre */}
              <div className="text-green-900 font-semibold">
                {balance ? `${parseFloat(balance).toFixed(4)} ETH` : '0.0000 ETH'}
              </div>
            </div>


            {/* Navigazione */}
            <div className="flex flex-col items-center space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.to}
                  className="w-full text-center text-lg text-green-700 hover:text-orange-400 px-4 py-2 rounded-xl font-semibold transition-colors duration-200 bg-white/90 shadow-sm border border-white/40"
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </nav>
        )}



      {isEthToggled && (
        <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50 transition-all duration-300">
          <div className="flex items-center justify-center min-h-screen px-4">
            <div className="backdrop-blur-md 
      bg-white/30 border border-white/40 rounded-lg max-w-md w-full p-6 relative">
              <button onClick={toggleEth} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                <FaTimes size={24} />
              </button>

              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-white mb-2">Wallet Connected</h2>
                  <div className="flex items-center justify-center space-x-2 text-gray-300">
                    <BiNetworkChart size={20} />
                    <span>{network}</span>
                  </div>
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Address</span>
                    <button onClick={copyToClipboard} className="text-indigo-400 hover:text-indigo-300 transition-colors">
                      <FaCopy size={16} />
                    </button>
                  </div>
                  <div className="font-mono text-white break-all">{account}</div>
                  {copySuccess && <span className="text-green-400 text-sm mt-1 block">Copied!</span>}
                </div>

                <div className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-300">Balance</span>
                    <span className="text-white font-bold">{balance}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    disconnectWallet();
                    setIsEthToggled(false);
                  }}
                  className="w-full flex items-center justify-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-medium transition-colors"
                >
                  <FaExchangeAlt className="mr-2" />
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
