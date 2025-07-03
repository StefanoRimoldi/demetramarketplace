import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { useLocation, useNavigate } from 'react-router-dom';
import { NFTData } from '../data/nftData';
import auctionContractABI from '../contracts-abi/NFTAuction.json';
import { FaTimes, FaUser } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FiClock } from "react-icons/fi";

import winnerNFTABI from '../contracts-abi/WinnerNFT.json';

const winnerNFTAddress = "0xC5818c2151c59eBbFFB157F49b85c3d916859D62";  

const NFTInfo = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { id } = location.state || {};
    const [nft, setNft] = useState(NFTData[id]);
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const [winnerBid, setWinnerBid] = useState(null);

    const { isWalletConnected, account } = useWallet();
    const [isLoading, setIsLoading] = useState(false);
    const [balance, setBalance] = useState(0);
    const [isSoldOut, setIsSoldOut] = useState(false);

    const auctionContractAddress = "0xa2791e606291e7f3643a3d48a0c0d74780b8f99b";
    const [bidAmount, setBidAmount] = useState("");
    const [bids, setBids] = useState([]);
    const [isBidLoading, setIsBidLoading] = useState(false);
    const [timer, setTimer] = useState(null);
    const [remainingTime, setRemainingTime] = useState(null);
    const [auctionStarted, setAuctionStarted] = useState(false);
    const [auctionActive, setAuctionActive] = useState(false);
    const [lastBid, setLastBid] = useState(null);
    const [isMinting, setIsMinting] = useState(false);
    const [mintTxHash, setMintTxHash] = useState(null);


    const formatTime = (milliseconds) => {
        const totalSeconds = Math.floor(milliseconds / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
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

        const soldOutNFTs = JSON.parse(localStorage.getItem("soldOutNFTs")) || {};
        setIsSoldOut(!!soldOutNFTs[id]);
    }, [id]);

    useEffect(() => {
        if (!timer) return;

        localStorage.setItem(`timer_${id}`, timer);

        const interval = setInterval(() => {
            const remaining = timer - Date.now();

            if (remaining <= 0) {
                setRemainingTime(0);
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
                const newTimerEnd = Date.now() + 5 * 60 * 1000; // 5 minutes
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
            try {
                const highestBid = bids.reduce(
                    (max, bid) => parseFloat(bid.amount) > parseFloat(max.amount) ? bid : max,
                    bids[0]
                );

                
                setWinnerBid(highestBid);


                setModalMessage(`Auction ended! Winner is ${highestBid.wallet} with a bid of ${highestBid.amount} ETH.`);
                setShowModal(true);

                
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
                    rarity: nft.rarity,
                    discount: nft.discount,
                });

                localStorage.setItem(`auction_ended_${id}`, true);
            } catch (error) {
                console.error("Error handling auction end:", error);
                alert("Error finalizing auction, check console.");
            }
        } else {
            alert("No bids placed yet.");
        }
    };

    const handleMintWinnerNFT = async () => {
    if (!isWalletConnected || !winnerBid) {
        alert("Wallet not connected or no winner found");
        return;
    }

    setIsMinting(true);
    try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(winnerNFTAddress, winnerNFTABI.abi, signer);

        
        const tokenUri = nft.tokenUri || "https://example.com/token-uri.json";

        const tx = await contract.mint(tokenUri);
        const receipt = await tx.wait();

        setMintTxHash(receipt.transactionHash);
        setModalMessage(`NFT minted successfully! Transaction hash: ${receipt.transactionHash}`);
        setShowModal(true);

    } catch (error) {
        console.error("Mint error:", error);
        alert("NFT minting error.");
    } finally {
        setIsMinting(false);
    }
};

    useEffect(() => {
        if (winnerBid && isWalletConnected) {
            console.log("✅ Winner found:", winnerBid.wallet);
            handleMintWinnerNFT();
        }
    }, [winnerBid, isWalletConnected]);

    // buy now logic
    useEffect(() => {
    const fetchBalance = async () => {
        if (isWalletConnected) {
            try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const network = await provider.getNetwork();
                if (network.chainId !== 11155111) { // 11155111 = Sepolia
                    console.warn("Please connect to the Sepolia network.");
                    setBalance(null); 
                    return; 
                }
                const signer = provider.getSigner();
                const address = await signer.getAddress();
                const balance = await provider.getBalance(address);
                setBalance(ethers.utils.formatEther(balance));
            } catch (error) {
                console.error(error);
                setBalance(null);
            }
        }
    };
    fetchBalance();
}, [isWalletConnected]);


    const closeModal = () => {
        setShowModal(false);
    };

    const goToWinnerNFTPage = () => {
        setShowModal(false);
        navigate("/nft-details", { state: { id } });
    };

    return (
        <div className="w-full px-4 sm:px-6 md:px-8 bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] w-full min-h-screen pt-20 pb-10">
            <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-lg p-6 mt-4 w-full max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
                    <img src={nft.imageUrl} alt={nft.title} className="rounded-lg w-full object-cover" />
                    <div>
                        <h2 className="text-3xl font-semibold text-center md:text-left mb-4 text-white">{nft.title}</h2>
                        <div className="space-y-6 text-white">
                            <p>{nft.description}</p>

                            {nft.isSoldOut || isSoldOut ? (
                                <div className="bg-red-600 text-white rounded-md px-4 py-2 font-bold inline-block">
                                    SOLD OUT
                                </div>
                            ) : (
                                <div className="mb-4">
                                    {auctionActive ? (
                                        typeof remainingTime === "number" && remainingTime <= 0 ? (
                                            <div className="bg-yellow-500 text-white rounded-md px-4 py-2 font-semibold inline-block">
                                                Waiting Result
                                            </div>
                                        ) : (
                                            <div className="bg-green-500 text-white rounded-md px-4 py-2 font-semibold inline-block">
                                                Active Auction
                                            </div>
                                        )
                                    ) : (
                                        <div className="bg-gray-400 text-white rounded-md px-4 py-2 font-semibold inline-block">
                                            Awaiting Start
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="mt-4">
                                {typeof remainingTime === 'number' && (
                                    <div className="bg-gray-800 border border-gray-600 rounded-md p-3 flex items-center justify-center space-x-2">
                                        <FiClock className="text-gray-500" />
                                        {remainingTime > 0 ? (
                                            <>
                                                <span className="text-lg text-white font-medium">Time left:</span>
                                                <span className="text-xl font-bold text-blue-600">{formatTime(remainingTime)}</span>
                                            </>
                                        ) : (
                                            <span className="text-lg text-red-500 font-semibold">Auction Ended</span>
                                        )}
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
                                    disabled={nft.isSoldOut || isSoldOut || (typeof remainingTime === 'number' && remainingTime <= 0)}
                                />
                                <button
                                    className="w-full flex items-center justify-center mt-4 px-4 py-3 bg-gradient-to-r from-purple-600 to-orange-600 hover:from-purple-700 hover:to-orange-700 rounded-md text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowedg"
                                    onClick={handlePlaceBid}
                                    disabled={isBidLoading || nft.isSoldOut || isSoldOut || (typeof remainingTime === 'number' && remainingTime <= 0)}
                                >
                                    {isBidLoading ? "Bidding..." : "Place Bid"}
                                </button>
                            </div>

                            {lastBid && (
                                <div className="mt-6 bg-gray-900 bg-opacity-40 p-3 rounded-md text-white">
                                    <h3 className="text-lg font-semibold mb-2">Last Bid</h3>
                                    <p>
                                        <FaUser className="inline-block mr-2" />
                                        {lastBid.wallet} - {lastBid.amount} ETH
                                    </p>
                                </div>
                            )}
                        </div>
                        <Link to="/"
                                className="w-full flex items-center justify-center mt-4 px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-md text-white font-medium transition-colors"
                            >
                                <FaTimes className="mr-2" />Go Back</Link>
                    </div>
                </div>
            </div>

            {/* Modal for auction end */}
            {showModal && (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
        <div className="bg-gray-900 text-white rounded-lg p-6 max-w-md mx-auto shadow-lg">
            <h2 className="text-xl font-semibold mb-4 text-white">Auction Finished</h2>
            <p className="break-words text-gray-300 max-w-full truncate overflow-hidden whitespace-nowrap">{modalMessage}</p>

            {isMinting ? (
                <p className="text-gray-400">Minting your NFT, please wait...</p>
            ) : mintTxHash ? (
                <p className="break-words text-gray-300">
                    Transaction Hash:{" "}
                    <a
                        href={`https://sepolia.etherscan.io/tx/${mintTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline"
                    >
                        {mintTxHash}
                    </a>
                </p>
            ) : null}

            <div className="flex justify-end space-x-4 mt-4">
                <button
                    className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600"
                    onClick={closeModal}
                >
                    Close
                </button>
            </div>
        </div>

    </div>
)}

        </div>
    );
};

export default NFTInfo;
