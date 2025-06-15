const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("HandlePayment", function () {
    let HandlePayment;
    let handlePayment;
    let owner;
    let buyer;
    const nftId = 123;
    const purchasePrice = 1000000000000000000n; // 1 Ether in Wei, usando bigint

    beforeEach(async function () {
        // Ottieni gli account
        [owner, buyer] = await ethers.getSigners();

        // Deploy del contratto HandlePayment
        HandlePayment = await ethers.getContractFactory("HandlePayment");
        handlePayment = await HandlePayment.deploy();
        await handlePayment.deployed();
    });

    it("Dovrebbe impostare correttamente il proprietario nel costruttore", async function () {
        expect(await handlePayment.owner()).to.equal(owner.address);
    });

    it("Dovrebbe fare revert se transferMoney viene chiamata senza valore", async function () {
        await expect(handlePayment.connect(buyer).transferMoney(nftId)).to.be.revertedWith(
            "La transazione deve avere un valore positivo"
        );
    });
});
