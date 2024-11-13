// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Factory.sol";
import "@uniswap/v3-core/contracts/interfaces/IUniswapV3Pool.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@uniswap/v3-periphery/contracts/interfaces/INonfungiblePositionManager.sol";
import "@uniswap/v3-periphery/contracts/libraries/TransferHelper.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";

contract BamPool is IERC721Receiver {
    address public constant FACTORY = 0x1F98431c8aD98523631AE4a59f267346ea31F984;
    address public constant WETH = 0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14;
    address public constant POSITION_MANAGER = 0xC36442b4a4522E871399CD717aBDD847Ab11FE88;
    uint24 public constant POOL_FEE = 3000;

    // Track liquidity positions
    struct Position {
        address owner;
        uint128 liquidity;
        address token0;
        address token1;
    }
    
    mapping(uint256 => Position) public positions;

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
        address token,
        uint256 tokenAmount,
        uint256 ethAmount,
        int24 tickLower,
        int24 tickUpper
    ) external payable returns (uint256 tokenId) {
        require(msg.value == ethAmount, "Incorrect ETH amount");
        
        // Transfer tokens to this contract
        TransferHelper.safeTransferFrom(token, msg.sender, address(this), tokenAmount);
        
        // Approve position manager to spend tokens
        TransferHelper.safeApprove(token, POSITION_MANAGER, tokenAmount);
        
        INonfungiblePositionManager.MintParams memory params = 
            INonfungiblePositionManager.MintParams({
                token0: token < WETH ? token : WETH,
                token1: token < WETH ? WETH : token,
                fee: POOL_FEE,
                tickLower: tickLower,
                tickUpper: tickUpper,
                amount0Desired: token < WETH ? tokenAmount : ethAmount,
                amount1Desired: token < WETH ? ethAmount : tokenAmount,
                amount0Min: 0, // Add slippage protection in production
                amount1Min: 0, // Add slippage protection in production
                recipient: address(this),
                deadline: block.timestamp + 15 minutes
            });

        // Mint new position
        (tokenId, , , ) = INonfungiblePositionManager(POSITION_MANAGER).mint{value: ethAmount}(params);
        
        // Store position info
        _createPosition(msg.sender, tokenId);
    }

    function _createPosition(address owner, uint256 tokenId) internal {
        (, , address token0, address token1, , , , uint128 liquidity, , , , ) =
            INonfungiblePositionManager(POSITION_MANAGER).positions(tokenId);

        positions[tokenId] = Position({
            owner: owner,
            liquidity: liquidity,
            token0: token0,
            token1: token1
        });
    }

    // Required for IERC721Receiver
    function onERC721Received(
        address operator,
        address,
        uint256 tokenId,
        bytes calldata
    ) external override returns (bytes4) {
        _createPosition(operator, tokenId);
        return this.onERC721Received.selector;
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