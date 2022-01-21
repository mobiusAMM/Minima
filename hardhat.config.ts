import "@typechain/hardhat";
import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-solhint";
import "@nomiclabs/hardhat-waffle";
import "hardhat-deploy";
import { fornoURLs, ICeloNetwork } from "@ubeswap/hardhat-celo";
import "dotenv/config";
import "hardhat-abi-exporter";
import { removeConsoleLog } from "hardhat-preprocessor";
import "hardhat-spdx-license-identifier";
import { HardhatUserConfig, task } from "hardhat/config";
import { HDAccountsUserConfig } from "hardhat/types";
import "solidity-coverage";
import {
  Minima,
  MobiusWrapper,
  MoolaWrapper,
  UbeswapWrapper,
} from "./typechain-types";
import { SWAP_ADDRESSES } from "./mobiusSwapAddresses";

const parseTokens = (str: string) => str.split(",").map((s) => s.trim());
const tokens: { [name: string]: string } = {
  Celo: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  USDC: "0x2A3684e9Dc20B857375EA04235F2F7edBe818FA7",
  cEUR: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  mcUSD: "0x918146359264C492BD6934071c6Bd31C854EDBc3",
  mobi: "0x73a210637f6F6B7005512677Ba6B3C96bb4AA44B",
  mcEUR: "0xE273Ad7ee11dCfAA87383aD5977EE1504aC07568",
};

task(
  "init-wrappers",
  "Initiates minima with set tokens",
  async (args, hre, runSuper) => {
    const ubeswap = <UbeswapWrapper>(
      await hre.ethers.getContract("UbeswapWrapper")
    );
    const moolaWrapper = <MoolaWrapper>(
      await hre.ethers.getContract("MoolaWrapper")
    );
    const mobiusWrapper = <MobiusWrapper>(
      await hre.ethers.getContract("MobiusWrapper")
    );
    await ubeswap.addTokenPair(tokens.Celo, tokens.mcUSD);
    await ubeswap.addTokenPair(tokens.Celo, tokens.mobi);
    await moolaWrapper.addAsset(tokens.cUSD, tokens.mcUSD);

    for (let i = 0; i < SWAP_ADDRESSES.length; i++) {
      const txn = await mobiusWrapper.addSwapContract(SWAP_ADDRESSES[i], 2);
      console.log(txn.hash);
    }
  }
);

task("init");

task(
  "addMobiusSwaps",
  "Adds Mobius Swap contracts to the wrapper",
  async (taskArguments: { pools: string }, hre, runSuper) => {
    const { pools } = taskArguments;
    const addresses = pools.split(",").map((s) => s.trim());
    const mobiusWrapper = <MobiusWrapper>(
      await hre.ethers.getContract("MobiusWrapper")
    );
    const txns = await Promise.all(
      addresses.map(
        async (swapAddress) =>
          await mobiusWrapper.addSwapContract(swapAddress, 2)
      )
    );
    console.log(txns);
  }
).addParam("pools", "The addresses of mobius pools, comma separated");

task(
  "addTokenPairs",
  "Adds token pairs to the sushiv2 wrappers",
  async (taskArguments: { pairs: string }, hre, runSuper) => {
    const { pairs } = taskArguments;
    const addresses = pairs.split("/").map((s) => s.trim().split(","));
    const ubeswap = <UbeswapWrapper>(
      await hre.ethers.getContract("UbeswapWrapper")
    );
    for (let i = 0; i < addresses.length; i++) {
      const addressList = addresses[i];
      for (let j = 0; j < addressList.length; j++) {
        for (let k = j + 1; k < addressList.length; k++) {
          const txn = await ubeswap.addTokenPair(
            addressList[j],
            addressList[k]
          );
          console.log(txn);
        }
      }
    }
  }
).addParam("pairs", "The addresses of mobius pools, comma separated");

