const { ethers } = require("hardhat");

async function main() {
  const BamPool = await ethers.getContractFactory("BamPool");
  const bamPool = await BamPool.deploy();
  // Wait for the deployment transaction to be mined
  await bamPool.waitForDeployment();

  console.log("BamPool deployed to:", await bamPool.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 