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

 import "./deploy/tasks";
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
    hardhat: {
      chainId: 1337,
      forking: {
        url: "https://eth-mainnet.alchemyapi.io/v2/i2LgfhBeI-JidguSNlFuToo7kPSkFBPb",
        blockNumber: 11095000,
      },
      gas: 2100000,
      gasPrice: 8000000000,
    },
    ultron: {
      url: `http://ultron-rpc.net`,
      chainId: 1231,
    },
    ethereum: {
      url: "https://mainnet.infura.io/v3/",
      chainId: 1
    },
    fantom: {
      url: "https://rpc.ftm.tools/",
      chainId: 250
    },
    bsc: {
      url: "https://bsc-dataseed.binance.org/",
      chainId: 56
    },
    polygon: {
      url: "https://rpc-mainnet.matic.network",
      chainId: 137
    },
    avalanche: {
      url: "https://api.avax.network/ext/bc/C/rpc",
      chainId: 43114
    },
    ultron_testnet: {
      url: `http://51.250.34.31:18545`,
      chainId: 1230,
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.INFURA_PROJECT_ID}`,
      chainId: 5,
      gas: 2100000,
      gasPrice: 8000000000,
    },
    bsc_testnet: {
      url: `https://data-seed-prebsc-1-s1.binance.org:8545/`,
      chainId: 97,
    },
    fantom_testnet: {
      url: `https://rpc.testnet.fantom.network/`,
      chainId: 4002,
    },
    mumbai: {
      url: "https://rpc-mumbai.matic.today",
      chainId: 80001
    }, 
    avalanche_fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      chainId: 43113
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