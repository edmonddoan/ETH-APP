const { ethers } = require("hardhat");

async function main() {
  // Example Sepolia pool addresses (replace with actual testnet pools)
  const POOL0 = "0x14dC79964da2C08b23698B3D3cc7Ca32193d9955"; // e.g., WETH/USDC pool
  const POOL1 = "0x6D4984D5196E4A1Cb0c91E087655F598FB2E576F"; // e.g., WETH/USDT pool
  const TOKEN_IN = "0x7b79995e5f793A07Bc00c21412e50Ecae098E7f9"; // e.g., WETH address

  // Get deployed contract instance
  const BAM_ARBITRAGE_ADDRESS = "0xd48b8FB6cF3a9f087859a0bC48D66C96De31e36D";
  const bamArbitrage = await ethers.getContractAt("BamArbitrage", BAM_ARBITRAGE_ADDRESS);

  try {
    // Test checkArbitrage
    const profit = await bamArbitrage.checkArbitrage(
      POOL0,
      POOL1,
      TOKEN_IN,
      ethers.parseEther("1") // 1 TOKEN_IN
    );
    console.log(`Potential profit: ${ethers.formatEther(profit)} ETH`);

    // Test executeArbitrage (if profit found)
    if (profit > 0) {
      const tx = await bamArbitrage.executeArbitrage(
        POOL0,
        POOL1,
        TOKEN_IN,
        ethers.parseEther("1")
      );
      await tx.wait();
      console.log(`Arbitrage executed! TX: ${tx.hash}`);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

main(); 