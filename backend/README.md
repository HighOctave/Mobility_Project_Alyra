# Mobility Backend Project

> [!NOTE]
> **Projet4 - Usefull commands**

```shell
npx hardhat compile
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
npx hardhat run scripts/deploy.js --network sepolia

npx hardhat test
npx hardhat coverage

npx hardhat verify 0x1A71969E3feE5BB695c216be56bdAB29f39d192D --network sepolia
npx hardhat verify 0x1A71969E3feE5BB695c216be56bdAB29f39d192D param1 param2 paramX --network sepolia
https://sepolia.etherscan.io/address/0x1A71969E3feE5BB695c216be56bdAB29f39d192D#code

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
