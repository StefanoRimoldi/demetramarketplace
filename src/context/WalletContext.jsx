import React, { createContext, useState, useContext, useEffect } from 'react';
import { ethers } from 'ethers';

const WalletContext = createContext();

export const WalletProvider = ({ children }) => {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(null);
  const [network, setNetwork] = useState(null);

  //1 ora max offline poi un re login needed
  const SESSION_DURATION = 1 * 60 * 60 * 1000;

 
  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        const currentTime = new Date().getTime();
        await accountChangeHandler(accounts[0]);
        setIsWalletConnected(true);
        localStorage.setItem('connectedWallet', accounts[0]);
        localStorage.setItem('walletSessionTimestamp', currentTime);
      } catch (error) {
        console.error('Errore durante la connessione al wallet:', error);
      }
    } else {
      alert('Devi installare un wallet Ethereum');
    }
  };

  const disconnectWallet = () => {
    setIsWalletConnected(false);
    setAccount(null);
    setBalance(null);
    setNetwork(null);
    localStorage.removeItem('connectedWallet');
    localStorage.removeItem('walletSessionTimestamp');
  };
  


  const accountChangeHandler = async (newAccount) => {
    setAccount(newAccount);
    await getAccountBalance(newAccount);
    const networkId = await window.ethereum.request({ method: 'net_version' });
    setNetwork(networkFriendlyName(networkId));
  };

  const getAccountBalance = async (address) => {
    const balanceWei = await window.ethereum.request({ method: 'eth_getBalance', params: [address, 'latest'] });
    const balanceInEther = ethers.utils.formatEther(balanceWei);
    const networkId = await window.ethereum.request({ method: 'net_version' });

    if (networkId === '137') {
      setBalance(`${balanceInEther} MATIC`);
    } else {
      setBalance(`${balanceInEther} ETH`);
    }
  };


  const chainChangedHandler = () => {
    window.location.reload();
  };

 
  useEffect(() => {
    const savedAccount = localStorage.getItem('connectedWallet');
    const savedTimestamp = localStorage.getItem('walletSessionTimestamp');
    const currentTime = new Date().getTime();

    if (savedAccount && savedTimestamp) {
   
      if (currentTime - parseInt(savedTimestamp, 10) < SESSION_DURATION) {
        (async () => {
          await accountChangeHandler(savedAccount);
          setIsWalletConnected(true);
        })();
      } else {
        localStorage.removeItem('connectedWallet');
        localStorage.removeItem('walletSessionTimestamp');
        setIsWalletConnected(false);
        setAccount(null);
        setBalance(null);
      }
    }

    if (window.ethereum) {
      const handleAccountsChanged = (accounts) => {
        if (accounts.length > 0) {
          accountChangeHandler(accounts[0]);
          const currentTime = new Date().getTime();
          localStorage.setItem('connectedWallet', accounts[0]);
          localStorage.setItem('walletSessionTimestamp', currentTime);
        } else {
          setIsWalletConnected(false);
          setAccount(null);
          setBalance(null);
          localStorage.removeItem('connectedWallet');
          localStorage.removeItem('walletSessionTimestamp');
        }
      };

      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', chainChangedHandler);

      return () => {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', chainChangedHandler);
      };
    }
  }, []);

  const networkFriendlyName = (networkId) => {
    switch (networkId) {
      case '1':
        return 'Ethereum Mainnet';
      case '42':
        return 'Kovan Test Network';
      case '11155111':
        return 'Sepolia Test Network';
      case '137':
        return 'Polygon Mainnet';
    }
  };

  return (
    <WalletContext.Provider value={{ isWalletConnected, account, balance, network, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWallet deve essere usato all'interno di un WalletProvider");
  }
  return context;
};
