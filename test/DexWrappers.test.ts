// import { expect } from "./chai-setup";
// import {
//   ethers,
//   deployments,
//   getUnnamedAccounts,
//   getNamedAccounts,
// } from "hardhat";
// import { UbeswapWrapper, MobiusWrapper, IERC20 } from "../typechain";
// import ERC20_ABI from "../build/abi/IERC20.json";
// import { AccountClaimType } from "@celo/contractkit/lib/identity/claims/account";
// import { BigNumber } from "@ethersproject/bignumber";

// const tokens = {
//   Celo: "0x471EcE3750Da237f93B8E339c536989b8978a438",
//   cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
//   USDC: "0x2A3684e9Dc20B857375EA04235F2F7edBe818FA7",
//   cEUR: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
//   mcUSD: "0x918146359264C492BD6934071c6Bd31C854EDBc3",
//   mobi: "0x73a210637f6F6B7005512677Ba6B3C96bb4AA44B",
// };

// const CUSD_USDC_SWAP = "0xA5037661989789d0310aC2B796fa78F1B01F195D";
// // To Do: Redeploy mobius wrapper
// const setup = async () => {
//   const coins: { [name: string]: IERC20 } = {};
//   const coinList = await Promise.all(
//     Object.entries(tokens).map(
//       async ([name, address]) =>
//         <IERC20>await ethers.getContractAt(ERC20_ABI, address)
//     )
//   );
//   coinList.forEach((coin, i) => (coins[Object.keys(tokens)[i]] = coin));
//   return {
//     UbeswapWrapper: <UbeswapWrapper>await ethers.getContract("UbeswapWrapper"),
//     MobiusWrapper: <MobiusWrapper>await ethers.getContract("MobiusWrapper"),
//     coins,
//     signer: (await ethers.getSigners())[0],
//   };
// };

// describe("UbeswapWrapper", function () {
//   it("Queries trade rate of celo -> mcUSD", async function () {
//     const { UbeswapWrapper } = await setup();
//     const exchangeRate = (
//       await UbeswapWrapper.getQuote(tokens.Celo, tokens.mcUSD, "1000")
//     ).toNumber();

//     expect(exchangeRate).greaterThan(0);
//   });
//   it("Performs a trade celo -> mcUSD", async function () {
//     const {
//       UbeswapWrapper,
//       coins: { Celo },
//       signer,
//     } = await setup();
//     const approval = await Celo.approve(UbeswapWrapper.address, "10");
//     await approval.wait();
//     const result = await UbeswapWrapper.swap(
//       tokens.Celo,
//       tokens.mcUSD,
//       "10",
//       "0"
//     );
//   });
// });

// describe("MobiusWrapper", function () {
//   it("Queries trade rate of cUSD -> USDC", async function () {
//     const { MobiusWrapper } = await setup();
//     const resp = await MobiusWrapper.getQuote(tokens.USDC, tokens.cUSD, "1");
//     const exchangeRate = resp.toNumber();
//     expect(exchangeRate).greaterThan(0);
//   });
//   it("Returns the right indices for cUSD / USDC and Swap address", async function () {
//     const { MobiusWrapper } = await setup();
//     const pairInfo = await MobiusWrapper.getTradeIndices(
//       tokens.cUSD,
//       tokens.USDC
//     );
//     const { tokenIndexFrom, tokenIndexTo, swapAddress } = pairInfo;
//     expect(tokenIndexFrom).to.be.equal(BigNumber.from("0"));
//     expect(tokenIndexTo).to.be.equal(BigNumber.from("1"));
//     expect(swapAddress).to.be.equal(CUSD_USDC_SWAP);
//   });
//   it("Returns the right indices for USDC / cUSD and Swap address", async function () {
//     const { MobiusWrapper } = await setup();
//     const pairInfo = await MobiusWrapper.getTradeIndices(
//       tokens.USDC,
//       tokens.cUSD
//     );
//     const { tokenIndexFrom, tokenIndexTo, swapAddress } = pairInfo;
//     expect(tokenIndexFrom).to.be.equal(BigNumber.from("1"));
//     expect(tokenIndexTo).to.be.equal(BigNumber.from("0"));
//     expect(swapAddress).to.be.equal(CUSD_USDC_SWAP);
//   });

//   it("Performs a trade USDC -> cUSD", async function () {
//     const {
//       UbeswapWrapper,
//       coins: { USDC },
//     } = await setup();
//     await USDC.approve(UbeswapWrapper.address, "1");
//     const result = await UbeswapWrapper.swap(
//       tokens.USDC,
//       tokens.cUSD,
//       "1",
//       "0"
//     );
//     console.log(result);
//   });
// });