task(
  "add-dex",
  "Adds DEXes to minima",
  async (
    { dexAddresses, dexNames }: { dexAddresses: string; dexNames: string },
    hre,
    runSuper
  ) => {
    const addresses = dexAddresses.split(",").map((s) => s.trim());
    const names = dexNames.split(",").map((s) => s.trim());
    const minima = <Minima>await hre.ethers.getContract("Minima");
    const txns = await Promise.all(
      addresses.map(
        async (swapAddress, i) => await minima.addDex(swapAddress, names[i])
      )
    );
    console.log(txns);
  }
)
  .addParam("dexAddresses", "The addresses of dexes, comma separated")
  .addParam("dexNames", "The names of dexes, comma separated");

task(
  "add-tokens",
  "Adds DEXes to minima",
  async ({ tokens }: { tokens: string }, hre, runSuper) => {
    const addresses = tokens.split(",").map((s) => s.trim());
    const minima = <Minima>await hre.ethers.getContract("Minima");
    const txns = await Promise.all(
      addresses.map(
        async (swapAddress, i) => await minima.addToken(swapAddress)
      )
    );
    console.log(txns);
  }
).addParam("tokens", "The addresses of tokens, comma separated");

task(
  "add-moola-assets",
  "Adds assets to the moola wrapper",
  async (
    { underlying, receipt }: { underlying: string; receipt: string },
    hre,
    runSuper
  ) => {
    const underlyingTokens = parseTokens(underlying);
    const receiptTokens = parseTokens(receipt);

    const moolaWrapper = <MoolaWrapper>(
      await hre.ethers.getContract("MoolaWrapper")
    );

    for (
      let i = 0;
      i < Math.min(underlyingTokens.length, receiptTokens.length);
      i++
    ) {
      const txn = await moolaWrapper.addAsset(
        underlyingTokens[i],
        receiptTokens[i]
      );
      await txn.wait(1);
      console.log(txn);
    }
  }
)
  .addParam("underlying", "The underlying token addresses")
  .addParam(
    "receipt",
    "The receipt tokens corresponding to the underlying of same index"
  );

// task("test", "Test the contracts", async () => {});
const accounts: HDAccountsUserConfig = {
  mnemonic:
    process.env.MNEMONIC ||
    "test test test test test test test test test test test junk",
  path: "m/44'/52752'/0'/0/",
};

// const accounts = [`0x${process.env.PRIVATE_KEY_DEV}`];

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
export default {
  abiExporter: {
    path: "./build/abi",
    flat: true,
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
  networks: {
    mainnet: {
      url: fornoURLs[ICeloNetwork.MAINNET],
      accounts,
      chainId: ICeloNetwork.MAINNET,
      live: true,
      gasPrice: 0.5 * 10 ** 9,
      gas: 8000000,
    },
    alfajores: {
      url: fornoURLs[ICeloNetwork.ALFAJORES],
      accounts,
      chainId: ICeloNetwork.ALFAJORES,
      live: true,
      gasPrice: 0.5 * 10 ** 9,
      gas: 8000000,
    },
    hardhat: {
      chainId: 31337,
      accounts,
    },
  },
  paths: {
    deploy: "deploy",
    sources: "./contracts",
    tests: "./test",
    cache: "./build/cache",
    artifacts: "./build/artifacts",
    imports: "imports",
    deployments: "deployments",
  },
  preprocess: {
    eachLine: removeConsoleLog(
      (bre) =>
        bre.network.name !== "hardhat" && bre.network.name !== "localhost"
    ),
  },
  solidity: {
    version: "0.8.0",
    settings: {
      optimizer: {
        enabled: true,
        runs: 5000,
      },
    },
  },
  spdxLicenseIdentifier: {
    overwrite: false,
    runOnCompile: true,
  },
  tenderly: {
    project: process.env.TENDERLY_PROJECT,
    username: process.env.TENDERLY_USERNAME,
  },
  watcher: {
    compile: {
      tasks: ["compile"],
      files: ["./contracts"],
      verbose: true,
    },
  },
  namedAccounts: {
    deployer: 0,
  },
} as HardhatUserConfig;
