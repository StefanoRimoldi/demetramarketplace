import React, { useEffect, useState } from 'react';
import { useWallet } from '../context/WalletContext';
import { FiFolder } from 'react-icons/fi';
import { FaEthereum } from 'react-icons/fa';
import { IoQrCode } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import NFTInfo from '../components/NftInfo';
import { NFTData as initialNFTData } from '../data/nftData';

interface NFT {
    nftId: string;
    title: string;
    imageUrl: string;
    price: string;
    rarity: string;
    discount: string;
    qrImageUrl: string;
    [key: string]: any;
}

const MyNFTs = () => {
    const { account } = useWallet();
    const [myNFTs, setMyNFTs] = useState<NFT[]>([]);
    const [filteredNFTs, setFilteredNFTs] = useState<NFT[]>([]);
    const [selectedRarity, setSelectedRarity] = useState<string>('All');
    const [isQrModalOpen, setIsQrModalOpen] = useState(false);
    const [selectedNFT, setSelectedNFT] = useState<NFT | null>(null);

    useEffect(() => {
        if (!account) return;

        const purchasesData = localStorage.getItem('purchases');
        const transfersData = localStorage.getItem('nft-transfers');
        const nftDataString = localStorage.getItem("nftData");

        const allPurchases = purchasesData ? JSON.parse(purchasesData) : {};
        const purchased = allPurchases[account] || [];

        const allTransfers = transfersData ? JSON.parse(transfersData) : [];
        const received = allTransfers
            .filter((t: any) => t.to?.toLowerCase() === account.toLowerCase())
            .map((t: any) => ({ ...t }));

        const combined = [...purchased, ...received];

        const enrichedNFTs = combined.map((item) => {
            return {
                ...item,
                title: item.title || 'Untitled',
                imageUrl: item.imageUrl || '',
                price: item.price || '0',
                rarity: item.rarity || 'Unknown',
                discount: item.discount || '0%',
                qrcode: item.qrcode || '',
            };
        });

        setMyNFTs(enrichedNFTs);
        setFilteredNFTs(enrichedNFTs);
    }, [account]);

    const handleRarityChange = (rarity: string) => {
        setSelectedRarity(rarity);
        if (rarity === 'All') {
            setFilteredNFTs(myNFTs);
        } else {
            setFilteredNFTs(myNFTs.filter((nft) => nft.rarity === rarity));
        }
    };

    const openQrModal = (nft: NFT) => {
        setSelectedNFT(nft);
        setIsQrModalOpen(true);
    };

    const closeQrModal = () => {
        setIsQrModalOpen(false);
        setSelectedNFT(null);
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] px-6 pt-28 pb-20">
            {/* ... (resto del codice) */}

            <div className="max-w-7xl mx-auto">
                {filteredNFTs.length === 0 ? (
                    // ... (codice per "You don't have any NFTs")
                    <div className="flex justify-center items-center min-h-[400px]">
                        <div className="max-w-md w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-center">
                            <div className="mx-auto w-24 h-24 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6">
                                <span className="text-4xl text-gray-300"><FiFolder /></span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-300 mb-4">
                                You don't have any NFTs
                            </h2>
                            <p className="text-gray-400 mb-6">
                                You haven't collected any NFTs yet. Buy or receive one to see it here!
                            </p>
                            <Link
                                to="/"
                                className="w-full px-4 py-3 rounded-md font-semibold bg-red-600 text-white hover:bg-red-700 mt-4">
                                Go to Home
                            </Link>
                        </div>
                    </div>
                ) : (
                    <div className="flex justify-center">
                        <div className="rounded-xl p-6 w-full">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {filteredNFTs.map((nft, index) => (
                                    <div
                                        key={index}
                                        className={`max-w-sm mx-auto backdrop-blur-md 
                                          bg-white/10 border border-white/20 rounded-xl shadow-2xl overflow-hidden hover:shadow-blue-500/20 transition-all duration-300 flex flex-col ${
                                            parseFloat(nft.discount) > 0 ? 'opacity-90' : 'opacity-100'
                                          }`}
                                    >
                                        <div className="relative group">
                                            
                                                <img
                                                    src={nft.imageUrl}
                                                    alt={nft.title}
                                                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300 cursor-pointer" //  Aggiungi cursor-pointer
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src =
                                                            "https://images.unsplash.com/photo-1634973357973-f2ed2657db3c";
                                                    }}
                                                />
                                            

                                            {/* Rarity badge */}
                                            <div className="absolute top-2 right-2 bg-gray-900/80 px-3 py-1 rounded-full">
                                                <span className="text-yellow-500 text-sm font-semibold">{nft.rarity}</span>
                                            </div>

                                            {/* Discount badge inside image container */}
                                            {parseFloat(nft.discount) > 0 && (
                                                <div className="absolute bottom-2 left-2 bg-gradient-to-r from-green-400 to-green-600 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                                                    {nft.discount}%
                                                </div>
                                            )}
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-xl font-bold text-white">{nft.title}</h3>
                                            </div>

                                            <div className="flex items-center justify-between mb-8">
                                                <div className="flex items-center space-x-2">
                                                    <FaEthereum className="text-blue-500 text-xl" />
                                                    <span className="text-white text-xl font-bold">{nft.price} ETH</span>
                                                </div>
                                                <button
                                                    className="text-gray-400 hover:text-gray-300"
                                                    onClick={() => openQrModal(nft)}
                                                >
                                                    <IoQrCode size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* QR Modal */}
            {isQrModalOpen && selectedNFT && (
                // ... (codice della modale QR)
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
                    <div className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8 my-8 max-h-[90vh] mx-8 overflow-auto">
                        <button
                            onClick={closeQrModal}
                            className="absolute right-4 top-4 text-gray-400 transition-colors hover:text-gray-600 focus:outline-none"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>

                        <div className="text-center">
                            <h2 className="mb-4 text-2xl font-bold text-gray-900">{selectedNFT.title}</h2>

                            {/* Mostriamo l'immagine del QR code che è stata salvata nel localStorage */}
                            <div className="mb-6 flex justify-center">
                                <div className="rounded-xl bg-white p-4">
                                    <img
                                        src={selectedNFT.qrcode}
                                        alt="QR Code"
                                        className="w-full h-auto rounded-xl"
                                    />
                                </div>
                            </div>

                            {/* Sconto e offerta */}
                            {parseFloat(selectedNFT.discount) > 0 && (
                                <div className="space-y-4 mb-6">
                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <h3 className="mb-2 text-lg font-semibold text-gray-900">Limited Time Offer</h3>
                                        <p className="text-3xl font-bold text-emerald-600">{selectedNFT.discount}% OFF</p>
                                        <p className="mt-2 text-sm text-gray-600">Use code: {selectedNFT.title}</p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-4">
                                        <p className="text-sm text-gray-600">
                                            Congratulazioni! Con il tuo NFT puoi partecipare agli eventi Demetra e
                                            usufruire di uno sconto esclusivo in negozio.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyNFTs;