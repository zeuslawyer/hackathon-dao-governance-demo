import { ethers, network } from "hardhat";
import {
  developmentChains,
  VOTING_DELAY,
  proposalsFile,
} from "../hardhat-helper-config";
import * as fs from "fs";

export async function makeProposal(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const governor = await ethers.getContract("GovernorContract");
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  console.log("The Encoded Function call? \n", encodedFunctionCall);

  console.log(`
 proposal: Proposing to call '${functionToCall}' with args '${args}’  
 proposal description: ‘${proposalDescription},'
 `);

  const proposeTx = await governor.propose(
    [box.address],
    [0],
    [encodedFunctionCall],
    proposalDescription
  );

  const proposeReceipt = await proposeTx.wait(1);

  // Speed up time so we can vote!
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_DELAY + 1);
  }

  const proposalId = proposeReceipt.events[0].args.proposalId;

  // save the proposalId
  let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  proposals[network.config.chainId!.toString()].push(proposalId.toString());
  fs.writeFileSync(proposalsFile, JSON.stringify(proposals));

  // fs.writeFileSync(
  //   proposalsFile,
  //   JSON.stringify({
  //     [network.config.chainId!.toString()]: [proposalId.toString()],
  //   })
  // );

  const proposalState = await governor.state(proposalId)
   // The state of the proposal. 1 is not passed. 0 is passed.
   console.log(`Current Proposal State: ${proposalState}`)
}

makeProposal([100], "store", "Proposal #1 - update  value of box to 100")
  .then(() => process.exit(0))
  .catch(err => {
    console.log(err);
    process.exit(1);
  });

// HELPER FUNC
const moveBlocks = async (amount: Number) => {
  console.log("Moving blocks...");
  for (let i = 0; i < amount; i++) {
    await network.provider.request({
      method: "evm_mine",
      params: [],
    });
  }
  console.log(`Moved ${amount} blocks`);
};
