# zkGraph Template

## Getting Started

To create your zkGraph project based on this template:

Option 1:

Click `Use this template`, and `Creating a new repository`.

Option 2:

Use `gh` cli

```bash
gh repo create zkgraph-new --public --template="https://github.com/hyperoracle/zkgraph.git"
```

### Configuration

After clone your project, you need to create `config.js` file at root folder based on `config-example.js`

```js
// ./config.js
export const config = {
  // Update your Etherum JSON RPC provider URL here.
  // Recommended provider: ANKR.
  JsonRpcProviderUrl: {
    mainnet: "https://{URL}",
    // ...or other networks.
  },
  UserPrivateKey: "0x{PRIVATE_KEY}",
  // ...and other configs.
};
```

Then run:

```bash
npm install
```

### Quick Start

To test the whole flow of the library, run this after you have done the configuration:

```bash
sh test.sh
```

## Commands

The workflow of local zkGraph development must follow: `Develop` (code in /src) -> `Compile` (get compiled wasm image) -> `Execute` (get expected output) -> `Prove` (generate input and pre-test for actual proving) -> `Deploy` (deploy verification contract) -> `Verify` (verify proof on-chain).

To upload and publish your zkGraph, you should `Upload` (upload code to IPFS), and then `Publish` (register zkGraph on onchain zkGraph Registry).

If you encounter any problem, please refer to the [test.sh](./test.sh) for the example usage of the commands.

### Compile for Local Image

```bash
npm run compile-local
```

### Execute Local Image

```bash
npm run exec-local -- <block_id (eg. 69 / 0x45)>
```

### Set Up Local Image

```bash
npm run setup-local
```

### Prove Local Image (input generation / pre-test / prove)

```bash
npm run prove-local -- --inputgen <block_id (eg. 69 / 0x45)> <expected_state>
npm run prove-local -- --pretest <block_id (eg. 69 / 0x45)> <expected_state>
npm run prove-local -- --prove <block_id (eg. 69 / 0x45)> <expected_state>
```

### Deploy Verification Contract for Local Image

```bash
npm run deploy-local -- <network_name (goerli / sepolia)>
```

- `network_name`: load `dataDestinations.network` from `zkgraph.yaml` if not passed from command.

### Upload Local zkGraph (Code and Local Image)

```bash
npm run upload-local
```

### Compile for Full Image(Link Compiled with Compiler Server)

```bash
npm run compile
```

### Execute Full Image

```bash
npm run exec -- <block_id (eg. 69 / 0x45)>
```

### Set Up Full Image

```bash
npm run setup
```

### Prove Full Image

```bash
npm run prove -- --inputgen <block_id (eg. 69 / 0x45)> <expected_state>
npm run prove -- --pretest <block_id (eg. 69 / 0x45)> <expected_state>
npm run prove -- --prove <block_id (eg. 69 / 0x45)> <expected_state>
```

### Deploy Verification Contract for Full Image

```bash
npm run deploy -- [network_name (sepolia / goerli)]
```

- `network_name`: load `dataDestinations.network` from `zkgraph.yaml` if not passed from command.

### Upload zkGraph (Code and Full Image)

```bash
npm run upload
```

### Verify Proof Onchain

```bash
npm run verify -- <prove_task_id>
```

### Publish and Register zkGraph Onchain

```bash
npm run publish -- <verifier_contract_address> <ipfs_hash> <bounty_reward_per_trigger>
```

See also: [Verifier Contract Interface](https://github.com/DelphinusLab/halo2aggregator-s/blob/main/sol/contracts/AggregatorVerifier.sol#L40).

## Develop

### `config.js`

The configuration (such as blockchain json rpc provider url) for the local development API.

### `src/zkgraph.yaml`

The configuration for the zkGraph.

It specifies information including:

- data source
- target blockchain network
- target smart contract address
- target event
- event handler

### `src/mapping.ts`

The logic of the event handler in AssemblyScript.

It specifies how to handle the event data and generate the output state.

```typescript
export function handleEvents(events: Event[]): Bytes {
  let state = new Bytes(0);
  if (events.length > 0) {
    state = events[0].address;
  }
  require(state.length == 20);
  return state;
}
```

## Resources

More info and API reference can be found in [Hyper Oracle zkGraph docs](https://docs.hyperoracle.io/zkgraph-standards/zkgraph).

## zkGraph Dev Tips

### Development

1. Provable program needs to be compilable and runnable in normal execution runtime first.
2. To running on zkwasm, do not use io syscalls like `console` etc.
3. You may need to use `BigEndian` version functions for Ethereum data structures.
4. For operators of `BigInt` (eg. `+`, `-`, `*`, `/`), use syntax like `a.plus(b)` instead of `a + b` (this still works, but triggers compiler warning).
5. `require` is a cool [Solidity-like](https://docs.soliditylang.org/en/v0.8.20/control-structures.html#error-handling-assert-require-revert-and-exceptions) language feature zkWasm provides, but will trigger warning when using in zkGraph's `mapping.ts`. To ignore the error: when importing, add `// @ts-ignore` after the import line; when using, write something like `require(true ? 1 : 0)` to convert the boolean to number for the ts compiler.

### Optimization

1. Look at (approximate) WASM cost for each operation! Complexer logic (eg. anything with lots of `if` or `string`) usally means more instructions, which means longer proof generation time.
2. Don't use template literals (`${}`), for example when throwing errors, because it will be compiled to too many WASM instructions (~1000 diff).
3. Try not to use keywords that may introduce extra global init code e.g. `new`, `static` etc. (`changetype` is fine).

## Lib Dev Tips

1. Don't use `I8.parseInt` because it will be compiled to `i32.extend8_s (aka. Unknown opcode 192 (0xC0) in WASM)`.
2. Try not to use template literals (`${}`), for example when throwing errors, because it will be compiled to too many WASM instructions (~1000 diff).
3. Try not to use `FC extensions` opcodes (`<u32>parseInt(...)`, `f64`, or `Math`), because it will be compiled to `Unknown opcode 252 (0xFC) in WASM`, and generates too many instructions.

References: [WebAssembly Opcodes](https://pengowray.github.io/wasm-ops/).

## Structure

This repo has the following folders relevant to zkGraph development:

- `api`: APIs (the scripts in `package.json`) for compile, execute, prove, and deploy zkGraph for testing locally, and fully with zkWASM node.
- `example`: Example zkGraphs.
- `lib`: AssemblyScript library for zkGraph development, with data structure such as Bytes, ByteArray and BigInt.
- `src`: Where your actual zkGraph should be in. Contains `mapping.ts` and `zkgraph.yaml`.

## Thanks

- zkWasm Project: [DelphinusLab/zkWasm](https://github.com/DelphinusLab/zkWasm)
- The Graph AssemblyScript API Specification: [graphprotocol/graph-tooling](https://github.com/graphprotocol/graph-tooling)
- Polywrap BigInt Implementation: [polywrap/as-bigint](https://github.com/polywrap/as-bigint)
- Near Base58 Implementation: [near/as-base58](https://github.com/near/as-base58)
