import { ethers, network } from "hardhat";
import {
  developmentChains,
  PROPOSAL_FILE,
  VOTE_REASON,
  VOTING_PERIOD,
} from "../hardhat-helper-config";
import * as fs from "fs";
import { moveBlocks } from "../utils/timetravel";

const index = 0;
const VOTE_NO = 0;
const VOTE_YES = 1;
const VOTE_ABSTAIN = 2;

export async function vote() {
  const proposals = JSON.parse(fs.readFileSync(PROPOSAL_FILE, "utf8"));
  const proposalId = proposals[network.config.chainId!][0];

  const governor = await ethers.getContract("GovernorContract");
  const voteTx = await governor.castVoteWithReason(
    proposalId,
    VOTE_YES,
    VOTE_REASON
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

vote()
  .then(() => process.exit(0))
  .catch((err) => {
    console.log(err);
    process.exit(1);
  });
