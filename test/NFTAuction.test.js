const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTAuction", function () {
  let NFTAuction;
  let nftAuctionContract;
  let beneficiary;
  let bidder1;
  let bidder2;

  const nftId = 1;
  const initialBid = ethers.utils.parseEther("1.0");
  const higherBid = ethers.utils.parseEther("2.0");

  beforeEach(async function () {
    [beneficiary, bidder1, bidder2] = await ethers.getSigners();

    NFTAuction = await ethers.getContractFactory("NFTAuction");
    nftAuctionContract = await NFTAuction.deploy(beneficiary.address);
    await nftAuctionContract.deployed();
  });

  it("Should set the beneficiary correctly upon deployment", async function () {
    expect(await nftAuctionContract.beneficiary()).to.equal(beneficiary.address);
  });

  it("Should start an auction correctly", async function () {
    await expect(nftAuctionContract.startAuction(nftId))
      .to.emit(nftAuctionContract, "AuctionStarted")
      .withArgs(nftId);

    const auction = await nftAuctionContract.auctions(nftId);
    expect(auction.isActive).to.equal(true);
    expect(auction.highestBid).to.equal(0);
    expect(auction.highestBidder).to.equal(ethers.constants.AddressZero);
  });

  it("Should not allow starting an already active auction", async function () {
    await nftAuctionContract.startAuction(nftId);
    await expect(nftAuctionContract.startAuction(nftId)).to.be.revertedWith("Auction already active");
  });

  it("Should allow placing a bid and emit the BidPlaced event", async function () {
    await nftAuctionContract.startAuction(nftId);

    await expect(nftAuctionContract.connect(bidder1).placeBid(nftId, { value: initialBid }))
      .to.emit(nftAuctionContract, "BidPlaced")
      .withArgs(nftId, bidder1.address, initialBid);

    const auction = await nftAuctionContract.auctions(nftId);
    expect(auction.highestBid).to.equal(initialBid);
    expect(auction.highestBidder).to.equal(bidder1.address);
  });

  it("Should not allow placing a bid lower than the current highest bid", async function () {
    await nftAuctionContract.startAuction(nftId);
    await nftAuctionContract.connect(bidder1).placeBid(nftId, { value: initialBid });

    await expect(nftAuctionContract.connect(bidder2).placeBid(nftId, { value: ethers.utils.parseEther("0.5") }))
      .to.be.revertedWith("Bid is too low");
  });

  it("Should refund the previous highest bidder when a higher bid is placed", async function () {
    await nftAuctionContract.startAuction(nftId);
    await nftAuctionContract.connect(bidder1).placeBid(nftId, { value: initialBid });

    const initialBalanceBidder1 = await ethers.provider.getBalance(bidder1.address);
    const tx = await nftAuctionContract.connect(bidder2).placeBid(nftId, { value: higherBid });
    const receipt = await tx.wait();
    const gasUsed = receipt.gasUsed.mul(tx.gasPrice);
    const finalBalanceBidder1 = await ethers.provider.getBalance(bidder1.address);

    // Check if bidder1 received a refund (approximately, considering gas costs)
    expect(finalBalanceBidder1.add(gasUsed).gte(initialBalanceBidder1.add(initialBid))).to.equal(true);

    const auction = await nftAuctionContract.auctions(nftId);
    expect(auction.highestBid).to.equal(higherBid);
    expect(auction.highestBidder).to.equal(bidder2.address);
  });


  it("Should not allow ending an auction that is not active", async function () {
    await expect(nftAuctionContract.endAuction(nftId)).to.be.revertedWith("Auction not active");
  });
});