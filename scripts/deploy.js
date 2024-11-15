const hre = require("hardhat");

async function main() {
  try {
    // Get the ContractFactory
    const BamArbitrage = await hre.ethers.getContractFactory("BamArbitrage");
    
    // Deploy the contract
    const contract = await BamArbitrage.deploy();
    
    // Get the deployed contract address
    const address = await contract.getAddress();
    
    console.log(`BamArbitrage deployed to: ${address}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

main(); 