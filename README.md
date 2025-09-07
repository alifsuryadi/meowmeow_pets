# MeowMeow Pets 🐱

A virtual pet game built on the Sui blockchain where you can adopt, care for, and interact with your digital pets.

## Overview

MeowMeow Pets is a decentralized virtual pet simulation game that allows players to:

- Adopt unique digital pets as NFTs
- Care for pets by feeding, playing, and managing their sleep
- Level up pets through experience gained from activities
- Collect and equip accessories
- Earn in-game coins through various activities

## Project Structure

```
meowmeow_pets/
├── meowmeow-contract/     # Sui Move smart contracts
│   ├── sources/           # Contract source files
│   ├── tests/            # Contract tests
│   └── Move.toml         # Move package configuration
└── meowmeow-ui/          # React frontend application
    ├── src/              # Frontend source code
    ├── public/           # Static assets
    └── package.json      # Node.js dependencies
```

## Features

### Pet Management

- **Adopt Pets**: Create your unique pet NFT with custom name
- **Pet Stats**: Monitor energy, happiness, and hunger levels
- **Activities**: Feed, play, and work with your pet
- **Sleep System**: Let your pet rest to restore energy
- **Leveling**: Gain experience and level up your pet
- **Accessories**: Equip items like glasses to customize appearance

### Game Economy

- Earn coins through work activities
- Spend coins to feed your pet
- Experience-based leveling system
- Dynamic pet appearance based on level and equipped items

## Quick Start

### Prerequisites

- Node.js (v18 or higher)
- Sui CLI
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/alifsuryadi/meowmeow_pets
cd meowmeow_pets
```

## Smart Contract Setup

### Installation

1. Navigate to the contract directory:

```bash
cd meowmeow-contract
```

2. Install Sui CLI if not already installed:

```bash
# Follow official Sui installation guide
curl -fLJO https://github.com/MystenLabs/sui/releases/latest/download/sui-testnet-ubuntu-x86_64.tgz
```

3. Build the contract:

```bash
sui move build
```

### Deployment

1. Deploy to testnet:

```bash
# sui client publish --gas-budget 100000000
sui client publish
```

2. Note down the package ID and object IDs from the deployment output

3. Update the frontend configuration with the deployed package ID

### Using Pre-deployed Contract

You can use the already deployed contract on Sui testnet:

**Package ID**: `0xb1d820691672e1df7a1a826d632274c199df363b230fc4f223244df8f3219e83`

**Contract Explorer**: [View on SuiScan](https://suiscan.xyz/testnet/object/0xb1d820691672e1df7a1a826d632274c199df363b230fc4f223244df8f3219e83/tx-blocks)

**Created Objects**:

- Pet Display: [`0x40e85fdd74f24985995f5d418193f9197335ee06d8dac72740082d3334b6e1bb`](https://suiscan.xyz/testnet/object/0x40e85fdd74f24985995f5d418193f9197335ee06d8dac72740082d3334b6e1bb)
- Publisher: [`0xbe933f159308ca4490a6ee47e867f37d40f422f4d53bac788165a5877e3e29da`](https://suiscan.xyz/testnet/object/0xbe933f159308ca4490a6ee47e867f37d40f422f4d53bac788165a5877e3e29da)
- Upgrade Cap: [`0xcdc667bbe208c9dc666d68b893a3a9d1ed2f905a12afc7fe18cb6fbddb0410b1`](https://suiscan.xyz/testnet/object/0xcdc667bbe208c9dc666d68b893a3a9d1ed2f905a12afc7fe18cb6fbddb0410b1)
- PetAccessory Display: [`0xfce3941f1e895fb382259bb4c7031e9bb07d53e686f74c778f4a3bbc52a44d46`](https://suiscan.xyz/testnet/object/0xfce3941f1e895fb382259bb4c7031e9bb07d53e686f74c778f4a3bbc52a44d46)

**Transaction Digest**: `BScr39hZVYmbaiPAUTimfU1HrHkcE5Hiez58ZncWT6oG`

To use this contract in your frontend, update your `.env` file:

```env
VITE_PACKAGE_ID=0x2e6e2b443734e7a67740318ea186a4f9abb3fa0043ea43ab5d91be5c96c2e7c4
VITE_NETWORK=testnet
```

### Contract Features

- **Pet NFT**: Each pet is a unique NFT with dynamic metadata
- **Game Balance**: Configurable game parameters for balanced gameplay
- **Events**: Emitted for all major pet actions for frontend integration
- **Dynamic Fields**: Used for equipped items and sleep tracking

## Frontend Setup

### Installation

1. Navigate to the UI directory:

```bash
cd meowmeow-ui
```

2. Install dependencies:

```bash
npm install
```

3. Copy environment configuration:

```bash
cp .env.example .env
```

4. Update `.env` with your contract details:

```env
VITE_PACKAGE_ID=your_deployed_package_id_here
VITE_NETWORK=testnet
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
```

### Technology Stack

- **Framework**: React 19 with TypeScript
- **Styling**: Tailwind CSS
- **Blockchain Integration**: @mysten/dapp-kit, @mysten/sui.js
- **UI Components**: Radix UI
- **State Management**: TanStack Query
- **Build Tool**: Vite

## Game Mechanics

### Pet Stats

- **Energy**: Decreases with activities, restored through sleep
- **Happiness**: Increased by playing, decreased by work and sleep
- **Hunger**: Decreased by activities, restored by feeding

### Activities

- **Feed**: Costs 5 coins, restores 20 hunger, gains 5 experience
- **Play**: Costs 15 energy and hunger, gains 25 happiness and 10 experience
- **Work**: Costs 20 energy, happiness, and hunger, gains 10 coins and 15 experience
- **Sleep**: Restores energy over time, gradually decreases happiness and hunger

### Leveling System

- Pets start at level 1
- Require 100 experience per level to advance
- Appearance changes at levels 2 and 3
- Experience is consumed when leveling up

## Testing

### Contract Tests

```bash
cd meowmeow-contract
sui move test
```

### Frontend Tests

```bash
cd meowmeow-ui
npm run lint
```

## Deployment

### Contract Deployment

1. Build and publish the contract to Sui testnet/mainnet
2. Update frontend environment variables with package ID

### Frontend Deployment

1. Build the application: `npm run build`
2. Deploy the `dist` folder to your hosting service (Vercel, Netlify, etc.)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions and support, please open an issue in the GitHub repository.

---

Built with ❤️ using Sui blockchain technology
