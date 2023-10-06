# zkAMM

An AMM powered by Hyper Oracle zkOracle.

## Introduction

zkAMM's core computation (eg. addLiquidity) are performed in zkOracle, rather than in traditional onchain calculations in Solidity. This gives zkAMM unlimited logic expansion and complexity, as zkOracle is not limited by the computational resources of the EVM, and any computation in zkOracle ends up as an O(1) Cost zk proof. 

## Workflow

![workflow](https://i.ibb.co/6szVpS4/2023-10-06-1-40-40.png)

## Next Steps

zkAMM currently implements the Uniswap v2 architecture with an onchain smart contract to handle and verify zkOracle computations and zk proofs and a zkGraph to program and config zkOracle, and will continue to implement the v3 and v4 architectures.

## Deployments

On Sepolia:

- Token0: 0x1b3631A99A69275bC7E3b539FeD4DaAFaDDfe1B0
- Token1: 0x7aBF19CE8696A1D8945F9125758EbCe2F6F0Fd91
- ZkAmmPair: 0x94aD21Bf72F0f4ab545E59ea3d5C1F863d74C629
