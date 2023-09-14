//@ts-ignore
import { Bytes, Event, BigInt } from "@hyperoracle/zkgraph-lib";

// keccak256("AddInitLiquidity(address,address,uint256,uint256)")
var esig_AddInitLiquidity = Bytes.fromHexString(
  "0x4a98532efdde1db3b37b6ee00bb03b7945fac25a8957e6a5c7144ef6d263fe23"
);
// keccak256("AddLiquidity(address,address,uint256,uint256,uint256,uint256)")
var esig_AddLiquidity = Bytes.fromHexString(
  "0xae2a8a26a2b64d8d971277b87c24d1a12181aef23cf76b898a32ce8dd14c7591"
);
// keccak256("RemoveLiquidity(address,address,uint256,uint256,uint256,uint256)")
var esig_RemoveLiquidity = Bytes.fromHexString(
  "0x6291bcce50c38c39d79a98ff5fad7f35319722e73285b50a6140dbfac75d511e"
);
// keccak256("Swap(address,address,bool,uint256,uint256.uint256)")
var esig_Swap = Bytes.fromHexString(
  "0xcedd389179e63bdb3349b7698d9a1ac854d9e9e6897da7b66b48391ce7cb70a9"
);

// bytes4(keccak256("addInitLiquidityCallback(address,address,uint256,uint256,uint256)"))
var selector_addInitLiquidityCallback = Bytes.fromHexString("0x0c389fc2");
// bytes4(keccak256("addLiquidityCallback(address,address,uint256,uint256,uint256)"))
var selector_addLiquidityCallback = Bytes.fromHexString("0x7298844f");
// bytes4(keccak256("removeLiquidityCallback(address,address,uint256,uint256,uint256)"))
var selector_removeLiquidityCallback = Bytes.fromHexString("0x6473145f");
// bytes4(keccak256("swapCallback(address,address,bool,uint256,uint256)"))
var selector_swapCallback = Bytes.fromHexString("0xc35a8aaa");

export function handleEvents(events: Event[]): Bytes {
  let payload = Bytes.empty();
  const length = events.length;
  for (let i = 0; i < length; i++) {
    if (events[i].esig == esig_AddInitLiquidity) {
      payload = handleAddInitLiquidity(events[i]);
    }
    if (events[i].esig == esig_AddLiquidity) {
      payload = handleAddLiquidity(events[i]);
    }
    if (events[i].esig == esig_RemoveLiquidity) {
      payload = handleRemoveLiquidity(events[i]);
    }
    if (events[i].esig == esig_Swap) {
      payload = handleSwap(events[i]);
    }
  }

  return payload;
}

function handleAddInitLiquidity(event: Event): Bytes {
  const source = changetype<Bytes>(event.data);
  const payer = source.slice(0, 32);
  const recipient = source.slice(32, 64);
  const amount0 = source.slice(64, 96);
  const amount1 = source.slice(96, 128);

  const amount0BigInt = BigInt.fromBytesBigEndian(amount0);
  const amount1BigInt = BigInt.fromBytesBigEndian(amount1);
  const liquidity = amount0BigInt.mul(amount1BigInt).sqrt();

  const liquidityEncoded = Bytes.fromHexString(
    liquidity.toHexString()
  ).padStart(32, 0);

  const payload = selector_addInitLiquidityCallback
    .concat(payer)
    .concat(recipient)
    .concat(amount0)
    .concat(amount1)
    .concat(liquidityEncoded);

  return Bytes.fromByteArray(payload);
}

