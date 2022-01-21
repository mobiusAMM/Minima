import { expect } from "./chai-setup";
import { ethers, deployments } from "hardhat";
import { IERC20, Minima } from "../typechain-types";
import ERC20_ABI from "../build/abi/IERC20.json";

const tokens: { [name: string]: string } = {
  Celo: "0x471EcE3750Da237f93B8E339c536989b8978a438",
  cUSD: "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  USDC: "0x2A3684e9Dc20B857375EA04235F2F7edBe818FA7",
  cEUR: "0xD8763CBa276a3738E6DE85b4b3bF5FDed6D6cA73",
  mcUSD: "0x918146359264C492BD6934071c6Bd31C854EDBc3",
  mobi: "0x73a210637f6F6B7005512677Ba6B3C96bb4AA44B",
  mcEUR: "0xE273Ad7ee11dCfAA87383aD5977EE1504aC07568",
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
    UbeswapDeployment: await deployments.get("UbeswapWrapper"),
    MobiusDeployment: await deployments.get("MobiusWrapper"),
  };
};

describe("Trade graph generation", function () {
  // it("Returns ubeswap wrapper as the best exchange for Celo -> mcUSD", async function () {
  //   const { Minima, UbeswapDeployment } = await setup();
  //   const result = await Minima.getBestExchange(tokens.Celo, tokens.mcUSD, "1");
  //   expect(result[1]).to.be.equal(UbeswapDeployment.address);
  // });
  // it("Returns mobius wrapper as the best exchange for USDC -> cUSD", async function () {
  //   const { Minima, MobiusDeployment } = await setup();
  //   const result = await Minima.getBestExchange(tokens.USDC, tokens.cUSD, "1");
  //   expect(result[1]).to.be.equal(MobiusDeployment.address);
  // });
  // it("Returns 0x0000 as the best exchange for CELO -> cUSD", async function () {
  //   const { Minima, UbeswapDeployment } = await setup();
  //   const result = await Minima.getBestExchange(tokens.Celo, tokens.cUSD, "1");
  //   expect(result[1]).to.be.equal("0x0000000000000000000000000000000000000000");
  // });
  // it("Fills the trade graph for Celo", async () => {
  //   const { Minima, MobiusDeployment, UbeswapDeployment } = await setup();
  //   const result = await Minima.fillBoard("0");
  //   console.log(result);
  // });
  // for (let i = 0; i < Object.values(tokens).length; i++) {
  //   for (let j = 0; j < Object.values(tokens).length; j++) {
  //     const tokenIn = Object.keys(tokens)[i];
  //     const tokenOut = Object.keys(tokens)[j];
  //     it(`Queries exchange rate for ${tokenIn} -> ${tokenOut}`, async () => {
  //       const { Minima } = await setup();
  //       await Minima.getBestExchange(
  //         tokens[tokenIn],
  //         tokens[tokenOut],
  //         "1000000000"
  //       );
  //     });
  //   }
  // }
  // it("Potentially works", async () => {
  //   const { Minima, MobiusDeployment, UbeswapDeployment } = await setup();
  //   const result = await Minima.getExpectedOutFromPath(
  //     [
  //       "0x471EcE3750Da237f93B8E339c536989b8978a438",
  //       "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  //       "0x0000000000000000000000000000000000000000",
  //     ],
  //     [
  //       "0x074a4aB9F49EE9718d26E54d78f6C81b1EdE3654",
  //       "0x0000000000000000000000000000000000000000",
  //     ],
  //     "1000000000000000"
  //   );
  //   console.log("Expected out", result.toString());
  // });
  // it("Gets the best route for mcUSD -> Celo", async () => {
  //   const { Minima, MobiusDeployment, UbeswapDeployment } = await setup();
  //   const result = await Minima.getExpectedOut(
  //     tokens.mcUSD,
  //     tokens.Celo,
  //     "100"
  //   );
  //   console.log(result);
  // });
  // it("Gets the best route for mcUSD -> Mobi", async () => {
  //   const { Minima, MobiusDeployment, UbeswapDeployment } = await setup();
  //   const result = await Minima.getExpectedOut(
  //     tokens.mcUSD,
  //     tokens.mobi,
  //     "100"
  //   );
  //   console.log(result);
  // });
  // it("Correclty trades given a trade route", async () => {
  //   const {
  //     Minima,
  //     coins: { Celo },
  //   } = await setup();
  //   const approval = await Celo.approve(Minima.address, "100");
  //   const result = await Minima.swap(
  //     [
  //       "0x471EcE3750Da237f93B8E339c536989b8978a438",
  //       "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  //       "0x0000000000000000000000000000000000000000",
  //     ],
  //     [
  //       "0x074a4aB9F49EE9718d26E54d78f6C81b1EdE3654",
  //       "0x0000000000000000000000000000000000000000",
  //     ],
  //     "100",
  //     "0",
  //     "0x4ea77424Da100ac856ece3DDfAbd8B528570Ca0d"
  //   );
  //   console.log("Raw", result);
  // });
  // it("Correclty trades given a trade route", async () => {
  //   const {
  //     Minima,
  //     coins: { Celo },
  //   } = await setup();
  //   const approval = await Celo.approve(Minima.address, "100");
  //   const result = await Minima.swap(
  //     [
  //       "0x471EcE3750Da237f93B8E339c536989b8978a438",
  //       "0x765DE816845861e75A25fCA122bb6898B8B1282a",
  //     ],
  //     ["0x074a4aB9F49EE9718d26E54d78f6C81b1EdE3654"],
  //     "100",
  //     "0",
  //     "0x4ea77424Da100ac856ece3DDfAbd8B528570Ca0d"
  //   );
  //   console.log("Patched", result);
  // });
  // it("Trades Celo -> mobi", async () => {
  //   const {
  //     Minima,
  //     coins: { Celo },
  //   } = await setup();
  //   const approval = await Celo.approve(Minima.address, "100");
  //   await approval.wait();
  //   const result = await Minima.swapOnChain(
  //     tokens.Celo,
  //     tokens.mobi,
  //     "100",
  //     "0",
  //     "0x4ea77424Da100ac856ece3DDfAbd8B528570Ca0d"
  //   );
  //   console.log(result);
  // });
  // it("Trades mcUSD -> mobi", async () => {
  //   const {
  //     Minima,
  //     coins: { mcUSD },
  //   } = await setup();
  //   const approval = await mcUSD.approve(Minima.address, "100");
  //   await approval.wait();
  //   const result = await Minima.swapOnChain(
  //     tokens.mcUSD,
  //     tokens.mobi,
  //     "100",
  //     "0",
  //     "0x4ea77424Da100ac856ece3DDfAbd8B528570Ca0d"
  //   );
  //   console.log(result);
  // });
  // it("Trades cUSD -> mobi", async () => {
  //   const {
  //     Minima,
  //     coins: { cUSD },
  //   } = await setup();
  //   const approval = await cUSD.approve(Minima.address, "100");
  //   await approval.wait();
  //   const result = await Minima.swapOnChain(
  //     tokens.cUSD,
  //     tokens.mobi,
  //     "100",
  //     "0",
  //     "0x4ea77424Da100ac856ece3DDfAbd8B528570Ca0d"
  //   );
  //   console.log(result);
  // });
  // it("Trades cEUR -> mobi", async () => {
  //   const {
  //     Minima,
  //     coins: { cEUR },
  //   } = await setup();
  //   const approval = await cEUR.approve(Minima.address, "100");
  //   await approval.wait();
  //   const result = await Minima.swapOnChain(
  //     tokens.cEUR,
  //     tokens.mobi,
  //     "100",
  //     "0",
  //     "0x4ea77424Da100ac856ece3DDfAbd8B528570Ca0d"
  //   );
  //   console.log(result);
  // });
  // it("Traces the board to find the correct path", async () => {
  //   const { Minima, MobiusDeployment, UbeswapDeployment } = await setup();
  //   const result = await Minima.getPathFromBoard(
  //     "0",
  //     "1",
  //     [
  //       [
  //         "0x0000000000000000000000000000000000000000",
  //         "0x074a4aB9F49EE9718d26E54d78f6C81b1EdE3654",
  //         "0x074a4aB9F49EE9718d26E54d78f6C81b1EdE3654",
  //       ],
  //       [
  //         "0x074a4aB9F49EE9718d26E54d78f6C81b1EdE3654",
  //         "0x0000000000000000000000000000000000000000",
  //         "0xF6c73f64C526D7F9668b39DB203D23F062E8f006",
  //       ],
  //       [
  //         "0x074a4aB9F49EE9718d26E54d78f6C81b1EdE3654",
  //         "0xF6c73f64C526D7F9668b39DB203D23F062E8f006",
  //         "0x0000000000000000000000000000000000000000",
  //       ],
  //     ],
  //     ["0", "0", "0"]
  //   );
  //   console.log(result);
  // });
});
