var Migrations = artifacts.require("StarNotary");

module.exports = function(deployer) {
  deployer.deploy(Migrations);
};
