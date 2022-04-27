import { ethers, network } from "hardhat";
import {
  developmentChains,
  proposalsFile,
  VOTING_PERIOD,
} from "../hardhat-helper-config";
import * as fs from "fs";

const index = 0;
const VOTE_NO = 0;
const VOTE_YES = 1;
const VOTE_ABSTAIN = 2;

export async function vote(proposalIndex: number) {
  const proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
  const proposalId = proposals[network.config.chainId!][proposalIndex];

  const governor = await ethers.getContract("GovernorContract");
  const voteTx = await governor.castVoteWithReason(
    proposalId,
    VOTE_YES,
    "Cause we like 100"
  );
  voteTx.wait(1);

  let proposalState = await governor.state(proposalId);
  console.log(`Proposal State before voting period is over: ${proposalState}`);

  // Move time forward past the VOTING_PERIOD
  if (developmentChains.includes(network.name)) {
    await moveBlocks(VOTING_PERIOD + 1);
  }

  proposalState = await governor.state(proposalId);
  console.log(`Proposal State after voting period is over: ${proposalState}`);
  console.log("Voting complete.");
}

vote(index)
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
