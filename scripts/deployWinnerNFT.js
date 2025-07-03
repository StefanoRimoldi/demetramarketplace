async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const WinnerNFT = await ethers.getContractFactory("WinnerNFT");
  const winnerNFT = await WinnerNFT.deploy();

  await winnerNFT.deployed();

  console.log("WinnerNFT deployed to:", winnerNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
