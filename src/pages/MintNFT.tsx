import React, { useState } from "react";
import { ethers } from "ethers";
import { FaEthereum, FaLock, FaImage, FaTimes, FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";

import contractABI from "../contracts-abi/MintNFT.json";

const CONTRACT_ADDRESS = "0x0fC5025C764cE34df352757e82f7B5c4Df39A836";

const MintNFTForm = () => {
  const [form, setForm] = useState({
    title: "",
    description: "",
    rarity: "",
    price: "",
    imageURL: "",
    discount: "",
  });
  const [status, setStatus] = useState("");
  const [mintedTokenId, setMintedTokenId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  const [passwordModalVisible, setPasswordModalVisible] = useState(true);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handlePasswordSubmit = () => {
    if (password === "nft123") { // Cambia qui la password
      setPasswordModalVisible(false);
    } else {
      alert("Invalid password");
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const mintNFT = async () => {
    try {
      
      if (!window.ethereum) {
        return alert("Please install MetaMask!");
      }

      
      const accounts = await window.ethereum.request({ method: "eth_accounts" });
      if (accounts.length === 0) {
        return alert("Connect your MetaMask wallet to continue.");
      }

      
      await window.ethereum.request({ method: "eth_requestAccounts" });

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, signer);

      const priceInWei = ethers.utils.parseEther(form.price);

      setStatus("Minting ongoing");
      setModalType("loading");
      setShowModal(true);

      const tx = await contract.mintNFT(
        await signer.getAddress(),
        form.title,
        form.description,
        form.rarity,
        priceInWei,
        form.imageURL,
        parseInt(form.discount)
      );

      const receipt = await tx.wait();

      
      console.log("Events received", receipt.events);

      const mintedEvent = receipt.events?.find((e) => e.event === "Minted");

      if (mintedEvent) {
        console.log("Evento Minted:", mintedEvent);
        const tokenId = mintedEvent.args.tokenId.toString();
        setMintedTokenId(tokenId);
        setStatus(`✅ NFT created with Token ID: ${tokenId}`);
        setModalType("success");
      } else {
        setStatus("✅ NFT minted, but unable to retrieve Token ID");
        setModalType("error");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Failed to mint NFT");
      setModalType("error");
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black via-green-700 to-emerald-800 animate-gradient bg-[length:400%_400%] p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      {/* Finestra per la password */}
      {passwordModalVisible && (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 p-8 rounded-xl shadow-2xl w-full max-w-md">
          <div className="flex justify-center mb-6">
            <FaLock className="text-6xl text-orange-500" />
          </div>
          <h1 className="text-2xl font-bold text-white text-center mb-6">
            NFT Creation Portal
          </h1>
          <form onSubmit={handlePasswordSubmit}>
            <div className="mb-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-gray-700 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {passwordError && (
              <p className="text-red-500 text-sm mb-4">{passwordError}</p>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-800 hover:to-orange-800 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
            >
              Enter Portal
            </button>
          </form>
        </div>
      )}

      {/* Form per il minting NFT */}
      {!passwordModalVisible && (
        <div className="backdrop-blur-md bg-white/10 border border-white/20 rounded-xl shadow-2xl mt-20 p-10 mb-8 max-w-lg w-full">
          <h2 className="text-3xl font-bold text-white mb-8">Create your NFT</h2>

          {["title", "description", "rarity", "price", "imageURL", "discount"].map((field) => (
            <div key={field} className="mb-6">
              <label className="block text-white mb-2 capitalize">{field}</label>
              <input
                type="text"
                name={field}
                value={form[field]}
                onChange={handleChange}
                className="w-full bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={`Inserisci ${field}`}
              />
            </div>
          ))}

          {form.imageURL && (
            <div className="mb-4">
              <p className="text-sm text-gray-300 mb-2">Image Preview:</p>
              <img
                src={form.imageURL}
                alt="Preview"
                className="mt-2 rounded-lg max-h-64 object-cover"
                onError={(e) => (e.target.style.display = "none")}
              />
            </div>
          )}

          <button
            onClick={mintNFT}
            className="w-full bg-gradient-to-r from-green-600 to-orange-600 hover:from-green-800 hover:to-orange-800 text-white font-bold py-4 px-6 rounded-lg transition duration-200"
            disabled={status === "Minting in corso..."} // Disabilita il pulsante durante il minting
          >
            {status === "Minting in corso..." ? "Minting in corso..." : "Mint NFT"}
          </button>

          
          {status && status !== "Minting in corso..." && <p className="mt-3 text-white">{status}</p>}

          {mintedTokenId && (
            <p className="mt-2 text-sm text-green-400">
              🔗 Visualizza su Etherscan:{" "}
              <a
                href={`https://etherscan.io/token/${CONTRACT_ADDRESS}?a=${mintedTokenId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline text-blue-300"
              >
                Token #{mintedTokenId}
              </a>
            </p>
          )}

         
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full">
                {modalType === "loading" && (
                  <>
                    <h3 className="text-lg font-bold text-gray-300 mb-4">Minting in progress...</h3>
                    <p className="text-gray-400">Please wait while your NFT is being created.</p>
                  </>
                )}

                {modalType === "success" && (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className="bg-green-500 rounded-full p-3">
                        <FaCheck className="text-white text-3xl" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-green-400 mb-4">Success!</h3>
                    <p className="text-gray-300">{status}</p>
                  </>
                )}

                {modalType === "error" && (
                  <>
                    <div className="flex justify-center mb-4">
                      <div className="bg-red-500 rounded-full p-3">
                        <FaTimes className="text-white text-3xl" />
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-red-400 mb-4">Error!</h3>
                    <p className="text-gray-300">{status}</p>
                  </>
                )}

                <button onClick={closeModal} className="mt-4 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200">
                  Close
                </button>

                <Link to="/" className="mt-4 block text-center">
                  <button className="bg-gray-600 hover:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200 w-full">
                    Return to Gallery
                  </button>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MintNFTForm;
