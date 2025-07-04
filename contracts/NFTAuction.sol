// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface INFTMinted {
    function safeMint(address to) external returns (uint256);
}

contract NFTAuction {
    struct Auction {
        uint256 highestBid;
        address highestBidder;
        bool isActive;
    }

    address public beneficiary;
    INFTMinted public nftContract;

    mapping(uint256 => Auction) public auctions;

    event AuctionStarted(uint256 nftId);
    event BidPlaced(uint256 nftId, address bidder, uint256 amount);
    event AuctionEnded(uint256 nftId, address winner, uint256 amount);

    constructor(address _beneficiary, address _nftContract) {
        beneficiary = _beneficiary;
        nftContract = INFTMinted(_nftContract);
    }

    function startAuction(uint256 nftId) external {
        require(!auctions[nftId].isActive, "Auction already active");
        auctions[nftId] = Auction(0, address(0), true);
        emit AuctionStarted(nftId);
    }

    function placeBid(uint256 nftId) external payable {
        Auction storage auction = auctions[nftId];
        require(auction.isActive, "Auction is not active");
        require(msg.value > auction.highestBid, "Bid is too low");

        // Refund previous highest bidder
        if (auction.highestBidder != address(0)) {
            payable(auction.highestBidder).transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = msg.sender;
        emit BidPlaced(nftId, msg.sender, msg.value);
    }

    function endAuction(uint256 nftId) external {
        Auction storage auction = auctions[nftId];
        require(auction.isActive, "Auction not active");

        auction.isActive = false;

        if (auction.highestBidder != address(0)) {
            uint256 highestBid = auction.highestBid;
            payable(beneficiary).transfer(highestBid);
            nftContract.safeMint(auction.highestBidder); // Mint NFT al vincitore
            emit AuctionEnded(nftId, auction.highestBidder, highestBid);
        }

        delete auctions[nftId];
    }
}
