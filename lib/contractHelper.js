const { ethers } = require("hardhat");
const { debugLog } = require("./debug");

async function getContract(contractName, signer) {
  try {
    const Contract = await ethers.getContractFactory(contractName);
    const contract = await Contract.attach("YOUR_DEPLOYED_CONTRACT_ADDRESS");
    return signer ? contract.connect(signer) : contract;
  } catch (error) {
    debugLog('error', 'Contract interaction failed', error);
    throw error;
  }
} 