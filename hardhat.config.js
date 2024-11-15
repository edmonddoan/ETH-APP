require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.27",
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545"
    },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,  // Your Alchemy/Infura endpoint
      accounts: [process.env.PRIVATE_KEY], // Your wallet private key
      chainId: 11155111
    }
  }
};
