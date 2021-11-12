import { expect } from "./chai-setup";
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
} from "hardhat";
import { UbeswapWrapper, MobiusWrapper, IERC20 } from "../typechain";
import ERC20_ABI from "../build/abi/IERC20.json";
import { AccountClaimType } from "@celo/contractkit/lib/identity/claims/account";

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
    UbeswapWrapper: <UbeswapWrapper>await ethers.getContract("UbeswapWrapper"),
    MobiusWrapper: <MobiusWrapper>await ethers.getContract("MobiusWrapper"),
    coins,
    signer: (await ethers.getSigners())[0],
  };
};

describe("UbeswapWrapper", function () {
  it("Queries trade rate of celo -> cUSD", async function () {
    const { UbeswapWrapper } = await setup();
    const exchangeRate = (
      await UbeswapWrapper.getQuote(tokens.Celo, tokens.cUSD, "1000")
    ).toNumber();

    expect(exchangeRate).greaterThan(0);
  });
  it("Performs a trade celo -> cUSD", async function () {
    const {
      UbeswapWrapper,
      coins: { Celo },
      signer,
    } = await setup();
    const approval = await Celo.approve(UbeswapWrapper.address, "10");
    await approval.wait();
    const result = await UbeswapWrapper.swap(
      tokens.Celo,
      tokens.cUSD,
      "10",
      "0"
    );
    await result.wait();
  });
});

describe("MobiusWrapper", function () {
  it("Queries trade rate of cUSD -> USDC", async function () {
    const { MobiusWrapper } = await setup();
    console.log("hello");
    const resp = await MobiusWrapper.getQuote(tokens.USDC, tokens.cUSD, "100");
    console.log(resp);
    const exchangeRate = resp.toNumber();
    console.log(exchangeRate);
    expect(exchangeRate).greaterThan(0);
  });
  // it("Performs a trade celo -> cUSD", async function () {
  //   const { UbeswapWrapper, Celo } = await setup();
  //   const approval = await Celo.approve(UbeswapWrapper.address, "10");
  //   await approval.wait();
  //   console.log(approval);
  //   const result = await UbeswapWrapper.swap(CELO, CUSD, "10", "0");
  //   await result.wait();
  //   console.log(result);
  // });
});
