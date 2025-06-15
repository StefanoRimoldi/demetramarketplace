const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MintNFT", function () {
    let MintNFT;
    let mintNFTContract;
    let owner;
    let minter;
    let buyer;
    const initialPrice = 100;
    const updatedPrice = 200;
    const tokenId = 0; // Token ID è 0 perché il primo mint

    beforeEach(async function () {
        // Ottieni gli account
        [owner, minter, buyer] = await ethers.getSigners();

        // Deploy del contratto MintNFT
        MintNFT = await ethers.getContractFactory("MintNFT");
        mintNFTContract = await MintNFT.deploy();
        await mintNFTContract.deployed();

        // Minta un NFT per i test
        await mintNFTContract.mintNFT(
            minter.address,
            "Titolo NFT",
            "Descrizione NFT",
            "Raro",
            initialPrice,
            "https://example.com/image.png",
            10
        );
    });

    it("Should mint an NFT with correct details", async function () {
        const [
            title,
            description,
            rarity,
            price,
            imageURL,
            discount,
        ] = await mintNFTContract.getNFTDetails(tokenId);

        expect(await mintNFTContract.ownerOf(tokenId)).to.equal(minter.address);
        expect(title).to.equal("Titolo NFT");
        expect(description).to.equal("Descrizione NFT");
        expect(rarity).to.equal("Raro");
        expect(price).to.equal(initialPrice);
        expect(imageURL).to.equal("https://example.com/image.png");
        expect(discount).to.equal(10);
    });

    it("Should update the price of an NFT", async function () {
        await mintNFTContract.connect(minter).setTokenPrice(tokenId, updatedPrice); // Connetti come minter
        const [
            ,
            ,
            ,
            price,
        ] = await mintNFTContract.getNFTDetails(tokenId);
        expect(price).to.equal(updatedPrice);
    });

    it("Should allow a buyer to buy an NFT", async function () {
        const initialOwnerBalance = await ethers.provider.getBalance(minter.address);

        // Imposta il prezzo
        await mintNFTContract.connect(minter).setTokenPrice(tokenId, initialPrice); // Connetti come minter

        // Acquista l'NFT
        const tx = await mintNFTContract.connect(buyer).buyNFT(tokenId, {
            value: initialPrice,
        });
        await tx.wait();

        const newOwner = await mintNFTContract.ownerOf(tokenId);
        const finalOwnerBalance = await ethers.provider.getBalance(minter.address);

        expect(newOwner).to.equal(buyer.address);
        // Check balance change.  Allow a tolerance for gas costs, but use a percentage.
        const expectedMinBalance = initialOwnerBalance.add(initialPrice).mul(99).div(100); // Allow 1% tolerance
        const expectedMaxBalance = initialOwnerBalance.add(initialPrice).mul(101).div(100); // Allow 1% tolerance

        expect(finalOwnerBalance).to.be.gte(expectedMinBalance);
        expect(finalOwnerBalance).to.be.lte(expectedMaxBalance);
    });

    it("Should revert if buyer sends insufficient funds", async function () {
        await mintNFTContract.connect(minter).setTokenPrice(tokenId, initialPrice); // Connetti come minter
        await expect(
            mintNFTContract.connect(buyer).buyNFT(tokenId, { value: initialPrice - 1 })
        ).to.be.revertedWith("Insufficient funds");
    });

    it("Should allow the owner to transfer the NFT", async function () {
        await mintNFTContract.connect(minter).transferNFT(minter.address, buyer.address, tokenId);
        const newOwner = await mintNFTContract.ownerOf(tokenId);
        expect(newOwner).to.equal(buyer.address);
    });

    // Additional test:  Test the Minted event.
    it("Should emit the Minted event with correct parameters", async function () {
        const tx = await mintNFTContract.mintNFT(
            buyer.address,
            "Test Title",
            "Test Description",
            "Test Rarity",
            initialPrice,
            "https://test.com/test.png",
            20
        );
        const receipt = await tx.wait();
        const mintedEvent = receipt.events.find(e => e.event === "Minted");

        expect(mintedEvent).to.not.be.undefined;
        expect(mintedEvent.args.tokenId).to.equal(1); // tokenId incrementa a 1 dopo il primo mint
        expect(mintedEvent.args.title).to.equal("Test Title");
        expect(mintedEvent.args.description).to.equal("Test Description");
        expect(mintedEvent.args.rarity).to.equal("Test Rarity");
        expect(mintedEvent.args.price).to.equal(initialPrice);
        expect(mintedEvent.args.imageURL).to.equal("https://test.com/test.png");
        expect(mintedEvent.args.discount).to.equal(20);
    });
});

