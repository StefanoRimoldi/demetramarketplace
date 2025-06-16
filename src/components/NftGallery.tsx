// @ts-nocheck

import React, { useEffect, useState } from 'react';
import { NFTData } from '../data/nftData';
import { Link } from 'react-router-dom';
import { FaEthereum } from 'react-icons/fa';
import { MdVerified, MdContentCopy } from 'react-icons/md';
import { GiMapleLeaf } from "react-icons/gi";
import NFTInfo from './NftInfo';
import { RiAuctionLine } from "react-icons/ri";

// ★ Rating a foglie
const RatingStars: React.FC<{ rating?: number }> = ({ rating = 0 }) => {
  const leaves: React.ReactElement[] = [];
  for (let i = 1; i <= 5; i++) {
    leaves.push(
      <GiMapleLeaf
        key={i}
        className={`text-green-400 transition-all duration-150 ${i <= rating ? 'opacity-100' : 'opacity-30'}`}
      />
    );
  }
  return <div className="flex space-x-1">{leaves}</div>;
};

interface SoldOutNFTs { [key: number]: boolean; }
interface AuctionStatus { [key: number]: boolean; }

// ★ Pulsante di filtro
const FilterButton: React.FC<{
  label: string;
  value: 'all' | 'active' | 'auction' | 'soldOut';
  active: string;
  onClick: (v: any) => void;
}> = ({ label, value, active, onClick }) => (
  <button
    onClick={() => onClick(value)}
    className={`px-4 py-2 rounded-full transition-all duration-300 ${
      active === value
        ? 'bg-gradient-to-r from-green-500 to-orange-500 text-white'
        : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
    }`}
  >
    {label}
  </button>
);

