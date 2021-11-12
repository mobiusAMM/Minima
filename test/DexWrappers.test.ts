import { expect } from "./chai-setup";
import {
  ethers,
  deployments,
  getUnnamedAccounts,
  getNamedAccounts,
} from "hardhat";
import { UbeswapWrapper, MobiusWrapper, IERC20 } from "../typechain";
import ERC20_ABI from "../build/abi/IERC20.json";

const CELO = "0x471EcE3750Da237f93B8E339c536989b8978a438";
const CUSD = "0x765DE816845861e75A25fCA122bb6898B8B1282a";

const setup = async () => ({
  UbeswapWrapper: <UbeswapWrapper>await ethers.getContract("UbeswapWrapper"),
  MobiusWrapper: <MobiusWrapper>await ethers.getContract("MobiusWrapper"),
  Celo: <IERC20>await ethers.getContractAt(ERC20_ABI, CELO),
  signer: (await ethers.getSigners())[0],
});

describe("UbeswapWrapper", function () {
  it("Queries trade rate of celo -> cUSD", async function () {
    const { UbeswapWrapper } = await setup();
    const exchangeRate = (
      await UbeswapWrapper.getQuote(CELO, CUSD, "1000")
    ).toNumber();

    expect(exchangeRate).greaterThan(0);
  });
  it("Performs a trade celo -> cUSD", async function () {
    const { UbeswapWrapper, Celo, signer } = await setup();
    const expectedOut = await UbeswapWrapper.getQuote(CELO, CUSD, "10");
    const approval = await Celo.approve(UbeswapWrapper.address, "10");
    await approval.wait();
    console.log(approval);
    const result = await UbeswapWrapper.swap(CELO, CUSD, "10", "0");
    await result.wait();
    console.log(result);
  });
});
