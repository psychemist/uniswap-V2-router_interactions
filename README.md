# Uniswap V2 Router Interactions

This repository demonstrates how to interact with the Uniswap V2 Router using **Hardhat** and **ethers.js**. It simulates mainnet transactions by forking the Ethereum Mainnet, allowing you to test token swaps and liquidity provision without spending real funds.

## Features

- **Swap Tokens:**
  - `swapTokensForTokens`: Swap ERC20 tokens for other ERC20 tokens (e.g., USDT -> DAI).
  - `swapETHForTokens`: Swap ETH for ERC20 tokens.
  - `swapTokensForETH`: Swap ERC20 tokens for ETH.
- **Liquidity Provision:**
  - `addRemoveLiquidity`: Add and remove liquidity for ERC20/ERC20 pairs.
  - `addRemoveLiquidityETH`: Add and remove liquidity for ETH/ERC20 pairs.
- **Mainnet Forking:** Uses Hardhat's forking capability to interact with real deployed Uniswap V2 contracts and existing token balances (via account impersonation).

## Prerequisites

- [Node.js](https://nodejs.org/) (v14+ recommended)
- [Alchemy](https://www.alchemy.com/) API Key (for Mainnet forking)

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/psychemist/uniswap-V2-router_interactions.git
   cd uniswap-V2-router_interactions
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory and add your Alchemy Mainnet API Key URL:

```bash
ALCHEMY_MAINNET_API_KEY_URL=https://eth-mainnet.g.alchemy.com/v2/YOUR_API_KEY
```

> **Note:** The scripts use `ethers.getImpersonatedSigner` to execute transactions on behalf of existing token holders (whales) on the forked mainnet. This allows testing with significant balances without needing a funded private key.

## Usage

Run the scripts using `npx hardhat run`.

### Swapping Tokens

**Swap ERC20 for ERC20 (e.g., USDT to DAI):**
```bash
npx hardhat run scripts/swapTokensForTokens.ts
```

**Swap ETH for Tokens:**
```bash
npx hardhat run scripts/swapETHForTokens.ts
```

**Swap Tokens for ETH:**
```bash
npx hardhat run scripts/swapTokensForETH.ts
```

### Liquidity Management

**Add/Remove Liquidity (ERC20/ERC20):**
```bash
npx hardhat run scripts/addRemoveLiquidity.ts
```

**Add/Remove Liquidity (ETH/ERC20):**
```bash
npx hardhat run scripts/addRemoveLiquidityETH.ts
```

## Project Structure

- `contracts/interfaces/`: Solidity interfaces for Uniswap V2 Router and ERC20 tokens.
- `scripts/`: TypeScript scripts containing the logic for each interaction type.
- `hardhat.config.ts`: Hardhat configuration, including mainnet forking setup.

## License

This project is open source and available under the [MIT License](LICENSE).
