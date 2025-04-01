const { ethers } = require("hardhat");

async function main() {
  const MobilityToken = await ethers.getContractFactory("MobilityToken");
  const contract = await MobilityToken.deploy();
  
  await contract.waitForDeployment();
  
  console.log("Contract deployed to address:", contract.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });