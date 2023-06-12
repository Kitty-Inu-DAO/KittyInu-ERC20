require("@nomicfoundation/hardhat-toolbox");
require('dotenv').config();

// Load environment variables or set to dummy values if missing
const INFURA_API_KEY = process.env.INFURA_API_KEY || 'dummyInfuraApiKey';
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || '0x1111111111111111111111111111111111111111111111111111111111111111';
const GOERLI_PRIVATE_KEY = process.env.GOERLI_PRIVATE_KEY || '0x2222222222222222222222222222222222222222222222222222222222222222';
const ETHERSCAN_API = process.env.ETHERSCAN_API || 'dummyEtherscanApi';
const MAINNET_PRIVATE_KEY = process.env.MAINNET_PRIVATE_KEY || '0x3333333333333333333333333333333333333333333333333333333333333333';


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.9",
  networks: {
    sepolia: {
      url: `https://sepolia.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [SEPOLIA_PRIVATE_KEY]
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [GOERLI_PRIVATE_KEY]
    },
    main: {
      url: `https://mainnet.infura.io/v3/${INFURA_API_KEY}`,
      accounts: [MAINNET_PRIVATE_KEY]
    }
  },
  etherscan: {
    apiKey: ETHERSCAN_API,
  }
};
