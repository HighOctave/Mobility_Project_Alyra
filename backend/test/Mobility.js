const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MobilityToken", function () {
  let contract;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const MobilityToken = await ethers.getContractFactory("MobilityToken");
    contract = await MobilityToken.deploy();
    await contract.waitForDeployment();
  });

  describe("Initialization", function () {
    it("Should mint initial supply to owner and contract", async function () {
      const ownerBalance = await contract.balanceOf(owner.address);
      const contractBalance = await contract.balanceOf(contract.target);

      expect(ownerBalance).to.equal(ethers.parseEther("10000000"));
      expect(contractBalance).to.equal(ethers.parseEther("5000000"));
    });
  });

  describe("Mint function", function () {
    it("Should allow owner to mint new tokens", async function () {
      const amount = ethers.parseEther("1000");
      await contract.connect(owner).mint(user1.address, amount);

      expect(await contract.balanceOf(user1.address)).to.equal(amount);
    });

    it("Should prevent non-owners from minting", async function () {
      const amount = ethers.parseEther("1000");
      await expect(
        contract.connect(user1).mint(user1.address, amount)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });
  });

  describe("Redeem function", function () {
    it("Should transfer tokens from contract to user", async function () {
      const initialContractBalance = await contract.balanceOf(contract.target);
      const redeemAmount = ethers.parseEther("100");

      await expect(contract.connect(user1).redeem(redeemAmount))
        .to.emit(contract, "Redeemed")
        .withArgs(user1.address, redeemAmount);

      expect(await contract.balanceOf(contract.target)).to.equal(
        initialContractBalance - redeemAmount
      );
      expect(await contract.balanceOf(user1.address)).to.equal(redeemAmount);
    });

    it("Should prevent redeem when contract has insufficient balance", async function () {
      const contractBalance = await contract.balanceOf(contract.target);
      const redeemAmount = contractBalance + 1n;

      await expect(
        contract.connect(user1).redeem(redeemAmount)
      ).to.be.revertedWith("MobilityToken: Insufficient contract balance");
    });
  });

  describe("sendAndBurn function", function () {
    let initialUserBalance;
    let initialSupply;

    beforeEach(async function () {
      const amount = ethers.parseEther("1000");
      initialSupply = await contract.totalSupply();
      await contract.connect(owner).mint(user1.address, amount);
      initialUserBalance = await contract.balanceOf(user1.address);
    });

    it("Should burn user's tokens and return true", async function () {
      const burnAmount = ethers.parseEther("500");

      const tx = await contract.connect(user1).sendAndBurn(burnAmount);
      await expect(tx)
        .to.emit(contract, "TokensBurned")
        .withArgs(user1.address, burnAmount);

      // Vérification du solde utilisateur
      expect(await contract.balanceOf(user1.address)).to.equal(
        initialUserBalance - burnAmount
      );

      // Vérification du total supply
      expect(await contract.totalSupply()).to.equal(
        initialSupply + initialUserBalance - burnAmount
      );
    });

    it("Should return false for insufficient balance", async function () {
      const balance = await contract.balanceOf(user1.address);
      const result = await contract
        .connect(user1)
        .sendAndBurn.staticCall(balance + 1n);

      expect(result).to.be.false;
    });

    it("Should return false for zero amount", async function () {
      const result = await contract.connect(user1).sendAndBurn.staticCall(0);
      expect(result).to.be.false;
    });
  });

  describe("fundContract function", function () {
    it("Should allow owner to fund the contract", async function () {
      const fundAmount = ethers.parseEther("1000");
      const initialContractBalance = await contract.balanceOf(contract.target);
      const initialOwnerBalance = await contract.balanceOf(owner.address);

      await contract.connect(owner).fundContract(fundAmount);

      expect(await contract.balanceOf(contract.target)).to.equal(
        initialContractBalance + fundAmount
      );
      expect(await contract.balanceOf(owner.address)).to.equal(
        initialOwnerBalance - fundAmount
      );
    });

    it("Should prevent non-owners from funding", async function () {
      const fundAmount = ethers.parseEther("1000");
      await expect(
        contract.connect(user1).fundContract(fundAmount)
      ).to.be.revertedWithCustomError(contract, "OwnableUnauthorizedAccount");
    });

    it("Should handle edge case of overfunding", async function () {
      const ownerBalance = await contract.balanceOf(owner.address);

      // Utilisation de la custom error d'OpenZeppelin
      await expect(contract.connect(owner).fundContract(ownerBalance + 1n))
        .to.be.revertedWithCustomError(contract, "ERC20InsufficientBalance")
        .withArgs(owner.address, ownerBalance, ownerBalance + 1n);
    });
  });

  describe("Edge cases", function () {
    it("Should handle max uint256 values", async function () {
      const maxUint = ethers.MaxUint256;
      await expect(contract.connect(user1).redeem(maxUint)).to.be.revertedWith(
        "MobilityToken: Insufficient contract balance"
      );
    });

    it("Should handle multiple consecutive operations", async function () {
      // 1. Mint 2000 à user2 (augmente la supply totale)
      await contract
        .connect(owner)
        .mint(user2.address, ethers.parseEther("2000"));

      // 2. Burn 500 par user2 (réduit la supply)
      await contract.connect(user2).sendAndBurn(ethers.parseEther("500"));

      // 3. Fund contract 10000 (transfert existant, ne change pas la supply)
      await contract.connect(owner).fundContract(ethers.parseEther("10000"));

      // 4. Redeem 3000 (transfert interne, ne change pas la supply)
      await contract.connect(user1).redeem(ethers.parseEther("3000"));

      // Calcul final attendu :
      const expectedSupply =
        ethers.parseEther("15000000") + // Initial
        ethers.parseEther("2000") - // Mint
        ethers.parseEther("500"); // Burn

      expect(await contract.totalSupply()).to.equal(expectedSupply);
    });
  });
});
