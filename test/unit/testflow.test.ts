import {
  GovernorContract,
  GovernanceToken,
  TimeLock,
  Box,
} from "../../typechain-types";
import { deployments, ethers } from "hardhat";
import { assert, expect } from "chai";
import {
  FUNC,
  DESCRIPTION,
  FUNC_ARGS,
  VOTING_DELAY,
  VOTING_PERIOD,
  MIN_DELAY,
} from "../../hardhat-helper-config";
import { moveBlocks, moveTime } from "../../utils/timetravel";

describe("Governor Flow", async () => {
  let governor: GovernorContract;
  let governanceToken: GovernanceToken;
  let timeLock: TimeLock;
  let box: Box;
  const voteWay = 1; // for
  const reason = "I lika do da cha cha";
  beforeEach(async () => {
    await deployments.fixture(["all"]);
    governor = await ethers.getContract("GovernorContract");
    timeLock = await ethers.getContract("TimeLock");
    governanceToken = await ethers.getContract("GovernanceToken");
    box = await ethers.getContract("Box");
  });

  it("can only be changed through governance", async () => {
    await expect(box.store(55)).to.be.revertedWith(
      "Ownable: caller is not the owner"
    );
  });

  it("proposes, votes, waits, queues, and then executes", async () => {
    // propose
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, [
      FUNC_ARGS,
    ]);
    const proposeTx = await governor.propose(
      [box.address],
      [0],
      [encodedFunctionCall],
      DESCRIPTION
    );

    const proposeReceipt = await proposeTx.wait(1);
    const proposalId = proposeReceipt.events![0].args!.proposalId;
    let proposalState = await governor.state(proposalId);
    console.log(`Current Proposal State: ${proposalState}`);

    await moveBlocks(VOTING_DELAY + 1);
    // vote
    const voteTx = await governor.castVoteWithReason(
      proposalId,
      voteWay,
      reason
    );
    await voteTx.wait(1);
    proposalState = await governor.state(proposalId);
    assert.equal(proposalState.toString(), "1");
    console.log(`Current Proposal State: ${proposalState}`);
    await moveBlocks(VOTING_PERIOD + 1);

    // queue & execute
    // const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(DESCRIPTION))
    const descriptionHash = ethers.utils.id(DESCRIPTION);
    const queueTx = await governor.queue(
      [box.address],
      [0],
      [encodedFunctionCall],
      descriptionHash
    );
    await queueTx.wait(1);
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);

    proposalState = await governor.state(proposalId);
    console.log(`Current Proposal State: ${proposalState}`);

    console.log("Executing...");
    console.log;
    const exTx = await governor.execute(
      [box.address],
      [0],
      [encodedFunctionCall],
      descriptionHash
    );
    await exTx.wait(1);
    console.log((await box.retrieve()).toString());
  });
});
