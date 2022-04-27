import { ethers, network } from "hardhat";
import { developmentChains, MIN_DELAY } from "../hardhat-helper-config";

const FUNC_TO_CALL = "store";
const STORE_VAL = 100;
const DESC = "Proposal #1 - update  value of box to 100";

export async function queueAndExecute(
  args: any[],
  functionToCall: string,
  proposalDescription: string
) {
  const box = await ethers.getContract("Box");

  const encodedFunctionCall = box.interface.encodeFunctionData(
    functionToCall,
    args
  );

  const descriptionHash = ethers.utils.keccak256(
    ethers.utils.toUtf8Bytes(proposalDescription)
  );
  // could also use ethers.utils.id(PROPOSAL_DESCRIPTION)

  const governor = await ethers.getContract("GovernorContract");
  const queueTx = await governor.queue(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  queueTx.wait(1);

  console.log("Proposal queued....");

  // Forward past MIN_DELAY
  if (developmentChains.includes(network.name)) {
    await moveTime(MIN_DELAY + 1);
    await moveBlocks(1);
  }

  console.log("Executing....");
  const executeTx = await governor.execute(
    [box.address],
    [0],
    [encodedFunctionCall],
    descriptionHash
  );
  executeTx.wait(1);

  console.log("Executed....");
  console.log(`Box value: ${await box.retrieve()}`);
}

queueAndExecute([STORE_VAL], FUNC_TO_CALL, DESC)
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

const moveTime = async (amount: number) => {
  console.log("Moving time...");
  await network.provider.send("evm_increaseTime", [amount]);
  console.log(`Moved forward in time ${amount} seconds`);
};
