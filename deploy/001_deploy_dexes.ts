import { DeployFunction } from "hardhat-deploy/types";

const deployMinima: DeployFunction = async function ({
  getNamedAccounts,
  deployments,
  getChainId,
  getUnnamedAccounts,
}) {
  // await hre.run('compile');
  const { deployer } = await getNamedAccounts();
  const { deploy } = deployments;
  const mobiusWrapper = await deploy("MobiusWrapper", {
    from: deployer,
    args: [],
    log: true,
  });
  const ubeswapWrapper = await deploy("UbeswapWrapper", {
    from: deployer,
    args: [],
    log: true,
  });
  const moolaWrapper = await deploy("MoolaWrapper", {
    from: deployer,
    args: [],
    log: true,
  });
};

export default deployMinima;
deployMinima.id = "deploy_dexes";
deployMinima.tags = ["Dexes"];
