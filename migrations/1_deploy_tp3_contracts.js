const Exercice1Addition = artifacts.require("Exercice1Addition");
const Exercice2Conversion = artifacts.require("Exercice2Conversion");
const Exercice3GestionChaines = artifacts.require("Exercice3GestionChaines");
const Exercice4NombrePositif = artifacts.require("Exercice4NombrePositif");
const Exercice5Parite = artifacts.require("Exercice5Parite");
const Exercice6ListeNombres = artifacts.require("Exercice6ListeNombres");
const Rectangle = artifacts.require("Rectangle");
const Payment = artifacts.require("Payment");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(Exercice1Addition, 10, 15);
  await deployer.deploy(Exercice2Conversion);
  await deployer.deploy(Exercice3GestionChaines, "Bonjour Solidity");
  await deployer.deploy(Exercice4NombrePositif);
  await deployer.deploy(Exercice5Parite);
  await deployer.deploy(Exercice6ListeNombres, [2, 4, 6]);
  await deployer.deploy(Rectangle, 0, 0, 12, 5);
  await deployer.deploy(Payment, accounts[0]);
};
