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
  //   const OpenMath = await ethers.getContractFactory("OpenMath");
  //   const openMath = await OpenMath.deploy();
  //   await openMath.deployed();

  //   const Minima = await ethers.getContractFactory("Minima", {
  //     libraries: {
  //       OpenMath: openMath.address,
  //     },
  //   });
  //   const minima = await Minima.deploy();

  //   await minima.deployed();

  //   console.log("Minima deployed to:", minima.address);
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
