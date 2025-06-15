async function main() {
  // Ottieni il signatario (account) dal provider
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  // Ottieni il contratto TransferNft
  const TransferNft = await ethers.getContractFactory("TransferNft");

  // Deploy del contratto
  const transferNft = await TransferNft.deploy();

  console.log("TransferNft contract deployed to:", transferNft.address);
}

// Esegui la funzione main e gestisci eventuali errori
main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
