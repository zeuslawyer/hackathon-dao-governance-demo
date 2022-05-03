import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployBox: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deployer } = await getNamedAccounts();
  const { deploy, log } = deployments;

  log("Deploying 'Box' Contract....");

  const box = await deploy("Box", {
    from: deployer,
    args: [],
    log: true,
    waitConfirmations: 1,
  });

  log(`05-Deployed 'Box' at ${box.address}`);

  const boxContract = await ethers.getContractAt("Box", box.address);
  const timelockContract = await ethers.getContract("TimeLock", deployer);

  const transferTx = await boxContract.transferOwnership(
    timelockContract.address
  );
  await transferTx.wait(1);
  log("Ownership of 'Box' transferred to 'TimeLock'...");
};

export default deployBox;
deployBox.tags = ["all", "box"];
