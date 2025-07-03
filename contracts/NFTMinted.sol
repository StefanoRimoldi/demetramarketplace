// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract NFTMinted is ERC721, Ownable {
    uint256 public tokenCounter;

    constructor() ERC721("NFTMinted", "NFTM") Ownable(msg.sender) {
        tokenCounter = 0;
    }

    function safeMint(address to) external onlyOwner returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(to, newTokenId);
        tokenCounter++;
        return newTokenId;
    }
}