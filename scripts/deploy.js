async function main() {

  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);


  const TransferNft = await ethers.getContractFactory("TransferNft");


  const transferNft = await TransferNft.deploy();

  console.log("TransferNft contract deployed to:", transferNft.address);
}


main()
  .then(() => process.exit(0))
  .catch((error) => {
      console.error(error);
      process.exit(1);
  });
