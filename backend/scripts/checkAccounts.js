const { ethers } = require("hardhat");

async function main() {
  const accounts = await ethers.getSigners();
  console.log("Nombre de comptes disponibles :", accounts.length);
  for (let i = 0; i < accounts.length; i++) {
    console.log(`Compte ${i} : ${accounts[i].address}`);
  }
}

main();