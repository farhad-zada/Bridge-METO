require("@nomicfoundation/hardhat-toolbox");
require("@openzeppelin/hardhat-upgrades");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  defaultNetwork: "sepolia",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA,
      accounts: [process.env.PKEY],
    },
    mumbai: {
      url: process.env.MUMBAI,
      accounts: [process.env.PKEY],
    },
  },
  solidity: "0.8.19",
};
