// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract HandlePayment {
    address public owner;
    uint[] public purchasedNFTs;

    constructor() {
        owner = msg.sender;
    }

    event NFTPurchased(uint indexed nftId, uint price, address indexed buyer);

    function transferMoney(uint nftId) public payable {
        require(msg.value > 0, "La transazione deve avere un valore positivo");
        (bool sent, ) = owner.call{value: msg.value}("");
        require(sent, "Trasferimento fallito");

        purchasedNFTs.push(nftId);
        emit NFTPurchased(nftId, msg.value, msg.sender);
    }

    function getPurchasedNFTs() public view returns (uint[] memory) {
        return purchasedNFTs;
    }
}
