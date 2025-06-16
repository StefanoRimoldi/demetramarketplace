import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { useLocation } from 'react-router-dom';
import { NFTData } from '../data/nftData';
import contractABI from '../contracts-abi/NFTMarketplace.json';
import auctionContractABI from '../contracts-abi/NFTAuction.json';
import { FaTimes, FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FiClock } from "react-icons/fi";

const NFTInfo = () => {
    const location = useLocation();
    const { id } = location.state || {};
    const [nft, setNft] = useState(NFTData[id]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');

    const { isWalletConnected, account } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [transactionSuccess, setTransactionSuccess] = useState(null);
    const [balance, setBalance] = useState(0);
    const [isSoldOut, setIsSoldOut] = useState(false); // Nuovo stato per "Sold Out"

    const contractAddress = "0xE63b7e012ed67e6C339aEfE33850353397b8c88D";
    const auctionContractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
    const [bidAmount, setBidAmount] = useState("");
    const [bids, setBids] = useState([]);
    const [isBidLoading, setIsBidLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const [auctionStarted, setAuctionStarted] = useState(false);
    const [auctionActive, setAuctionActive] = useState(false);
    const [lastBid, setLastBid] = useState(null);

    const formatTime = (milliseconds) => {
        const minutes = Math.floor(milliseconds / (60 * 1000));
        return `${minutes} minutes`;
    };

    useEffect(() => {
        const timerKey = `timer_${id}`;
        const timerExists = !!localStorage.getItem(timerKey);
        setAuctionActive(timerExists);
    }, [id]);

    useEffect(() => {
        const storedBids = JSON.parse(localStorage.getItem(`bids_${id}`)) || [];
        setBids(storedBids);

        const storedTimerEnd = localStorage.getItem(`timer_${id}`);
        if (storedTimerEnd) {
            setTimer(parseInt(storedTimerEnd));
        }

        if (storedBids.length > 0) {
            const highestBid = storedBids.reduce((max, bid) => parseFloat(bid.amount) > parseFloat(max.amount) ? bid : max, storedBids[0]);
            setLastBid(highestBid);
        }

        // Carica lo stato "Sold Out" dal localStorage
        const soldOutNFTs = JSON.parse(localStorage.getItem("soldOutNFTs")) || {};
        setIsSoldOut(!!soldOutNFTs[id]); // !! converte in booleano
    }, [id]);

    useEffect(() => {
        if (!timer) return;

        localStorage.setItem(`timer_${id}`, timer);

        const interval = setInterval(() => {
            const remaining = timer - Date.now();
            if (remaining <= 0) {
                clearInterval(interval);
                setTimer(null);
                handleAuctionEnd();
            } else {
                setRemainingTime(remaining);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [timer]);

    const addPurchase = (purchase) => {
        const existingPurchases = JSON.parse(localStorage.getItem("purchases")) || {};
        const userPurchases = existingPurchases[account] || [];
        userPurchases.push(purchase);
        existingPurchases[account] = userPurchases;
        localStorage.setItem("purchases", JSON.stringify(existingPurchases));
    };

    const handleStartAuction = async () => {
        if (auctionStarted) return;

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(auctionContractAddress, auctionContractABI.abi, signer);

        try {
            const tx = await contract.startAuction(id);
            await tx.wait();
            setAuctionStarted(true);
            alert("Auction started!");
        } catch (error) {
            console.error("Error starting auction:", error);
        }
    };

    const handlePlaceBid = async () => {
        if (!bidAmount || isNaN(bidAmount) || bidAmount <= 0) {
            alert("Please enter a valid bid amount.");
            return;
        }

        if (!isWalletConnected) {
            alert("Connect your wallet to place a bid.");
            return;
        }

        const storedBids = JSON.parse(localStorage.getItem(`bids_${id}`)) || [];
        const highestBid = storedBids.length > 0 ? Math.max(...storedBids.map(bid => parseFloat(bid.amount))) : 0;

        if (parseFloat(bidAmount) <= highestBid) {
            alert(`Your bid must be higher than the current highest bid of ${highestBid} ETH.`);
            return;
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const balance = await provider.getBalance(account);

        if (ethers.utils.parseEther(bidAmount).gt(balance)) {
            alert("Your bid exceeds your wallet balance.");
            return;
        }

        setIsBidLoading(true);

        try {
            const signer = provider.getSigner();
            const contract = new ethers.Contract(auctionContractAddress, auctionContractABI.abi, signer);

            const tx = await contract.placeBid(id, {
                value: ethers.utils.parseEther(bidAmount),
            });
            await tx.wait();

            const newBid = {
                amount: bidAmount,
                wallet: `${account.slice(0, 5)}...${account.slice(-4)}`,
                timestamp: Date.now(),
            };

            const updatedBids = [...bids, newBid];
            setBids(updatedBids);
            localStorage.setItem(`bids_${id}`, JSON.stringify(updatedBids));

            if (!auctionStarted) {
                await handleStartAuction();
            }

            if (!timer) {
                const newTimerEnd = Date.now() + 30 * 60 * 1000; // 30 minutes
                setTimer(newTimerEnd);
                localStorage.setItem(`timer_${id}`, newTimerEnd);
            }

            setBidAmount("");
            alert("Bid placed successfully!");
        } catch (error) {
            console.error("Error placing bid:", error);
            alert("Error while placing your bid. Please try again.");
        } finally {
            setIsBidLoading(false);
        }
    };

    const handleAuctionEnd = async () => {
        const auctionEnded = localStorage.getItem(`auction_ended_${id}`);
        if (auctionEnded) {
            console.log("Auction already ended.");
            return;
        }

        if (bids.length > 0) {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(auctionContractAddress, auctionContractABI.abi, signer);

            try {
                const highestBid = bids.reduce(
                    (max, bid) => parseFloat(bid.amount) > parseFloat(max.amount) ? bid : max,
                    bids[0]
                );

                const tx = await contract.endAuction(id);
                await tx.wait();

                // Salva lo stato "Sold Out" nel localStorage
                const soldOutNFTs = JSON.parse(localStorage.getItem("soldOutNFTs")) || {};
                soldOutNFTs[id] = true;
                localStorage.setItem("soldOutNFTs", JSON.stringify(soldOutNFTs));

                setIsSoldOut(true);
                setNft(prevNft => ({ ...prevNft, isSoldOut: true }));

                addPurchase({
                    nftId: id,
                    wallet: account,
                    date: new Date().toISOString(),
                    price: highestBid.amount,
                    title: nft.title,
                    imageUrl: nft.imageUrl,
                    qrcode: nft.qrcode,
                });

                localStorage.setItem(`auction_ended_${id}`, true);
                alert("Auction ended successfully! Winner: " + highestBid.wallet);
            } catch (error) {
                console.error("Error finalizing auction:", error);
                alert("Error finalizing auction, controlla console");
            }
        } else {
            alert("No bids placed yet.");
        }
    };

    // buy now logic
    useEffect(() => {
        const fetchBalance = async () => {
            if (isWalletConnected) {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = await provider.getSigner();
                const address = await signer.getAddress();
                const balance = await provider.getBalance(address);
                setBalance(ethers.utils.formatEther(balance));
            }
        };
        fetchBalance();
    }, [isWalletConnected]);

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] w-full min-h-screen pt-20 pb-10">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6 mt-4 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <img src={nft.imageUrl} alt={nft.title} className="rounded-lg w-full object-cover" />
                    <div>
                        <h2 className="text-3xl font-semibold text-center md:text-left mb-4 text-white">{nft.title}</h2>
                        <div className="space-y-6 text-white">
                            <p>{nft.description}</p>

                            {nft.isSoldOut || isSoldOut ? (  // Usa isSoldOut per lo stato persistente
                                <div className="bg-red-600 text-white rounded-md px-4 py-2 font-bold inline-block">
                                    SOLD OUT
                                </div>
                            ) : (
                                <div className="mb-4">
                                    {auctionActive ? (
                                        <div className="bg-green-500 text-white rounded-md px-4 py-2 font-semibold inline-block">
                                            Active Auction
                                        </div>
                                    ) : (
                                        <div className="bg-gray-400 text-white rounded-md px-4 py-2 font-semibold inline-block">
                                            Awaiting Start
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-4">
                                {remainingTime && (
                                    <div className="bg-gray-800 border border-gray-600 rounded-md p-3 flex items-center justify-center space-x-2">
                                        <FiClock className="text-gray-500" />
                                        <span className="text-lg text-white font-medium">Time left:</span>
                                        <span className="text-xl font-bold text-blue-600">{formatTime(remainingTime)}</span>
                                    </div>
                                )}
                            </div>
                            <div className="mb-4">
                                <label className="block text-lg font-medium mb-2 text-gray-400">Place a bid</label>
                                <input
                                    type="number"
                                    className="w-full p-2 text-gray-900 border rounded-lg"
                                    placeholder="Enter your bid"
                                    value={bidAmount}
                                    onChange={(e) => setBidAmount(e.target.value)}
                                    min="0"
                                />
                            </div>
                            <div className="flex justify-between mb-4">
                                <button
                                    className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 rounded-md text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowedg"
                                    onClick={handlePlaceBid}
                                    disabled={isBidLoading || nft.isSoldOut || isSoldOut}  // Controlla anche isSoldOut
                                >
                                    Place Bid
                                </button>
                            </div>

                            <div className="mt-6">
                                {bids.length > 0 && (
                                    <div>
                                        <h3 className="text-xl font-semibold mb-3 text-gray-200">Recent Bids:</h3>
                                        <ul className="space-y-2">
                                            {bids.slice(0, 2).map((bid, index) => (
                                                <li
                                                    key={index}
                                                    className="flex items-center justify-between p-2 rounded-md transition-colors"
                                                >
                                                    <div className="flex items-center space-x-2">
                                                        <FaUser className="text-gray-100" />
                                                        <span className="text-gray-200 hover:text-gray-700">{bid.wallet}</span>
                                                    </div>
                                                    <span className="font-semibold text-blue-600 hover:text-blue-800">{bid.amount} ETH</span>
                                                    <span className="text-gray-200 text-sm hover:text-gray-700">{new Date(bid.timestamp).toLocaleTimeString()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {bids.length > 2 && (
                                            <p className="text-gray-400 text-sm mt-2">
                                                {bids.length - 2} more bids...
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                            <Link to="/"
                                className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-md text-white font-medium transition-colors"
                            >
                                <FaTimes className="mr-2" />Go Back</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NFTInfo;