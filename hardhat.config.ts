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
    tests: "/test",
    cache: "./cache",
    artifacts: "./artifacts"
  },
  networks: {
    hardhat: {
      chainId: 1337,
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/i2LgfhBeI-JidguSNlFuToo7kPSkFBPb",
        blockNumber: 1
      },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      chainId: 5,
      gas: 2200000,
      gasPrice: 1000000000
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  },
  gasReporter: {
    enabled: true
  }
};

export default config;