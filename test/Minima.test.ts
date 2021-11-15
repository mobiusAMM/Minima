import { expect } from "./chai-setup";
import { ethers, deployments } from "hardhat";
import { IERC20, Minima } from "../typechain";
import ERC20_ABI from "../build/abi/IERC20.json";
import { BigNumber } from "@ethersproject/bignumber";

const tokens = {
  Celo: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  USDC: "0x2A3684e9Dc20B857375EA04235F2F7edBe818FA7",
};

const setup = async () => {
  const coins: { [name: string]: IERC20 } = {};
  const coinList = await Promise.all(
    Object.entries(tokens).map(
      async ([name, address]) =>
        <IERC20>await ethers.getContractAt(ERC20_ABI, address)
    )
  );
  coinList.forEach((coin, i) => (coins[Object.keys(tokens)[i]] = coin));
  return {
    Minima: <Minima>await ethers.getContract("Minima"),
    coins,
    signer: (await ethers.getSigners())[0],
  };
};

describe("Trade graph generation", function () {
  it("Returns ubeswap wrapper as the best exchange for USDC -> Celo", async function () {
    const { Minima } = await setup();
    const result = await Minima.getBestExchange(tokens.USDC, tokens.Celo, "1");
    console.log(result);
  });
});
