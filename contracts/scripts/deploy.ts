import { ethers } from "hardhat";

async function main() {
  const verifyStr = "npx hardhat verify --network";

  const MockToken = await ethers.getContractFactory("MockToken");

  const tokenA = await MockToken.deploy("MockWBTC", "WBTC");
  const addressTokenA = await tokenA.getAddress();
  console.log("TokenA", addressTokenA);
  console.log(
    verifyStr,
    process.env.HARDHAT_NETWORK,
    addressTokenA,
    "MockWBTC",
    "WBTC"
  );

  const tokenB = await MockToken.deploy("MockWETH", "WETH");
  const addressTokenB = await tokenB.getAddress();
  console.log("TokenB", addressTokenB);
  console.log(
    verifyStr,
    process.env.HARDHAT_NETWORK,
    addressTokenB,
    "MockWETH",
    "WETH"
  );

  const ZkAmmPair = await ethers.getContractFactory("ZkAmmPair");
  const pair = await ZkAmmPair.deploy(addressTokenA, addressTokenB);
  const pairAddress = await pair.getAddress();
  console.log("ZkAmmPair", pairAddress);
  console.log(
    verifyStr,
    process.env.HARDHAT_NETWORK,
    pairAddress,
    addressTokenA,
    addressTokenB
  );

  // set zkGraph
  // const zkGraph = "";
  // const pairAddress = ""
  // const pair = await ethers.getContractAt("ZkAmmPair", pairAddress);
  // await pair.setGraph(zkGraph);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
