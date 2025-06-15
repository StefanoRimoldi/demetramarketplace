// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// Importiamo l'interfaccia del contratto ERC721
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract TransferNft {

    // Evento che segnala il trasferimento dell'NFT
    event nftSent(address indexed sender, address indexed receiver, uint256 nftId, string message);

    // Funzione che permette di inviare l'NFT
    function sendnft(address nftContract, address receiver, uint256 nftId, string memory message) public {
        require(receiver != address(0), "Ricevitore non valido");

        // Trasferisci l'NFT dal mittente al ricevente
        IERC721(nftContract).safeTransferFrom(msg.sender, receiver, nftId);

        // Emetti l'evento che segnala il trasferimento
        emit nftSent(msg.sender, receiver, nftId, message);
    }
}
