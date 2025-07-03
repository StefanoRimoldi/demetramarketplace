// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract WinnerNFT is ERC721URIStorage {
    uint256 private _nextTokenId; // Questa variabile sostituirà Counters.Counter

    constructor() ERC721("DemetraToken", "DMTR") {}

    function mint(string memory tokenUri) public returns (uint256) {
        // Incrementa _nextTokenId per ottenere un nuovo ID
        // Solidity 0.8.0+ gestisce automaticamente l'overflow
        uint256 newItemId = _nextTokenId;
        _nextTokenId++; 

        _mint(msg.sender, newItemId);
        _setTokenURI(newItemId, tokenUri);
        return newItemId;
    }

    // Funzione opzionale per vedere il prossimo ID disponibile
    function getNextTokenId() public view returns (uint256) {
        return _nextTokenId;
    }
}