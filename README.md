# PURPOSE

This repo contains demo code for the Chainlink 2022 Spring Hackathon.

# Description

This project sets up 4 contracts necessary to demonstrate governance:

- Governance Token
- Governor
- Timelock
- "Box" - the target of governance

`Box` is owned by the `Timelock` and therefore can only be called by `Timelock`. This ensure automation, and protocol-controlled execution of successful proposals.
`Governor` is given 'proposer' rights, while the executor is given to zero-address (i.e anyone).

The lifecycle of governance demonstrated in this project is as follows:

- deploy contracts
- setup the access control and roles
- make a proposal by calling the `GovernorContract`'s `propose()` method.
- voting (after the voting delay and during the voting window) to update `Box`'s value to 100.
- queueing (timelock) for the duration of the minimum delay the `GovernorContract`'s `queue()` method, and
- then executing the successful proposal by calling the `GovernorContract`'s `execute()` method.

# TOOLS

- yarn
- Typescript
- Hardhat
- OpenZeppelin
- Solidity

# THANKS

Thanks to Patrick who's [repository](https://github.com/PatrickAlphaC/dao-template) served as inspiration for this.
