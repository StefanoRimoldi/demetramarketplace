const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NftContract", function () {
  let nftContract;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();

    const NftContract = await ethers.getContractFactory("NftContract");
    nftContract = await NftContract.deploy();
    await nftContract.deployed();
  });

  it("dovrebbe mintare un NFT con rarità", async function () {
    await nftContract.mintNFT(addr1.address, "Rare");

    const ownerOfToken = await nftContract.ownerOf(0);
    const rarity = await nftContract.tokenRarity(0);

    expect(ownerOfToken).to.equal(addr1.address);
    expect(rarity).to.equal("Rare");
  });

  it("dovrebbe impostare e ottenere il prezzo", async function () {
    await nftContract.mintNFT(addr1.address, "Common");
    await nftContract.connect(addr1).setTokenPrice(0, ethers.utils.parseEther("1"));

    const price = await nftContract.tokenPrices(0);
    expect(price).to.equal(ethers.utils.parseEther("1"));
  });

  it("dovrebbe permettere l'acquisto di un NFT", async function () {
    await nftContract.mintNFT(addr1.address, "Legendary");
    await nftContract.connect(addr1).setTokenPrice(0, ethers.utils.parseEther("1"));

    const addr1BalanceBefore = await ethers.provider.getBalance(addr1.address);

    await nftContract.connect(addr2).buyNFT(0, { value: ethers.utils.parseEther("1") });

    const newOwner = await nftContract.ownerOf(0);
    expect(newOwner).to.equal(addr2.address);

    const newPrice = await nftContract.tokenPrices(0);
    expect(newPrice).to.equal(0);
  });

  it("dovrebbe permettere il trasferimento da un utente a un altro", async function () {
    await nftContract.mintNFT(addr1.address, "Epic");

    await nftContract.connect(addr1).transferNFT(addr1.address, addr2.address, 0);

    const newOwner = await nftContract.ownerOf(0);
    expect(newOwner).to.equal(addr2.address);
  });
});
