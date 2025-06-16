import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useWallet } from '../context/WalletContext';
import { NFTData as initialNFTData } from '../data/nftData';
import { ethers } from 'ethers';
import TransferNftArtifact from '../contracts-abi/TransferNft.json';
import { Link } from 'react-router-dom';
import { FaWallet } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';

const abi = TransferNftArtifact.abi;
const contractAddress = "0xDA0bab807633f07f013f94DD0E6A4F96F8742B53";

const TransferNFT = () => {
    const { isWalletConnected, account, connectWallet } = useWallet();
    const [purchasedNFTs, setPurchasedNFTs] = useState([]);
    const [receivedNFTs, setReceivedNFTs] = useState([]);
    const [NFTData, setNFTData] = useState(initialNFTData);
    const [selectedNFT, setSelectedNFT] = useState(null);
    const [recipientAddress, setRecipientAddress] = useState('');
    const [isWaitingForTransaction, setIsWaitingForTransaction] = useState(false);
    const [message, setMessage] = useState('');
    const [messageType, setMessageType] = useState(''); // 'success', 'error', 'info'

    
    const mergedNFTs = useMemo(() => {
        return [
            ...purchasedNFTs.map(nft => ({ ...nft, isReceived: false })),
            ...receivedNFTs.map(nft => ({ ...nft, isReceived: true })),
        ];
    }, [purchasedNFTs, receivedNFTs]);

    // Carica gli NFT acquistati e ricevuti da localStorage
    const loadPurchases = useCallback(() => {
        if (!isWalletConnected || !account) return;
        try {
            const allPurchases = JSON.parse(localStorage.getItem('purchases')) || {};
            setPurchasedNFTs(allPurchases[account] || []);
            console.log("loadPurchases - Loaded:", allPurchases[account] || []);
        } catch (error) {
            console.error("loadPurchases - Error parsing purchases:", error);
            setPurchasedNFTs([]);
            setMessage("Error loading purchases.");
            setMessageType('error');
        }
    }, [isWalletConnected, account]);

    const loadReceived = useCallback(() => {
        if (!isWalletConnected || !account) return;
        try {
            const allTransfers = JSON.parse(localStorage.getItem("nft-transfers")) || [];
            const received = allTransfers.filter(t => t.to.toLowerCase() === account.toLowerCase());
            const receivedWithData = received.map(transfer => {
                const nftData = NFTData[transfer.nftId];
                return nftData ? { ...transfer, ...nftData } : null;
            }).filter(nft => nft !== null);
            setReceivedNFTs(receivedWithData);
            console.log("loadReceived - Loaded:", receivedWithData);
        } catch (error) {
            console.error("loadReceived - Error parsing transfers:", error);
            setReceivedNFTs([]);
            setMessage("Error loading received NFTs.");
            setMessageType('error');
        }
    }, [isWalletConnected, account, NFTData]);

    const loadNFTData = useCallback(() => {
        try {
            const storedNFTData = JSON.parse(localStorage.getItem("nftData")) || initialNFTData;
            setNFTData(storedNFTData);
            console.log("loadNFTData - Loaded:", storedNFTData);
        } catch (error) {
            console.error("loadNFTData - Error parsing NFTData:", error);
            setNFTData(initialNFTData);
            setMessage("Error loading NFT data.");
            setMessageType('error');
        }
    }, [initialNFTData]);

    useEffect(() => {
        if (isWalletConnected && account) {
            loadPurchases();
            loadReceived();
            if (!localStorage.getItem("nftData")) {
                loadNFTData();
            }
        }
    }, [isWalletConnected, account, loadPurchases, loadReceived, loadNFTData]);

    const handleSelectNFT = useCallback((nftString) => {
        try {
            const parsedNFT = nftString ? JSON.parse(nftString) : null;
            setSelectedNFT(parsedNFT);
            console.log("handleSelectNFT - Selected NFT:", parsedNFT);
        } catch (error) {
            console.error('handleSelectNFT - Error parsing NFT string:', error);
            setMessage('Invalid NFT data.');
            setMessageType('error');
            setSelectedNFT(null);
        }
    }, []);

    const handleTransfer = useCallback(async () => {
        if (!selectedNFT || !selectedNFT.title || !recipientAddress) {
            setMessage('Select an NFT and enter a valid recipient address');
            setMessageType('error');
            return;
        }
        if (!ethers.utils.isAddress(recipientAddress)) {
            setMessage("The address entered is not valid. Please enter a correct Ethereum address");
            setMessageType('error');
            return;
        }
        if (recipientAddress.toLowerCase() === account.toLowerCase()) {
            setMessage("You cannot transfer an NFT to yourself");
            setMessageType('error');
            return;
        }

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, abi, signer);

            const nftIdToSend = selectedNFT.nftId || "NFT";
            console.log("handleTransfer - Starting transfer of NFT ID:", nftIdToSend);

            setIsWaitingForTransaction(true);
            const tx = await contract.sendnft(recipientAddress, nftIdToSend);
            const receipt = await tx.wait();
            setIsWaitingForTransaction(false);

            if (receipt.status === 1) {
                const transferDetails = {
                    from: account,
                    to: recipientAddress,
                    title: selectedNFT.title,
                    nftId: selectedNFT.nftId,
                    imageUrl: selectedNFT.imageUrl,
                    timestamp: new Date().toISOString(),
                    transactionHash: receipt.transactionHash,
                };

                
                try {
                    const existingTransfers = JSON.parse(localStorage.getItem('nft-transfers')) || [];
                    const updatedTransfers = [...existingTransfers, transferDetails];
                    localStorage.setItem('nft-transfers', JSON.stringify(updatedTransfers));
                    console.log("handleTransfer - Updated nft-transfers in localStorage:", updatedTransfers);
                } catch (error) {
                    console.error("handleTransfer - Error updating nft-transfers:", error);
                    setMessage("Error saving transfer details. Please try again.");
                    setMessageType('error');
                    return;
                }


                setMessage(`Successfully transferred ${selectedNFT.title} to ${recipientAddress}\nTransaction Link: https://sepolia.etherscan.io/tx/${receipt.transactionHash}`);
                setMessageType('success');

                
                try {
                    const allPurchases = JSON.parse(localStorage.getItem('purchases')) || {};
                    const senderPurchases = allPurchases[account] || [];
                    const updatedSenderPurchases = senderPurchases.filter(nft => nft.nftId !== selectedNFT.nftId);
                    const recipientPurchases = allPurchases[recipientAddress] || [];
                    const updatedRecipientPurchases = [...recipientPurchases, { ...selectedNFT, buyerAddress: recipientAddress }];

                    const updatedAllPurchases = {
                        ...allPurchases,
                        [account]: updatedSenderPurchases,
                        [recipientAddress]: updatedRecipientPurchases,
                    };

                    localStorage.setItem('purchases', JSON.stringify(updatedAllPurchases));
                    console.log("handleTransfer - Updated purchases in localStorage:", updatedAllPurchases);
                } catch (error) {
                    console.error("handleTransfer - Error updating purchases:", error);
                    setMessage("Error updating purchase data. Please try again.");
                    setMessageType('error');
                    return;
                }


                
                setPurchasedNFTs(prev => prev.filter(nft => nft.nftId !== selectedNFT.nftId));
                setReceivedNFTs(prev => [...prev, { ...selectedNFT, isReceived: true }]);
                console.log("handleTransfer - Updated purchasedNFTs:", purchasedNFTs.filter(nft => nft.nftId !== selectedNFT.nftId));
                console.log("handleTransfer - Updated receivedNFTs:", [...receivedNFTs, { ...selectedNFT, isReceived: true }]);

                setSelectedNFT(null);
                setRecipientAddress('');

            } else {
                setMessage("Transaction failed. Please try again.");
                setMessageType('error');
            }

        } catch (error) {
            setIsWaitingForTransaction(false);
            console.error("handleTransfer - Error during NFT transfer:", error);
            setMessage("An error occurred during the transfer. Please try again.");
            setMessageType('error');

        }
    }, [account, recipientAddress, selectedNFT, purchasedNFTs, receivedNFTs]);

    
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
                setMessageType('');
            }, 5000); // Il messaggio scompare dopo 5 secondi
            return () => clearTimeout(timer);
        }
    }, [message]);


    return (
  <div className="min-h-screen bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] py-10 px-4">
    {isWalletConnected ? (
      <div className="max-w-xl mx-auto mt-20 backdrop-blur-md bg-black/40 rounded-2xl shadow-2xl p-6 space-y-6 text-white">
        <h2 className="text-2xl font-bold text-center">Transfer Your NFTs</h2>

        {/* Mostra il messaggio di stato */}
        {message && (
          <div className={`mb-4 p-4 rounded-md shadow-md break-words whitespace-pre-wrap ${
            messageType === 'success' ? 'bg-green-50 text-green-700 border-green-200' :
            messageType === 'error' ? 'bg-red-50 text-red-700 border-red-200' :
            'bg-blue-50 text-blue-700 border-blue-200'
          } transition-opacity duration-500`}>
            <strong className="font-semibold">
              {messageType === 'success' ? 'Success: ' : messageType === 'error' ? 'Error: ' : 'Info: '}
            </strong>
            {message}
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">Select NFT to Transfer</h3>
          {mergedNFTs.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {mergedNFTs.map((nft, index) => (
                <div
                  key={index}
                  onClick={() => handleSelectNFT(JSON.stringify(nft))}
                  className={`cursor-pointer border-2 border-white/20 rounded-lg p-2 text-center transition duration-200 hover:border-white/40`}
                >
                  <img src={nft.imageUrl} alt={nft.title} className="w-full h-32 object-cover rounded-md mb-2" />
                  <p className="text-sm font-semibold text-gray-200">{nft.title}</p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-300">You don't have any NFTs to transfer.</p>
          )}
        </div>

        {selectedNFT && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold mb-2 text-gray-200">Selected NFT</h3>
            <img src={selectedNFT.imageUrl} alt={selectedNFT.title} className="rounded-md shadow-md w-32 h-32 object-cover" />
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-lg font-semibold mb-2 text-gray-200">Recipient Address</h3>
          <input
            type="text"
            value={recipientAddress}
            onChange={(e) => setRecipientAddress(e.target.value)}
            placeholder="Enter recipient Ethereum address"
            className="w-full p-3 rounded-lg bg-transparent border-2 border-white/30 text-white placeholder-white focus:outline-none"
          />
        </div>

        <div className="space-y-2">
          <button
            className={`w-full py-3 rounded-md font-semibold bg-orange-600 text-white mt-4 hover:bg-orange-700 ${isWaitingForTransaction ? 'opacity-50 cursor-wait' : ''}`}
            onClick={handleTransfer}
            disabled={!selectedNFT || !recipientAddress || isWaitingForTransaction}
          >
            {isWaitingForTransaction ? 'Waiting...' : 'Transfer'}
          </button>
        </div>
      </div>
    ) : (
      <div className="flex justify-center items-center min-h-screen w-full">
        <div className="max-w-lg w-full backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl shadow-xl p-8 text-center">
          <div className="mx-auto w-24 h-24 backdrop-blur-md bg-white/10 border border-white/20 rounded-full flex items-center justify-center mb-6">
            <FaWallet className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-semibold text-white mb-4">Please connect your wallet to continue</h2>
          <button
            onClick={connectWallet}
            className="w-full py-3 rounded-md font-semibold bg-orange-600 text-white hover:bg-orange-700"
          >
            Connect Wallet
          </button>
        </div>
      </div>
    )}
  </div>
);

};

export default TransferNFT;