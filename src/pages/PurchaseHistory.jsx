import React, { useState, useEffect } from 'react';
import { useWallet } from '../context/WalletContext';
import { NFTData as initialNFTData } from '../data/nftData';
import { Trash2 } from 'lucide-react';
import { FaWallet } from 'react-icons/fa';

const useNFTData = (account) => {
  const [purchasedNFTs, setPurchasedNFTs] = useState([]);
  const [receivedNFTs, setReceivedNFTs] = useState([]);
  const [NFTData, setNFTData] = useState(initialNFTData);

  useEffect(() => {
    if (!account) return;

    const purchases = JSON.parse(localStorage.getItem('purchases')) || {};
    const userPurchases = purchases[account] || [];
    setPurchasedNFTs(userPurchases);

    const transfers = JSON.parse(localStorage.getItem('nft-transfers')) || [];
    const userTransfers = transfers.filter(
      (t) => t.to?.toLowerCase() === account.toLowerCase()
    );
    setReceivedNFTs(userTransfers);

    const storedNFTs = JSON.parse(localStorage.getItem('nftData')) || initialNFTData;
    setNFTData(storedNFTs);
  }, [account]);

  const getNFTDetails = (nftId) => {
    return NFTData?.[String(nftId)] || {};
  };

  const deletePurchase = (nftId) => {
    const updated = purchasedNFTs.filter((item) => item.nftId !== nftId);
    const all = JSON.parse(localStorage.getItem('purchases')) || {};
    all[account] = updated;
    localStorage.setItem('purchases', JSON.stringify(all));
    setPurchasedNFTs(updated);
  };

  const deleteTransfer = (transferId) => {
    const updated = receivedNFTs.filter((item) => item.timestamp !== transferId);
    const all = JSON.parse(localStorage.getItem('nft-transfers')) || [];
    const filtered = all.filter((item) => item.timestamp !== transferId);
    localStorage.setItem('nft-transfers', JSON.stringify(filtered));
    setReceivedNFTs(updated);
  };

  return { purchasedNFTs, receivedNFTs, getNFTDetails, deletePurchase, deleteTransfer };
};

const PurchaseHistory = () => {
  const { isWalletConnected, account, connectWallet } = useWallet();
  const {
    purchasedNFTs,
    receivedNFTs,
    getNFTDetails,
    deletePurchase,
    deleteTransfer,
  } = useNFTData(account);

  const renderNFTCard = (item, type = 'purchase') => {
    const details = getNFTDetails(item.nftId);
    const title = item.title || details.title || `NFT #${item.nftId}`;
    const imageUrl = item.imageUrl || details.imageUrl || '/images/fallback.png';
    const price = item.price || details.price;
    const rarity = item.rarity || details.rarity;

    return (
      <div
        key={item.timestamp || item.nftId}
        className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg shadow p-4 flex items-center relative"
      >
        <img
          src={imageUrl}
          alt={title}
          className="w-20 h-20 object-cover rounded-lg mr-4"
        />
        <div className="flex-grow">
        <div className="flex items-center">
          <h3 className="font-medium text-lg text-white">{title}</h3>
          {rarity && (
            <p className="bg-gray-900/80 px-3 py-1 rounded-full text-yellow-500 text-sm font-semibold ml-3">
              {rarity}
            </p> // Visualizza la rarità accanto al titolo
          )}
        </div>
        <p className="text-white">
          {type === 'purchase'
            ? `Purchased on: ${new Date(item.date).toLocaleDateString()}`
            : `Received on: ${new Date(item.timestamp).toLocaleDateString()}`}
        </p>
        {type === 'transfer' && (
          <p className="text-gray-300">From: {item.from}</p>
        )}
      </div>
      {type === 'purchase' && (
        <div className="text-right mr-4">
          <p className="font-bold text-lg text-white">{price} ETH</p>
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        </div>
      )}
      <button
        onClick={() =>
          type === 'purchase'
            ? deletePurchase(item.nftId)
            : deleteTransfer(item.timestamp)
        }
        className="text-red-400 hover:text-red-600 ml-2"
        title="Remove"
      >
        <Trash2 size={20} />
      </button>
    </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] text-white px-4 py-8 pt-28">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Activity Logs</h1>

        {isWalletConnected ? (
          <>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Purchased NFTs</h2>
              <div className="grid grid-cols-1 gap-4">
                {purchasedNFTs.length > 0 ? (
                  purchasedNFTs.map((nft) => renderNFTCard(nft, 'purchase'))
                ) : (
                  <div className="w-full bg-white/10 border border-white/20 rounded-lg p-8 text-center text-gray-300 font-semibold">
                    No purchased NFTs found
                  </div>
                )}
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Received NFTs</h2>
              <div className="grid grid-cols-1 gap-4">
                {receivedNFTs.length > 0 ? (
                  receivedNFTs.map((transfer) => renderNFTCard(transfer, 'transfer'))
                ) : (
                  <div className="w-full bg-white/10 border border-white/20 rounded-lg p-8 text-center text-gray-300 font-semibold">
                    No received NFTs found
                  </div>
                )}
              </div>
            </section>
          </>
        ) : (
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="max-w-lg w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-center">
              <div className="mx-auto w-24 h-24 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6">
                <FaWallet className="w-12 h-12 text-white" />
              </div>
              <h2 className="text-3xl font-semibold mb-4">Connect your wallet</h2>
              <p className="text-gray-300 mb-6">To view your purchase and transfer history</p>
              <button
                onClick={connectWallet}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Connect Wallet
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchaseHistory;