function handleAddLiquidity(event: Event): Bytes {
  const source = changetype<Bytes>(event.data);
  const payer = source.slice(0, 32);
  const recipient = source.slice(32, 64);
  const amount0 = source.slice(64, 96);
  const reserve0 = source.slice(96, 128);
  const reserve1 = source.slice(128, 160);
  const totalSupply = source.slice(160, 192);

  const amount0BigInt = BigInt.fromBytesBigEndian(amount0);
  const reserve0BigInt = BigInt.fromBytesBigEndian(reserve0);
  const reserve1BigInt = BigInt.fromBytesBigEndian(reserve1);
  const totalSupplyBigInt = BigInt.fromBytesBigEndian(totalSupply);

  const amount1BigInt = amount0BigInt.mul(reserve1BigInt).div(reserve0BigInt);

  const liquidity1 = amount0BigInt.mul(totalSupplyBigInt).div(reserve0BigInt);
  const liquidity2 = amount1BigInt.mul(totalSupplyBigInt).div(reserve1BigInt);
  const liquidity = liquidity1 < liquidity2 ? liquidity1 : liquidity2;

  const amount1Encoded = Bytes.fromHexString(
    amount1BigInt.toHexString()
  ).padStart(32, 0);
  const liquidityEncoded = Bytes.fromHexString(
    liquidity.toHexString()
  ).padStart(32, 0);

  const payload = selector_addLiquidityCallback
    .concat(payer)
    .concat(recipient)
    .concat(amount0)
    .concat(amount1Encoded)
    .concat(liquidityEncoded);

  return Bytes.fromByteArray(payload);
}

function handleRemoveLiquidity(event: Event): Bytes {
  const source = changetype<Bytes>(event.data);
  const sender = source.slice(0, 32);
  const recipient = source.slice(32, 64);
  const liquidity = source.slice(64, 96);
  const reserve0 = source.slice(96, 128);
  const reserve1 = source.slice(128, 160);
  const totalSupply = source.slice(160, 192);

  const liquidityBigInt = BigInt.fromBytesBigEndian(liquidity);
  const reserve0BigInt = BigInt.fromBytesBigEndian(reserve0);
  const reserve1BIgInt = BigInt.fromBytesBigEndian(reserve1);
  const totalSupplyBigInt = BigInt.fromBytesBigEndian(totalSupply);

  const amount0 = liquidityBigInt.mul(reserve0BigInt).div(totalSupplyBigInt);
  const amount1 = liquidityBigInt.mul(reserve1BIgInt).div(totalSupplyBigInt);

  const amount0Encoded = Bytes.fromHexString(amount0.toHexString()).padStart(
    32,
    0
  );
  const amount1Encoded = Bytes.fromHexString(amount1.toHexString()).padStart(
    32,
    0
  );

  const payload = selector_removeLiquidityCallback
    .concat(sender)
    .concat(recipient)
    .concat(liquidity)
    .concat(amount0Encoded)
    .concat(amount1Encoded);

  return Bytes.fromByteArray(payload);
}

function handleSwap(event: Event): Bytes {
  const source = changetype<Bytes>(event.data);
  const payer = source.slice(0, 32);
  const recipient = source.slice(32, 64);
  const zeroForOne = source.slice(64, 96);
  const amountIn = source.slice(96, 128);
  const reserve0 = source.slice(128, 160);
  const reserve1 = source.slice(160, 192);

  const zeroForOneBigInt = BigInt.fromBytesBigEndian(zeroForOne);
  const amountInBigInt = BigInt.fromBytesBigEndian(amountIn);
  const reserve0BigInt = BigInt.fromBytesBigEndian(reserve0);
  const reserve1BigInt = BigInt.fromBytesBigEndian(reserve1);

  let reserveIn: BigInt;
  let reserveOut: BigInt;
  if (zeroForOneBigInt.equals(0)) {
    // one for zero
    reserveIn = reserve1BigInt;
    reserveOut = reserve0BigInt;
  } else {
    // zero for one
    reserveIn = reserve0BigInt;
    reserveOut = reserve1BigInt;
  }

  const amountInWithFee = amountInBigInt.mul(997);
  const numerator = amountInWithFee.mul(reserveOut);
  const denominator = reserveIn.mul(1000).add(amountInWithFee);
  const amountOutBigInt = numerator.div(denominator);

  const amountOutEncoded = Bytes.fromHexString(
    amountOutBigInt.toHexString()
  ).padStart(32, 0);

  const payload = selector_swapCallback
    .concat(payer)
    .concat(recipient)
    .concat(zeroForOne)
    .concat(amountIn)
    .concat(amountOutEncoded);

  return Bytes.fromByteArray(payload);
}
