// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract MintNFT is ERC721 {
    uint256 private _tokenIdCounter;

    // Mappings per le informazioni dell’NFT
    mapping(uint256 => string) public tokenTitles;
    mapping(uint256 => string) public tokenDescriptions;
    mapping(uint256 => string) public tokenRarity;
    mapping(uint256 => uint256) public tokenPrices;
    mapping(uint256 => string) public tokenImageURLs;
    mapping(uint256 => uint256) public tokenDiscounts;

    event Minted(uint256 tokenId, string title, string description, string rarity, uint256 price, string imageURL, uint256 discount);

    constructor() ERC721("DEMETRA", "DMTR") {}

    // Mint con tutte le informazioni
    function mintNFT(
        address to,
        string memory title,
        string memory description,
        string memory rarity,
        uint256 price,
        string memory imageURL,
        uint256 discount
    ) public {
        uint256 tokenId = _tokenIdCounter;

        _safeMint(to, tokenId);

        tokenTitles[tokenId] = title;
        tokenDescriptions[tokenId] = description;
        tokenRarity[tokenId] = rarity;
        tokenPrices[tokenId] = price;
        tokenImageURLs[tokenId] = imageURL;
        tokenDiscounts[tokenId] = discount;

        _tokenIdCounter++;

        emit Minted(tokenId, title, description, rarity, price, imageURL, discount);
    }

    // Aggiorna il prezzo
    function setTokenPrice(uint256 tokenId, uint256 price) public {
        require(ownerOf(tokenId) == msg.sender, "You are not the owner");
        tokenPrices[tokenId] = price;
    }

    // Acquista NFT al prezzo intero
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


    function getNFTDetails(uint256 tokenId) public view returns (
        string memory title,
        string memory description,
        string memory rarity,
        uint256 price,
        string memory imageURL,
        uint256 discount
    ) {
        return (
            tokenTitles[tokenId],
            tokenDescriptions[tokenId],
            tokenRarity[tokenId],
            tokenPrices[tokenId],
            tokenImageURLs[tokenId],
            tokenDiscounts[tokenId]
        );
    }
}
