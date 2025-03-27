const { ethers } = require("hardhat");

async function main() {
  const Voting = await ethers.getContractFactory("MobilityToken");
  const voting = await Voting.deploy();
  
  await voting.waitForDeployment();
  
  console.log("Contract deployed to address:", voting.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });