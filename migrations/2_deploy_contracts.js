var SimpleStorage = artifacts.require("./SimpleStorage.sol");
var SupplyManagement = artifacts.require("./SupplyManagement.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(SupplyManagement);
};
