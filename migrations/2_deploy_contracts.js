var Marketplace = artifacts.require("./MarketPlace.sol");

module.exports = function(deployer) {
  deployer.deploy(Marketplace);
};
