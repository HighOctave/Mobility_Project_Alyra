# Mobility Backend Project

> [!NOTE]
> **Projet4 - Usefull commands**

```shell
npx hardhat compile
npx hardhat node

npx hardhat ignition deploy ignition/modules/MobilityToken.js --network localhost
npx hardhat ignition deploy ignition/modules/MobilityToken.js --network sepolia

npx hardhat verify 0x546246E846f75148b682C2A08501BcDa5e37F5d3 0x653e0E9F309C87839a06C228A70D63522bf93A1F --network sepolia
https://sepolia.etherscan.io/address/0x2469446aF18Fb6927dBE775f67385839d5c1c7F0#code

npx hardhat test
npx hardhat coverage

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
    
    7. ETH Handling
      receive() external payable
        ✔ Should emit LogDepot when receiving ETH
        ✔ Should increase contract ETH balance
        ✔ Should not affect token balances
      fallback() external
        ✔ Should emit LogBadCall for invalid calls
        ✔ Should revert when sending ETH with data
        ✔ Should not change ETH balance on fallback without ETH

# Test Coverage

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |      100 |      100 |      100 |      100 |                |
  MobilityToken.sol |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
All files           |      100 |      100 |      100 |      100 |                |
--------------------|----------|----------|----------|----------|----------------|
