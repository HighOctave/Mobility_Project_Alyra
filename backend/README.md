# Mobility Backend Project

> [!NOTE]
> **Projet4 - Usefull commands**

```shell
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat ignition deploy ignition/modules/MobilityToken.js --network localhost
npx hardhat ignition deploy ignition/modules/MobilityToken.js --network sepolia

npx hardhat test
npx hardhat coverage

npx hardhat verify 0x2469446aF18Fb6927dBE775f67385839d5c1c7F0 --network sepolia
npx hardhat verify 0x2469446aF18Fb6927dBE775f67385839d5c1c7F0 0x653e0E9F309C87839a06C228A70D63522bf93A1F --network sepolia
https://sepolia.etherscan.io/address/0x2469446aF18Fb6927dBE775f67385839d5c1c7F0#code

```
> [!NOTE]
> **Projet4 - Unit Tests MobilityToken**

    1. Initialization  
      ✔ Should mint initial supply to owner and contract 
      
    2. Mint function  
      ✔ Should allow owner to mint new tokens  
      ✔ Should prevent non-owners from minting   
      
    3. Redeem function 
      ✔ Should transfer tokens from contract to user  
      ✔ Should prevent redeem when contract has insufficient balance 
      
    4. sendAndBurn function 
      ✔ Should burn user's tokens and return true  
      ✔ Should return false for insufficient balance  
      ✔ Should return false for zero amount   
      
    5. fundContract function  
      ✔ Should allow owner to fund the contract  
      ✔ Should prevent non-owners from funding  
      ✔ Should handle edge case of overfunding  
      
    6. Edge cases  
      ✔ Should handle max uint256 values 
      ✔ Should handle multiple consecutive operations  

# Test Coverage

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |      100 |      100 |      100 |      100 |                |
  MobilityToken.sol |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
