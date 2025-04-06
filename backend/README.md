# Mobility Backend Project

> [!NOTE]
> **Projet4 - Usefull commands**

```shell
npx hardhat compile
npx hardhat node

npx hardhat ignition deploy ignition/modules/MobilityToken.js --network localhost
npx hardhat ignition deploy ignition/modules/MobilityToken.js --network sepolia

https://sepolia.etherscan.io/address/0x77897167D9865FE4556AB7541CCc8111C34318A7#code
npx hardhat verify 0x77897167D9865FE4556AB7541CCc8111C34318A7 0x653e0E9F309C87839a06C228A70D63522bf93A1F --network sepolia

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
    3. beenClaimed function
      ✔ Should return false for unclaimed reference
      ✔ Should return true after successful redeem
      ✔ Should return false for different reference
      ✔ Should return false for different user
      ✔ Should revert with invalid reference length
    4. Redeem function
      ✔ Should transfer tokens from contract to user
      ✔ Should prevent redeem when contract has insufficient balance
      ✔ Should revert when using invalid boardingref length
      ✔ Should prevent redeeming same boardingref twice
    5. sendAndBurn function
      ✔ Should burn user's tokens and return true
      ✔ Should return false for insufficient balance
      ✔ Should return false for zero amount
      ✔ Should not emit TokensBurned on failure
    6. fundContract function
      ✔ Should allow owner to fund the contract
      ✔ Should prevent non-owners from funding
      ✔ Should handle edge case of overfunding
    7. Edge cases
      ✔ Should handle max uint256 values
      ✔ Should handle multiple consecutive operations
    8. ETH Handling
      receive() external payable
        ✔ Should emit LogDepot when receiving ETH
        ✔ Should increase contract ETH balance
        ✔ Should not affect token balances
      fallback() external
        ✔ Should emit LogBadCall for invalid calls
        ✔ Should revert when sending ETH with data
        ✔ Should not change ETH balance on fallback without ETH
    8. ERC20Permit functionality
      ✔ Should allow permit via signature

# Test Coverage

--------------------|----------|----------|----------|----------|----------------|
File                |  % Stmts | % Branch |  % Funcs |  % Lines |Uncovered Lines |
--------------------|----------|----------|----------|----------|----------------|
 contracts/         |    94.44 |      100 |     87.5 |    94.44 |                |
  MobilityToken.sol |    94.44 |      100 |     87.5 |    94.44 |             67 |
--------------------|----------|----------|----------|----------|----------------|
All files           |    94.44 |      100 |     87.5 |    94.44 |                |
--------------------|----------|----------|----------|----------|----------------|
