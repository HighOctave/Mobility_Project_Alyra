# Sample Hardhat Project

This project demonstrates a basic Hardhat use case. It comes with a sample contract, a test for that contract, and a Hardhat Ignition module that deploys that contract.

Try running some of the following tasks:

```shell
npx hardhat help
npx hardhat test
REPORT_GAS=true npx hardhat test
npx hardhat node
npx hardhat ignition deploy ./ignition/modules/Lock.js
```

```shell
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost

npx hardhat test
npx hardhat coverage

npx hardhat node
npx hardhat ignition deploy ignition/modules/Voting.js

npx hardhat ignition deploy ignition/modules/Voting.js --network sepolia --deployment-id sepolia-deployment

npx hardhat run ./scripts/deploy.js --network sepolia
npx hardhat verify 0x1A71969E3feE5BB695c216be56bdAB29f39d192D --network sepolia
npx hardhat verify 0x1A71969E3feE5BB695c216be56bdAB29f39d192D param1 param2 paramX --network sepolia
https://sepolia.etherscan.io/address/0x1A71969E3feE5BB695c216be56bdAB29f39d192D#code

```
