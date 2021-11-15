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
  const openMath = await deploy("OpenMath", {
    from: deployer,
  });
  await deploy("Minima", {
    from: deployer,
    args: [],
    log: true,
    libraries: {
      OpenMath: openMath.address,
    },
  });
};

export default deployMinima;
deployMinima.id = "deploy_minima";
deployMinima.tags = ["Minima"];
