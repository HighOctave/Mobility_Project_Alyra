const {
  time,
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { anyValue } = require("@nomicfoundation/hardhat-chai-matchers/withArgs");
const { expect } = require("chai");

describe("MobilityToken", function () {

  // it("Deploy contract", async function () {
  //   const ContractFactory = await ethers.getContractFactory("MobilityToken");

  //   const instance = await ContractFactory.deploy();
  //   await instance.waitForDeployment();

  //   expect(await instance.name()).to.equal("MobilityToken");
  // });

  // it("check first balance", async () => {
  //   expect(await MyTokenInstance.balanceOf(_owner)).to.be.bignumber.equal(_initialSupply);
  // });

});
