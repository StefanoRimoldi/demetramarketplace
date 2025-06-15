require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-etherscan");
require('dotenv').config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/bb65298af67c444d982f6c2ff4f28085",  // Inserisci qui la tua chiave Infura
      accounts: [`0xbee128c6c09840ccc6b5977c4bf8eb8dafb64825b167f793fb5ea6aa79562827`] // Inserisci qui la tua chiave privata
    }
  },
  etherscan: {
    apiKey: "7ND28UW4P57E6RFGTRXV7XVGIT4J5SUPXT" // Aggiungi qui la tua chiave API di Etherscan
  },

  paths: {
    sources: "./contracts",  // Percorso ai contratti
    cache: "./cache",  // Percorso alla cache
    artifacts: "./artifacts"  // Percorso agli artefatti generati
  }
};
