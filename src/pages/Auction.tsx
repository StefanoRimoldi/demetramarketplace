import React, { useEffect, useState } from 'react';
import { NFTData } from '../data/nftData';
import { Link } from 'react-router-dom';
import { FaEthereum } from 'react-icons/fa';
import { MdVerified, MdContentCopy } from 'react-icons/md';
import { RiAuctionLine } from "react-icons/ri";
import { Trash2 } from "lucide-react";

import auctionContractABI from '../contracts-abi/NFTAuction.json';
import contractABI from '../contracts-abi/NFTMarketplace.json';

interface AuctionStatus { [key: number]: boolean; }

const NftAuctionGallery: React.FC = () => {
  const [auctionStatus, setAuctionStatus] = useState<AuctionStatus>({});
  
  // Gestisci un timer per ogni NFT
  const [remainingTimes, setRemainingTimes] = useState<{ [key: number]: number }>({});
  const [lastBids, setLastBids] = useState<{ [key: number]: any }>({});


  // Carica auction status
  useEffect(() => {
    const auctionObj: AuctionStatus = {};
    Object.keys(NFTData).forEach(id => {
      const timerKey = `timer_${id}`;
      auctionObj[parseInt(id)] = !!localStorage.getItem(timerKey);
    });
    setAuctionStatus(auctionObj);
  }, []);

  // Mappa i dati raw e aggiungi isAuction
  const NFTs = Object.keys(NFTData).map(id => {
    const idx = parseInt(id);
    const raw = NFTData[idx];
    const isAuction = auctionStatus[idx];
    return {
      id: idx,
      ...raw,
      isAuction
    };
  });

  const handleDelete = (id: number) => {
    setVisibleNFTs(prev => prev.filter(nft => nft.id !== id));
  };

  // Filtra solo gli NFT in asta
  const filteredNFTs = NFTs.filter(nft => nft.isAuction);
  const [visibleNFTs, setVisibleNFTs] = useState(filteredNFTs);


  // Funzione per calcolare il tempo rimanente per ogni NFT
  useEffect(() => {
    filteredNFTs.forEach(nft => {
      const timerEnd = parseInt(localStorage.getItem(`timer_${nft.id}`) || '0'); // Ottieni la data di fine asta dall'archivio
      if (timerEnd) {
        const interval = setInterval(() => {
          const remaining = timerEnd - Date.now();
          setRemainingTimes(prev => ({
            ...prev,
            [nft.id]: remaining
          }));
          if (remaining <= 0) {
            clearInterval(interval);  // Ferma il timer quando è scaduto
          }
        }, 1000);
      }
    });
  }, [filteredNFTs]);

  useEffect(() => {
    setVisibleNFTs(filteredNFTs);
  }, [filteredNFTs]);

  useEffect(() => {
    const bidsData: { [key: number]: any } = {};
    filteredNFTs.forEach(nft => {
      const stored = localStorage.getItem(`bids_${nft.id}`);
      const storedBids = stored ? JSON.parse(stored) : [];
      if (storedBids.length > 0) {
        const highest = storedBids.reduce(
          (max: any, bid: any) =>
            parseFloat(bid.amount) > parseFloat(max.amount) ? bid : max,
          storedBids[0]
        );
        bidsData[nft.id] = highest;
      }
    });
    setLastBids(bidsData);
  }, [filteredNFTs]);
  
  
  

  return (
    <div className="pt-24 px-6 py-10 bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-6 text-gray-300 pb-5">NFTs in Auction</h1>
      
      {filteredNFTs.length === 0 && (
          <div className="w-full flex items-center justify-center">
            <div className="max-w-lg w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-center">
              <div className="mx-auto w-24 h-24 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6">
                <RiAuctionLine className="w-12 h-12 text-gray-500 dark:text-gray-400" />
              </div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                No NFTs Available for Bidding
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mb-8">
                Check back later or explore other collections
              </p>
              <Link
                to="/"
                className="w-full px-4 py-3 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 mt-4"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}


      <div className={`${
    filteredNFTs.length === 1
      ? 'flex justify-center'
      : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'
  }`}>
        {visibleNFTs.map(nft => (
          <div
            key={nft.id}
            className={`max-w-sm mx-auto backdrop-blur-md 
            bg-white/10 border border-white/20 rounded-xl shadow-2xl overflow-hidden hover:shadow-blue-500/20 transition-all duration-300 flex flex-col ${
              nft.isAuction ? 'border-gray-700' : 'opacity-50 grayscale border-red-500'
            }`}
          >
            <div className="relative group">
              <Link to={`/NFTdetails`} state={{ id: nft.id }}>
                <img
                  src={nft.imageUrl}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </Link>
            </div>

            <div className="p-6 flex flex-col flex-1">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-white">{nft.title}</h3>
                <MdVerified className="text-blue-500 text-xl" />
              </div>

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

              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center space-x-2">
                  <FaEthereum className="text-blue-500 text-xl" />
                  <span className="text-white text-xl font-bold">{nft.price} ETH</span>
                </div>
                <span className="text-sm px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-400">
                  Auction
                </span>
              </div>

              <div className="mb-8">
                <div className="flex items-center justify-between">
                {remainingTimes[nft.id] > 0 ? (
                    <div className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-600 text-center shadow-inner">
                        <p className="text-sm font-medium text-gray-400 mb-1">Time remaining</p>
                        <p className="text-lg font-bold tracking-wider text-emerald-400">
                        {String(Math.floor(remainingTimes[nft.id] / 60000)).padStart(2, '0')}:
                        {String(Math.floor((remainingTimes[nft.id] % 60000) / 1000)).padStart(2, '0')}
                        </p>
                    </div>
                    ) : (
                    <div className="bg-red-900 text-white px-4 py-2 rounded-xl border border-red-700 text-center shadow-inner">
                        <p className="text-sm font-medium text-red-300 mb-1">Auction ended</p>
                    </div>
                    )}
                    <div className="bg-gray-800 text-white px-4 py-2 rounded-xl border border-gray-600 text-center shadow-inner">
                        <p className="text-sm font-medium text-gray-400 mb-1">Last Bid</p>
                        <p className="text-lg font-bold tracking-wider text-blue-400">
                        {lastBids[nft.id]?.amount ?? '—'}
                        </p>
                    </div>


                </div>
              </div>

              <div className="flex space-x-4 mt-auto">
                <Link to={`/NFTdetails`} state={{ id: nft.id }}>
                    <button className="flex-1 bg-emerald-700 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200">
                    Details
                    </button>
                </Link>
                <button 
                    onClick={() => {
                        localStorage.removeItem(`timer_${nft.id}`);

                        setAuctionStatus(prev => {
                        const newStatus = { ...prev };
                        delete newStatus[nft.id];
                        return newStatus;
                        });

                        setRemainingTimes(prev => {
                        const newTimes = { ...prev };
                        delete newTimes[nft.id];
                        return newTimes;
                        });
                    }}
                    className="w-full bg-red-700 hover:bg-red-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-200 flex items-center justify-center gap-2"
                    >
                        <Trash2 size={20} />
                    Delete
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NftAuctionGallery;
