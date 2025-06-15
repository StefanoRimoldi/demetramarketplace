// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract NftContract is ERC721 {
    uint256 private _tokenIdCounter;
    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => string) public tokenRarity;


    constructor() ERC721("NFTMarketplace", "NFTM") {}

    function mintNFT(address to, string memory rarity) public {
        uint256 tokenId = _tokenIdCounter;
        _safeMint(to, tokenId);
        tokenRarity[tokenId] = rarity;
        _tokenIdCounter++;
    }

    function setTokenPrice(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        tokenPrices[tokenId] = price;
    }

    function buyNFT(uint256 tokenId) public payable {
        uint256 price = tokenPrices[tokenId];
        require(msg.value >= price, "Insufficient funds");

        address owner = ownerOf(tokenId);
        _transfer(owner, msg.sender, tokenId);

        payable(owner).transfer(msg.value);
        tokenPrices[tokenId] = 0;
    }

    function transferNFT(address from, address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == from, "You are not the owner");
        _transfer(from, to, tokenId);
    }
}
