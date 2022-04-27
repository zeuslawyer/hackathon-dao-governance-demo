import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MIN_DELAY } from "../hardhat-helper-config";

const deployTimeLock: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  const PROPOSERS = [] as number[];
  const EXECUTORS = [] as number[];

  log("Deploying the TimeLock contract...");
  const timeLock = await deploy("TimeLock", {
    from: deployer,
    args: [MIN_DELAY, PROPOSERS, EXECUTORS],
    log: true,
    waitConfirmations: 1,
  });

  log(`Deployed 'TimeLock' at ${timeLock.address}`);
};

export default deployTimeLock;
