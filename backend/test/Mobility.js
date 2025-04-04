const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("MobilityToken", function () {
  let contract;
  let owner, user1, user2;

  beforeEach(async function () {
    [owner, user1, user2] = await ethers.getSigners();
    const MobilityToken = await ethers.getContractFactory("MobilityToken");
    contract = await MobilityToken.deploy(owner.address);
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

  describe("beenClaimed function", function () {
    const validRef = "ABCDEF";
    const invalidRef = "SHORT";

    it("Should return false for unclaimed reference", async function () {
      expect(await contract.beenClaimed(user1.address, validRef)).to.be.false;
    });

    it("Should return true after successful redeem", async function () {
      await contract.connect(user1).redeem(ethers.parseEther("100"), validRef);
      expect(await contract.beenClaimed(user1.address, validRef)).to.be.true;
    });

    it("Should return false for different reference", async function () {
      const anotherRef = "GHIJKL";
      await contract.connect(user1).redeem(ethers.parseEther("100"), validRef);
      expect(await contract.beenClaimed(user1.address, anotherRef)).to.be.false;
    });

    it("Should return false for different user", async function () {
      await contract.connect(user1).redeem(ethers.parseEther("100"), validRef);
      expect(await contract.beenClaimed(user2.address, validRef)).to.be.false;
    });

    it("Should revert with invalid reference length", async function () {
      await expect(
        contract.beenClaimed(user1.address, invalidRef)
      ).to.be.revertedWith("Reference must have six characters");
    });
  });

  describe("Redeem function", function () {
    it("Should transfer tokens from contract to user", async function () {
      const initialContractBalance = await contract.balanceOf(contract.target);
      const redeemAmount = ethers.parseEther("100");
      const boardingref = "ABCDEF"; // Référence valide

      await expect(contract.connect(user1).redeem(redeemAmount, boardingref)) // Ajout du boardingref
        .to.emit(contract, "Redeemed")
        .withArgs(user1.address, redeemAmount);

      // Vérification du solde
      expect(await contract.balanceOf(contract.target)).to.equal(
        initialContractBalance - redeemAmount
      );
      expect(await contract.balanceOf(user1.address)).to.equal(redeemAmount);

      // Vérification du statut de claimed
      expect(await contract.beenClaimed(user1.address, boardingref)).to.be.true;
    });

    it("Should prevent redeem when contract has insufficient balance", async function () {
      const contractBalance = await contract.balanceOf(contract.target);
      const redeemAmount = contractBalance + 1n;
      const boardingref = "123456"; // Référence valide

      await expect(
        contract.connect(user1).redeem(redeemAmount, boardingref) // Ajout du boardingref
      ).to.be.revertedWith("MobilityToken: Insufficient contract balance");
    });

    it("Should revert when using invalid boardingref length", async function () {
      const invalidRef = "SHORT";
      const redeemAmount = ethers.parseEther("100");
      
      await expect(
        contract.connect(user1).redeem(redeemAmount, invalidRef)
      ).to.be.revertedWith("Reference must have six characters");
    });

    it("Should prevent redeeming same boardingref twice", async function () {
      const boardingref = "ABCDEF";
      const redeemAmount = ethers.parseEther("100");
      
      // First redeem should succeed
      await contract.connect(user1).redeem(redeemAmount, boardingref);
      
      // Second attempt should fail
      await expect(
        contract.connect(user1).redeem(redeemAmount, boardingref)
      ).to.be.revertedWith("Token already claimed");
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

    it("Should not emit TokensBurned on failure", async function () {
      // Test zero amount
      await expect(
        contract.connect(user1).sendAndBurn(0)
      ).not.to.emit(contract, "TokensBurned");

      // Test insufficient balance
      const balance = await contract.balanceOf(user1.address);
      await expect(
        contract.connect(user1).sendAndBurn(balance + 1n)
      ).not.to.emit(contract, "TokensBurned");
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
      const boardingref = "XYZ789"; // Référence valide
      await expect(
        contract.connect(user1).redeem(maxUint, boardingref)
      ).to.be.revertedWith("MobilityToken: Insufficient contract balance");
    });

    it("Should handle multiple consecutive operations", async function () {
      const boardingref = "REF123"; // Référence valide

      // 1. Mint 2000 à user2
      await contract
        .connect(owner)
        .mint(user2.address, ethers.parseEther("2000"));

      // 2. Burn 500 par user2
      await contract.connect(user2).sendAndBurn(ethers.parseEther("500"));

      // 3. Fund contract 10000 (assurez-vous que le owner a suffisamment de tokens)
      await contract.connect(owner).fundContract(ethers.parseEther("10000"));

      // 4. Redeem 3000
      await contract
        .connect(user1)
        .redeem(ethers.parseEther("3000"), boardingref); // Ajout du boardingref

      // Vérification du statut de claimed
      expect(await contract.beenClaimed(user1.address, boardingref)).to.be.true;

      // Calcul final attendu :
      const expectedSupply =
        ethers.parseEther("15000000") +
        ethers.parseEther("2000") -
        ethers.parseEther("500");

      expect(await contract.totalSupply()).to.equal(expectedSupply);
    });
  });

  describe("ETH Handling", function () {
    describe("receive() external payable", function () {
      it("Should emit LogDepot when receiving ETH", async function () {
        const amount = ethers.parseEther("1.0");

        await expect(
          owner.sendTransaction({
            to: contract.target,
            value: amount,
          })
        )
          .to.emit(contract, "LogDepot")
          .withArgs(owner.address, amount);
      });

      it("Should increase contract ETH balance", async function () {
        const initialBalance = await ethers.provider.getBalance(
          contract.target
        );
        const amount = ethers.parseEther("0.5");

        await owner.sendTransaction({
          to: contract.target,
          value: amount,
        });

        expect(await ethers.provider.getBalance(contract.target)).to.equal(
          initialBalance + amount
        );
      });

      it("Should not affect token balances", async function () {
        const initialTokenBalance = await contract.balanceOf(contract.target);
        const amount = ethers.parseEther("1.0");

        await owner.sendTransaction({
          to: contract.target,
          value: amount,
        });

        expect(await contract.balanceOf(contract.target)).to.equal(
          initialTokenBalance
        );
      });
    });

    describe("fallback() external", function () {
      it("Should emit LogBadCall for invalid calls", async function () {
        const fakeData = "0x12345678";

        await expect(
          owner.sendTransaction({
            to: contract.target,
            data: fakeData,
          })
        )
          .to.emit(contract, "LogBadCall")
          .withArgs(owner.address);
      });

      it("Should revert when sending ETH with data", async function () {
        const fakeData = "0x12345678";
        const amount = ethers.parseEther("1.0");

        await expect(
          owner.sendTransaction({
            to: contract.target,
            data: fakeData,
            value: amount,
          })
        ).to.be.reverted;
      });

      it("Should not change ETH balance on fallback without ETH", async function () {
        const initialBalance = await ethers.provider.getBalance(
          contract.target
        );
        const fakeData = "0xdeadbeef";

        await owner.sendTransaction({
          to: contract.target,
          data: fakeData,
        });

        expect(await ethers.provider.getBalance(contract.target)).to.equal(
          initialBalance
        );
      });
    });
  });

  describe("ERC20Permit functionality", function () {
    it("Should allow permit via signature", async function () {
      const [owner, spender] = await ethers.getSigners();
      const value = ethers.parseEther("100");
      const nonce = await contract.nonces(owner.address);
      const deadline = ethers.MaxUint256;

      // Build EIP-712 domain
      const domain = {
        name: await contract.name(),
        version: "1",
        chainId: await ethers.provider.getNetwork().then(net => net.chainId),
        verifyingContract: contract.target,
      };

      // Define Permit type
      const types = {
        Permit: [
          { name: "owner", type: "address" },
          { name: "spender", type: "address" },
          { name: "value", type: "uint256" },
          { name: "nonce", type: "uint256" },
          { name: "deadline", type: "uint256" },
        ]
      };

      // Create message
      const message = {
        owner: owner.address,
        spender: spender.address,
        value: value,
        nonce: nonce,
        deadline: deadline,
      };

      // Sign and split signature
      const signature = await owner.signTypedData(domain, types, message);
      const { v, r, s } = ethers.Signature.from(signature);

      // Execute permit
      await contract.permit(
        owner.address,
        spender.address,
        value,
        deadline,
        v,
        r,
        s
      );

      // Verify allowance
      expect(await contract.allowance(owner.address, spender.address)).to.equal(value);
    });
});
});
