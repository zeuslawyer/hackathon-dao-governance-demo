import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

const deployGovernanceToken: DeployFunction = async (
  hre: HardhatRuntimeEnvironment
) => {
  console.log(" 🚀  EUREKA!!");
  const { getNamedAccounts, deployments, network } = hre;
  const { deploy, log } = deployments;
  const { deployer } = await getNamedAccounts();

  log("Deploying Governance Token....");
  const governanceToken = await deploy("GovernanceToken", {
    from: deployer,
    log: true,
    args: [],
    waitConfirmations: 1, // For non-dev netwworks so we can verify
  });

  log(`Deployed 'GovernanceToken' at ${governanceToken.address}`);

  // Delegate votes to deployer.
  await delegate(governanceToken.address, deployer);
  log(`Delegated votes to ${deployer} `);
};

const delegate = async (
  governanceTokenAddress: string,
  delegatedAccount: string
) => {
  const governanceToken = await ethers.getContractAt(
    "GovernanceToken",
    governanceTokenAddress
  );
  const txResponse = await governanceToken.delegate(delegatedAccount);
  await txResponse.wait(1);
  console.log(
    `Checkpoints: ${await governanceToken.numCheckpoints(delegatedAccount)}`
  );
};

export default deployGovernanceToken;
