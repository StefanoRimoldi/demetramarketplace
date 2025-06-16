// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TransferNft {

    
    event nftSent(address indexed sender, address indexed receiver, uint256 nftId, string message);

    
    function sendnft(address nftContract, address receiver, uint256 nftId, string memory message) public {
        require(receiver != address(0), "Ricevitore non valido");

        
        IERC721(nftContract).safeTransferFrom(msg.sender, receiver, nftId);

        
        emit nftSent(msg.sender, receiver, nftId, message);
    }
}
