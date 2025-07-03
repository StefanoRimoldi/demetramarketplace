import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useWallet } from '../context/WalletContext';
import { useLocation } from 'react-router-dom';
import { NFTData } from '../data/nftData';
import contractABI from '../contracts-abi/NFTMarketplace.json';
import auctionContractABI from '../contracts-abi/NFTAuction.json';
import { FaShoppingCart, FaTimes } from "react-icons/fa";
import { Link } from 'react-router-dom';




const NFTInfo = () => {
  const location = useLocation();
  const { id } = location.state || {};
  const [nft, setNft] = useState(NFTData[id]);

  const { isWalletConnected, account } = useWallet();
  const [isLoading, setIsLoading] = useState(false);
  const [transactionSuccess, setTransactionSuccess] = useState(null);
  const [balance, setBalance] = useState(0);
  const [isSoldOut, setIsSoldOut] = useState(false);

  const contractAddress = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";
  const auctionContractAddress = "0xf8e81D47203A594245E36C48e151709F0C19fBe8";
  const [bids, setBids] = useState([]);
  const [timer, setTimer] = useState(null);
  const [auctionActive, setAuctionActive] = useState(false);
  
  
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
  }, [id]);




  const addPurchase = (purchase) => {
    const existingPurchases = JSON.parse(localStorage.getItem("purchases")) || {};
    const userPurchases = existingPurchases[account] || [];
    userPurchases.push(purchase);
    existingPurchases[account] = userPurchases;
    localStorage.setItem("purchases", JSON.stringify(existingPurchases));
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

        console.log("Highest Bid Wallet for Auction ID:", id, " - Wallet:", highestBid.wallet);

  
   
        const tx = await contract.endAuction(id);
        await tx.wait();


        setIsSoldOut(true);
        setNft(prevNft => ({ ...prevNft, isSoldOut: true }));
        
  
              const purchase = {
                nftId: id,
                wallet: highestBid.wallet,
                date: new Date().toISOString(),
                price: highestBid.amount,
                title: nft.title,
                imageUrl: nft.imageUrl,
                qrcode: nft.qrcode,
              };
              addPurchase(purchase); 



        const soldOutNFTs = JSON.parse(localStorage.getItem("soldOutNFTs")) || {};
        soldOutNFTs[id] = highestBid.wallet;
        localStorage.setItem("soldOutNFTs", JSON.stringify(soldOutNFTs));




      localStorage.setItem(`auction_ended_${id}`, true);


      const endedAuctions = JSON.parse(localStorage.getItem('ended_auctions')) || [];
      if (!endedAuctions.includes(id)) {
        endedAuctions.push(id);
        localStorage.setItem('ended_auctions', JSON.stringify(endedAuctions));
      }

      console.log(`Auction ended flag set for auction_${id}: true`);
  



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

  useEffect(() => {
    const soldOutNFTs = JSON.parse(localStorage.getItem("soldOutNFTs")) || {};
    if (soldOutNFTs[id]) {
      setIsSoldOut(true);
      setNft((prevNft) => ({ ...prevNft, isSoldOut: true }));
    }
  }, [id]);

  const isBalanceEnough = () => {
    const priceInEth = parseFloat(nft.price);
    const balanceInEth = parseFloat(balance);
    if (balanceInEth >= priceInEth) {
      return <p>Transaction interrupted, please retry</p>;
    } else {
      return <p>You don't have enough ETH to buy this NFT.</p>;
    }
  };


  const handlePurchase = async () => {
  if (!isWalletConnected) {
    alert("You need to connect your wallet to buy the NFT.");
    return;
  }

  try {
    if (!window.ethereum) {
      alert("Install MetaMask to buy the NFT.");
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = await provider.getSigner();
    const buyerAddress = await signer.getAddress();
    const contract = new ethers.Contract(contractAddress, contractABI.abi, signer);
    setIsLoading(true);
    setTransactionSuccess(null);

    console.log("Checking auction status in the local storage...");


    const timerKey = `timer_${id}`;
    const timerValue = localStorage.getItem(timerKey);

    if (timerValue) {
      console.log(`Timer found for NFT ID ${id}: ${timerValue}`);
      alert("Auction is still active for this NFT. The NFT cannot be purchased until the auction ends.");
      setIsLoading(false);
      return;
    }

    console.log(`No active auction for NFT ID ${id}. Proceeding with the purchase...`);

    console.log(`Starting the purchase for NFT ID: ${id}, Price: ${nft.price} ETH`);


    const tx = await contract.transferMoney(id, {
      value: ethers.utils.parseEther(nft.price.toString()),
    });
    console.log("Transaction submitted:", tx);


    await tx.wait();
    console.log(`NFT ID ${id} successfully bought!`);

    setTransactionSuccess(true);
    setIsSoldOut(true);
    setNft((prevNft) => ({ ...prevNft, isSoldOut: true }));


    const soldOutNFTs = JSON.parse(localStorage.getItem("soldOutNFTs")) || {};
    soldOutNFTs[id] = true;
    localStorage.setItem("soldOutNFTs", JSON.stringify(soldOutNFTs));


    addPurchase({
      id,
      buyerAddress,
      date: new Date().toISOString(),
      price: nft.price,
      imageUrl: nft.imageUrl,
      title: nft.title,
      rarity: nft.rarity || null,
      discount: nft.discount || null,
      qrcode: nft.qrcode || null,
    });

    alert("Purchase successful!");
  } catch (error) {
    console.error("Purchase failed:", error);
    setTransactionSuccess(false);
  } finally {
    setIsLoading(false);
  }
};


  if (!nft) {
    return <h2>NFT not found!</h2>;
  }


//
return (
  <div className="w-full px-4 sm:px-6 md:px-8 bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] w-full min-h-screen pt-20 pb-10">
    <div className="backdrop-blur-md 
      bg-white/10 border border-white/20 rounded-lg p-6 mt-4 w-full max-w-6xl mx-auto">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        {/* Immagine NFT */}
        <div className="space-y-4">
          <img
            src={nft.imageUrl}
            alt={nft.title}
            className="rounded-lg w-full object-cover"
          />
        </div>

        {/* Dettagli NFT + Auction + Buy */}
        <div className="space-y-6">
          {/* Info base NFT */}
          <div>
            <h1 className="text-2xl font-bold text-white">{nft.title}</h1>
            <p className="text-gray-400 mt-2">{nft.description}</p>
            <p className="text-white font-semibold mt-2">Price: {nft.price} ETH</p>
            
            {nft.discount && (
              <div className="mt-4 p-4 border-2 border-green-500 bg-green-100 rounded-lg">
                <p className="text-green-700 font-semibold">
                  Discount: {nft.discount}%
                </p>
                <p className="text-sm text-green-800">
                  Buying this NFT grants you membership in the Demetra community and a discount on your next purchase at the store!
                </p>
              </div>
            )}
          </div>



          {/* Bottone Acquisto*/}
          <div className="space-y-2">
            <button
              className={`w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-700 hover:to-orange-700 rounded-md text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                isLoading ? 'animate-pulse' : ''
              }`}
              onClick={isSoldOut || auctionActive ? null : handlePurchase}
              disabled={isLoading || isSoldOut || auctionActive}
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-white"></span>
                  <span>Processing...</span>
                </div>
              ) : isSoldOut ? (
                "Sold Out"
              ) : auctionActive ? (
                "Auction Active"
              ) : (
                <>
        <FaShoppingCart className="mr-2" />
        Buy Now - {nft.price} ETH
      </>
              )}
            </button>

            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 rounded-md text-white font-medium transition-colors"
            >
              <FaTimes className="mr-2" />
              Go Back
            </Link>


            {/* Messaggi post-transazione */}
            {transactionSuccess === true && (
              <p className="text-green-400 text-sm">Transaction successfully completed!</p>
            )}
            {transactionSuccess === false && (
              <p className="text-red-400 text-sm">{isBalanceEnough()}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
);

    
  
};

export default NFTInfo;
