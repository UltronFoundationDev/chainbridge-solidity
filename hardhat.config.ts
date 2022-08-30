/**
 * @type import('hardhat/config').HardhatUserConfig
 */

 import { HardhatUserConfig } from 'hardhat/config';
 import 'hardhat-contract-sizer';
 import 'hardhat-gas-reporter';
 import '@typechain/hardhat';
 import '@nomiclabs/hardhat-etherscan';
 import '@nomiclabs/hardhat-waffle';
 import '@nomiclabs/hardhat-ethers';

 import "./deploy/deploy";
 import "./deploy/changeFee";
 import "./deploy/setResourceIds";
 import "./deploy/changeRelayers";
 import "./deploy/withdraw";
 import "./deploy/changeNonce";
 import "./deploy/multisig";
 import "./deploy/changeTreasury";
 require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.11",
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      },
    ],
  },
  contractSizer: {
    alphaSort: true,
    runOnCompile: true,
    disambiguatePaths: false,
  },
  paths: {
    sources: "./contracts",
    tests: "./hardhat-test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    ganache_ultron: {
      url: "http://ganache_ultron:8545/",
      chainId: 1000,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ganache_bsc: {
      url: "http://ganache_bsc:8545/",
      chainId: 1020,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ganache_fantom: {
      url: "http://ganache_fantom:8545/",
      chainId: 1020,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ganache_ethereum: {
      url: "http://ganache_ethereum:8545/",
      chainId: 1020,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ganache_avalanche: {
      url: "http://ganache_avalanche:8545/",
      chainId: 1020,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    ganache_polygon: {
      url: "http://ganache_polygon:8545/",
      chainId: 1020,
      accounts: process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: true
  }
};

export default config;