# Kitty Inu ERC20 v2.0.0

![solidity - v0.8.9](https://img.shields.io/badge/solidity-v0.8.9-2ea44f?logo=solidity) [![Release Version](https://img.shields.io/github/release/Kitty-Inu-DAO/KittyInu-ERC20.svg)](https://github.com/Kitty-Inu-DAO/KittyInu-ERC20/releases/latest) [![Workflows CI](https://github.com/Kitty-Inu-DAO/KittyInu-ERC20/actions/workflows/main.yml/badge.svg)](https://github.com/Kitty-Inu-DAO/KittyInu-ERC20/actions/workflows/main.yml) [![codecov](https://codecov.io/gh/Kitty-Inu-DAO/KittyInu-ERC20/branch/main/graph/badge.svg?token=605Q99RPGM)](https://codecov.io/gh/Kitty-Inu-DAO/KittyInu-ERC20) [![ethereum-mainnet](https://img.shields.io/badge/Ethereum-Mainnet-63688f?logo=ethereum)](https://etherscan.io/address/0x61a35258107563f6b6f102ae25490901c8760b12) [![goerli](https://img.shields.io/badge/Goerli-Testnet-green?logo=goerli)](https://goerli.etherscan.io/address/0x379f036c9f1a7ca84d673669a7db1aabb0d46fba) [![sepolia](https://img.shields.io/badge/Sepolia-Testnet-purple?logo=goerli)](https://sepolia.etherscan.io/token/0x15b44b0d16d196276a7cec1b505a5a8a1b35eb75) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 


![Kitty Inu DAO](./kitty_logo.jpg)

## Installation

### npm

The recommendation is to clone this repository and run:

```
npm install
```

## Configuring Environment 

Change directory to the root and create a `.env` file. 

```shell
cd KittyInu-ERC20
```

```shell
touch .env
```

Your `.env` should be set up as follows: 

```
INFURA_API_KEY="<INSERT INFURA API KEY>"
SEPOLIA_PRIVATE_KEY="<INSERT PRIVATE KEY FOR DEPLOYER>"
GOERLI_PRIVATE_KEY="<INSERT PRIVATE KEY FOR DEPLOYER>"
MAINNET_PRIVATE_KEY="<INSERT PRIVATE KEY FOR DEPLOYER>"
ETHERSCAN_API="<INSERT ETHERSCAN API KEY>"
```

Fill in `<INSERT...>` with your own values. 

## Hardhat Commands:

### Get all commands
```shell
npx hardhat help
```

### Run Test Suite

```shell
npx hardhat test
```
### Get Test Coverage Report

```shell
npx hardhat coverage
```

### Deploy 

#### Local Host
You can deploy in the `localhost` network following these steps:

```shell
npx hardhat node
```

Open a new terminal and deploy the smart contract in the `localhost` network

```shell
npx hardhat run --network localhost scripts/deploy.ts
```

#### Network 

This repository is pre-configured with `sepolia`, `goerli`, and `main` (main net) for other networks, please add to `hardhat.config.js`

For `sepolia`:

```shell
npx hardhat run --network sepolia scripts/deploy.js
```

For `goerli`:

```shell
npx hardhat run --network goerli scripts/deploy.js
```

For main net: 

```shell
npx hardhat run --network main scripts/deploy.js
```
