import "@typechain/hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
import { HardhatUserConfig } from "hardhat/config";
import "@nomiclabs/hardhat-waffle";

/**
 * @type import('hardhat/config').HardhatUserConfig
 */
// module.exports = {
// solidity: {
//   version: "0.8.9",
//   settings: {
//     optimizer: {
//       enabled: true,
//       runs: 200,
//     },
//   },
// },
// };

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  networks: {
    // DEVELOPMENT BLOCKCHAINS
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      chainId: 31337,
    },
  },
  namedAccounts: {
    deployer: {
      default: 0, // INDEX for the deployer's account in the array of accounts that Hardhat gives us.
    },
  },
  solidity: {
    version: "0.8.9",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};

export default config;
