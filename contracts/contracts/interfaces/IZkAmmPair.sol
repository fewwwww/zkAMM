// SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

interface IZkAmmPair {
    event AddInitLiquidity(address payer, address recipient, uint amount0, uint amount1);
    event AddLiquidity(address payer, address recipient, uint amount0, uint reserve0, uint reserve1, uint totalSupply);
    event LiquidityAdded(address payer, address recipient, uint amount0, uint amount1, uint liquidity);
    event RemoveLiquidity(address sender, address recipient, uint liquidity, uint reserve0, uint reserve1, uint totalSupply);
    event LiquidityRemoved(address sender, address recipient, uint liquidity, uint amount0, uint amount1);
    event Swap(address payer, address recipient, bool zeroForOne, uint amountIn, uint reserve0, uint reserve1);
    event Swapped(address payer, address recipient, bool zeroForOne, uint amountIn, uint amountOut);

    function token0() external view returns (address);
    function token1() external view returns (address);
    function zkGraph() external view returns (address);
    function reserve0() external view returns (uint);
    function reserve1() external view returns (uint);

    function setGraph(address graph) external;

    function addInitLiquidity(
        address recipient, 
        uint amount0, 
        uint amount1
    ) external;
    function addInitLiquidityCallback(
        address payer,
        address recipient,
        uint amount0,
        uint amount1,
        uint liquidity
    ) external;

    function addLiquidity(address recipient, uint amount0) external;
    function addLiquidityCallback(
        address payer,
        address recipient,
        uint amount0,
        uint amount1,
        uint liquidity
    ) external;

    function removeLiquidity(address recipient, uint liquidity) external;
    function removeLiquidityCallback(
        address sender,
        address recipient,
        uint liquidity,
        uint amount0,
        uint amount1
    ) external;

    function swap(address recipient, bool zeroForOne, uint amountIn) external;
    function swapCallback(
        address payer,
        address recipient,
        bool zeroForOne,
        uint amountIn,
        uint amountOut
    ) external;
}