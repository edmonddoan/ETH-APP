const { ethers } = require("hardhat");

async function main() {
  // Get WETH contract
  const WETH_ADDRESS = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"; // Sepolia WETH
  const weth = await ethers.getContractAt("IWETH", WETH_ADDRESS);

  // Wrap some ETH
  const wrapAmount = ethers.parseEther("0.1");
  await weth.deposit({ value: wrapAmount });
  console.log(`Wrapped ${ethers.formatEther(wrapAmount)} ETH to WETH`);

  // Approve spending for your arbitrage contract
  await weth.approve(YOUR_CONTRACT_ADDRESS, ethers.MaxUint256);
  console.log("Approved WETH spending");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 