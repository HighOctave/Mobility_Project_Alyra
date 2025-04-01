// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

module.exports = buildModule("MobilityTokenModule", (m) => {
  // Récupération de l'adresse du déployeur
  const deployer = m.getAccount(0);
  
  // Déploiement avec passage explicite de l'adresse owner au constructeur Ownable
  const mobilityToken = m.contract("MobilityToken", [deployer], {
    from: deployer
  });

  return { mobilityToken };
});