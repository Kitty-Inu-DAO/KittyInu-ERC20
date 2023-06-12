# 

[![Release Version](https://img.shields.io/github/release/Kitty-Inu-DAO/KittyInuERC20.svg)](https://github.com/Kitty-Inu-DAO/KittyInuERC20/releases/latest) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) 
![solidity - v0.8.9](https://img.shields.io/badge/solidity-v0.8.9-2ea44f?logo=solidity) [![CI Tests](https://github.com/Kitty-Inu-DAO/KittyInu-ERC20/actions/workflows/main.yml/badge.svg)](https://github.com/Kitty-Inu-DAO/KittyInu-ERC20/actions/workflows/main.yml) ![coverage tag](https://codecov.io/gh/Kitty-Inu-DAO/KittyInu-ERC20/branch/master/graph/badge.svg)

![Kitty Inu DAO](./kitty_logo.jpg)
# Kitty Inu ERC20 

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
