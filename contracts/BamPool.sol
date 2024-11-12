// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract BamPool {
    address public constant FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984; // Uniswap V3 Factory
    address public constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14; // Sepolia WETH
    uint24 public constant POOL_FEE = 3000; // 0.3% fee tier

    function createPool(address tokenAddress) external returns (address) {
        IUniswapV3Factory factory = IUniswapV3Factory(FACTORY);
        address pool = factory.createPool(
            tokenAddress,
            WETH,
            POOL_FEE
        );
        return pool;
    }

    function addInitialLiquidity(
        address pool,
        address token,
        uint256 tokenAmount,
        uint256 ethAmount
    ) external payable {
        require(msg.value == ethAmount, "Incorrect ETH amount");
        
        IERC20(token).transferFrom(msg.sender, address(this), tokenAmount);
        IERC20(token).approve(pool, tokenAmount);
        
        // Initialize pool with price and add liquidity
        IUniswapV3Pool(pool).initialize(encodePriceSqrt(1, 1)); // 1:1 initial price
        
        // Add liquidity logic here
        // Note: Full liquidity addition implementation requires more complex logic
    }
    
    function encodePriceSqrt(uint256 price1, uint256 price0) internal pure returns (uint160) {
        return uint160(sqrt((price1 << 192) / price0));
    }
    
    function sqrt(uint256 x) internal pure returns (uint256 y) {
        uint256 z = (x + 1) / 2;
        y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
    }
} 