const NftGallery: React.FC = () => {
  const [soldOutNFTs, setSoldOutNFTs] = useState<SoldOutNFTs>({});
  const [auctionStatus, setAuctionStatus] = useState<AuctionStatus>({});
  const [selectedNFT, setSelectedNFT] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'auction' >('all');

  // Carica soldOut e auction status
  useEffect(() => {
    const sold = JSON.parse(localStorage.getItem('soldOutNFTs') || '{}') as SoldOutNFTs;
    setSoldOutNFTs(sold);

    const auctionObj: AuctionStatus = {};
    Object.keys(NFTData).forEach(id => {
      const timerKey = `timer_${id}`;
      auctionObj[parseInt(id)] = !!localStorage.getItem(timerKey);
    });
    setAuctionStatus(auctionObj);
  }, []);

  // Mappa i dati raw e aggiungi isSoldOut / isAuction
  const NFTs = Object.keys(NFTData).map(id => {
    const idx = parseInt(id);
    const raw = NFTData[idx];
    const isSoldOut = !!soldOutNFTs[idx];
    const isAuction = auctionStatus[idx] && !isSoldOut;
    return {
      id: idx,
      ...raw,
      isSoldOut,
      isAuction
    };
  });

  // Applica il filtro selezionato
  const filteredNFTs = NFTs.filter(nft => {
    if (activeFilter === 'all') return true;
    {/*if (activeFilter === 'soldOut') return nft.isSoldOut; */}
    if (activeFilter === 'auction') return nft.isAuction;
    // active => né soldOut né auction
    return !nft.isSoldOut && !nft.isAuction;
  });

  return (
    <div className="px-6 py-10 bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-300">Discover Exclusive Drops</h1>
      <div className="text-center text-gray-400 mb-10">
        <p className="text-xl sm:text-2xl">Limited collections. Exclusive designs.</p>
        <p className="text-xl sm:text-2xl mt-2">For true pioneers of the Web3 frontier.</p>
      </div>
      {/* Filtri */}
      <div className="flex justify-center space-x-4 mb-10">
        <FilterButton label="All" value="all"    active={activeFilter} onClick={setActiveFilter} />
        <FilterButton label="Active" value="active" active={activeFilter} onClick={setActiveFilter} />
        <FilterButton label="Auction" value="auction" active={activeFilter} onClick={setActiveFilter} />
        {/*<FilterButton label="Sold Out" value="soldOut" active={activeFilter} onClick={setActiveFilter} /> */}
      </div>

      {/* MESSAGGIO DI NESSUN NFT PER ASTA */}
        {activeFilter === 'auction' && filteredNFTs.length === 0 && (
          <div className="min-h-screen w-full flex items-center justify-center">
          <div className="max-w-lg w-full backdrop-blur-md 
      bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-center">
            <div className="mx-auto w-24 h-24 backdrop-blur-md 
      bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6">
              <RiAuctionLine className="w-12 h-12 text-gray-500 dark:text-gray-400" />
            </div>
    
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
            No NFTs Available for Bidding
            </h1>
    
            <p className="text-gray-600 dark:text-gray-300 mb-8">
            Check back later or explore other collections
            </p>
          </div>
        </div>
        )}

      {/* Galleria filtrata */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {filteredNFTs.map(nft => (
          <div
            key={nft.id}
            className={`max-w-sm mx-auto backdrop-blur-md 
      bg-white/10 border border-white/20 rounded-xl shadow-2xl overflow-hidden hover:shadow-blue-500/20 transition-all duration-300 flex flex-col border ${
              nft.isSoldOut ? 'opacity-50 grayscale border-red-500' : 'border-gray-700'
            }`}
          >
            {/* Immagine & Rarity */}
            <div className="relative group">
              <Link to={`/NFTdetails`} state={{ id: nft.id }}>
                <img
                  src={nft.imageUrl}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
              <div className="absolute top-2 right-2 bg-gray-900/80 px-3 py-1 rounded-full">
                <span className="text-yellow-500 text-sm font-semibold">{nft.rarity}</span>
              </div>
            </div>

            {/* Corpo card */}
            <div className="p-6 flex flex-col flex-1">
              {/* Titolo */}
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{nft.title}</h3>
                <MdVerified className="text-blue-500 text-xl" />
              </div>

              {/* Owner */}
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-gray-400 text-sm">Owner:</span>
                <div className="flex items-center space-x-2 bg-gray-700 rounded-lg px-4 py-2 border border-gray-600">
                  <span className="font-mono text-gray-300">
                    {nft.owner.length > 15 ? `${nft.owner.slice(0, 15)}...` : nft.owner}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(nft.owner)}
                    className="text-gray-400 hover:text-white transition-colors"
                    aria-label="Copy address"
                  >
                    <MdContentCopy />
                  </button>
                </div>
              </div>

              {/* Prezzo & Stato */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <FaEthereum className="text-blue-500 text-xl" />
                  <span className="text-white text-xl font-bold">{nft.price} ETH</span>
                </div>
                <span
                  className={`text-sm px-3 py-1 rounded-full ${
                    nft.isSoldOut
                      ? 'bg-red-500/20 text-red-400'
                      : nft.isAuction
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400'
                  }`}
                >
                  {nft.isSoldOut ? 'Sold Out' : nft.isAuction ? 'Auction' : 'Active'}
                </span>
              </div>

              {/* Rating & Materials */}
              <div className="mb-8">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-300">Rating:</span>
                  <RatingStars rating={nft.rating} />
                </div>
                {nft.materials && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg mt-5">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Materials Composition</h4>
                    <div className="space-y-2">
                      {Object.entries(nft.materials as Record<string, number>).map(([mat, pct]) => (
                        <div key={mat} className="flex items-center justify-between">
                          <span className="text-sm capitalize text-gray-600">{mat}</span>
                          <div className="w-2/3 h-2 bg-gray-200 rounded-full overflow-hidden mx-2">
                            <div
                              className="h-full bg-gradient-to-r from-green-600 to-orange-600"
                              style={{ width: `${pct}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-500">{pct}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottoni */}
              <div className="flex justify-center space-x-4 mt-auto">
                <Link to={`/buynow`} state={{ id: nft.id }}>
                  <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-full transform hover:scale-105 transition-all duration-200 w-39">
                    Buy Now
                  </button>
                </Link>
                <Link to={`/NFTdetails`} state={{ id: nft.id }}>
                  <button className="w-full bg-emerald-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200">
                    Place Bid
                  </button>
                </Link>
              </div>


            </div>
          </div>
        ))}
      </div>

      {/* Modale NFTInfo */}
      {selectedNFT && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6 relative">
            <button
              onClick={() => setSelectedNFT(null)}
              className="absolute top-3 right-3 text-black text-xl font-bold"
              aria-label="Close"
            >
              ✕
            </button>
            <NFTInfo nft={selectedNFT} />
          </div>
        </div>
      )}
    </div>
  );
};

export default NftGallery;
