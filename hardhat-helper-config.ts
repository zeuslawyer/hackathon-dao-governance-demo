// For TimeLock
export const MIN_DELAY = 3600;
export const PROPOSERS: string[] = [];
export const EXECUTORS: string[] = [];

// For Governor Contract
export const VOTING_DELAY = 1; // blocks
export const VOTING_PERIOD = 5; // blocks
export const QUORUM_PERCENTAGE = 4; // percentage

// For Setting up Governance Contracts
export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000";

// Propose Script + Queue and Execute Script
export const FUNC = "store";
export const FUNC_ARGS = 100; // New value voted into Box.
export const DESCRIPTION = "Proposal #1 - update  value of box to 100";
export const PROPOSAL_FILE = "proposals.json";

// Voting Script
export const VOTE_REASON = "Cause Dao's score 100 for coolness";

// TimeTravel
export const developmentChains = ["hardhat", "localhost"];
