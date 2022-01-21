import { expect } from "./chai-setup";
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
} from "hardhat";
import {
  UbeswapWrapper,
  MobiusWrapper,
  IERC20,
  MobiusBaseBurner,
} from "../typechain-types";
import ERC20_ABI from "../build/abi/IERC20.json";
import { AccountClaimType } from "@celo/contractkit/lib/identity/claims/account";
import { BigNumber } from "@ethersproject/bignumber";
import { MoolaWrapper } from "../typechain-types";
import { EtherscanProvider } from "@ethersproject/providers";

const tokens = {
  Celo: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  USDC: "0x2A3684e9Dc20B857375EA04235F2F7edBe818FA7",
  DAI: "0x90Ca507a5D4458a4C6C6249d186b6dCb02a5BCCd",
  cEUR: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  mcUSD: "0x918146359264C492BD6934071c6Bd31C854EDBc3",
  mobi: "0x73a210637f6F6B7005512677Ba6B3C96bb4AA44B",
  pUSDC: "0x1bfc26cE035c368503fAE319Cc2596716428ca44",
  pUSD: "0xEadf4A7168A82D30Ba0619e64d5BCf5B30B45226",
};

// To Do: Redeploy mobius wrapper
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
    MobiusBurner: <MobiusBaseBurner>(
      await ethers.getContract("MobiusBaseBurner")
    ),
    coins,
    signer: (await ethers.getSigners())[0],
  };
};

describe("Mobius Base Burner", function () {
  //   it("Burns USDC", async function () {
  //     const {
  //       MobiusBurner,
  //       coins: { USDC, mobi },
  //       signer,
  //     } = await setup();
  //     const usdcBalanceBefore = await USDC.balanceOf(signer.address);
  //     const mobiBalanceBefore = await mobi.balanceOf(signer.address);
  //     const approval = await USDC.approve(
  //       MobiusBurner.address,
  //       usdcBalanceBefore
  //     );
  //     await approval.wait();
  //     const result = await MobiusBurner.burn(tokens.USDC);
  //     await result.wait();
  //     console.log(`Burn at txn: ${result.hash}`);

  //     const mobiBalanceAfter = await mobi.balanceOf(signer.address);
  //     const usdcBalanceAfter = await USDC.balanceOf(signer.address);

  //     expect(mobiBalanceAfter.toNumber()).greaterThan(
  //       mobiBalanceBefore.toNumber()
  //     );
  //     expect(usdcBalanceAfter.toNumber()).equal(0);
  //   });

  //   it("Burns cUSD", async function () {
  //     const {
  //       MobiusBurner,
  //       coins: { cUSD, mobi },
  //       signer,
  //     } = await setup();
  //     const usdcBalanceBefore = await cUSD.balanceOf(signer.address);
  //     const mobiBalanceBefore = await mobi.balanceOf(signer.address);
  //     const approval = await cUSD.approve(
  //       MobiusBurner.address,
  //       usdcBalanceBefore
  //     );
  //     await approval.wait();
  //     const result = await MobiusBurner.burn(tokens.cUSD);
  //     await result.wait();
  //     console.log(`Burn at txn: ${result.hash}`);

  //     const mobiBalanceAfter = await mobi.balanceOf(signer.address);
  //     const usdcBalanceAfter = await cUSD.balanceOf(signer.address);

  //     expect(mobiBalanceAfter).greaterThan(mobiBalanceBefore);
  //     expect(usdcBalanceAfter.toNumber()).equal(0);
  //   });

  it("Burns DAI", async function () {
    const {
      MobiusBurner,
      coins: { DAI, mobi },
      signer,
    } = await setup();
    const usdcBalanceBefore = await DAI.balanceOf(signer.address);
    const mobiBalanceBefore = await mobi.balanceOf(signer.address);
    const approval = await DAI.approve(MobiusBurner.address, usdcBalanceBefore);
    await approval.wait();
    const result = await MobiusBurner.burn(tokens.DAI);
    await result.wait();
    console.log(`Burn at txn: ${result.hash}`);

    const mobiBalanceAfter = await mobi.balanceOf(signer.address);
    const usdcBalanceAfter = await DAI.balanceOf(signer.address);

    expect(mobiBalanceAfter).greaterThan(mobiBalanceBefore);
    expect(usdcBalanceAfter.toNumber()).equal(0);
  });

  //   it("Burns pUSDC", async function () {
  //     const {
  //       MobiusBurner,
  //       coins: { pUSDC, mobi },
  //       signer,
  //     } = await setup();
  //     const usdcBalanceBefore = await pUSDC.balanceOf(signer.address);
  //     const mobiBalanceBefore = await mobi.balanceOf(signer.address);
  //     const approval = await pUSDC.approve(
  //       MobiusBurner.address,
  //       usdcBalanceBefore
  //     );
  //     await approval.wait();
  //     const result = await MobiusBurner.burn(tokens.pUSDC);
  //     await result.wait();
  //     console.log(`Burn at txn: ${result.hash}`);

  //     const mobiBalanceAfter = await mobi.balanceOf(signer.address);
  //     const usdcBalanceAfter = await pUSDC.balanceOf(signer.address);

  //     expect(mobiBalanceAfter.toNumber()).greaterThan(
  //       mobiBalanceBefore.toNumber()
  //     );
  //     expect(usdcBalanceAfter.toNumber()).equal(0);
  //   });
  it("Burns pUSD", async function () {
    const {
      MobiusBurner,
      coins: { pUSD, mobi },
      signer,
    } = await setup();
    const usdcBalanceBefore = await pUSD.balanceOf(signer.address);
    const mobiBalanceBefore = await mobi.balanceOf(signer.address);
    const approval = await pUSD.approve(
      MobiusBurner.address,
      usdcBalanceBefore
    );
    await approval.wait();
    const result = await MobiusBurner.burn(tokens.pUSD);
    await result.wait();
    console.log(`Burn at txn: ${result.hash}`);

    const mobiBalanceAfter = await mobi.balanceOf(signer.address);
    const usdcBalanceAfter = await pUSD.balanceOf(signer.address);

    expect(mobiBalanceAfter).greaterThan(mobiBalanceBefore);
    expect(usdcBalanceAfter.toNumber()).equal(0);
  });
});
