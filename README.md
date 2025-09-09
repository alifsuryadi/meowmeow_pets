# MeowMeow Pets 🐱

A virtual pet game built on the Sui blockchain where you can adopt, care for, and interact with your digital pets.

## Overview

MeowMeow Pets is a decentralized virtual pet simulation game that allows players to:

- Adopt unique digital pets as NFTs
- Care for pets by feeding, playing, and managing their sleep
- Level up pets through experience gained from activities
- Collect and equip accessories
- Earn in-game coins through various activities
- **NEW**: Execute combined actions with single-click PTB (Programmable Transaction Block) operations

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
- **PTB Combo Actions**: Execute multiple actions in one transaction for efficiency

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

**Package ID**: `0x78d6573573f8ae65e06fb3a9c1c8abed118a99edc49d63795729bfa689cc0e05`

**Contract Explorer**: [View on SuiScan](https://suiscan.xyz/testnet/object/0x78d6573573f8ae65e06fb3a9c1c8abed118a99edc49d63795729bfa689cc0e05/tx-blocks)

**Created Objects**:

- Pet Display: [`0x680f9f71dc1a7c55ae2cc9f516769ac57e08ed2d7c5e9479b5687b6efb291b0a`](https://suiscan.xyz/testnet/object/0x680f9f71dc1a7c55ae2cc9f516769ac57e08ed2d7c5e9479b5687b6efb291b0a)
- Publisher: [`0xedec62aef9bbdbd719cb0099704f68a22f94ccd4c9506e75d4fe4ee33043c64d`](https://suiscan.xyz/testnet/object/0xedec62aef9bbdbd719cb0099704f68a22f94ccd4c9506e75d4fe4ee33043c64d)
- Upgrade Cap: [`0x24dc7cb1ca163ae0622938398560f1ac0df0931ae2761a9eb4b1454d3b019d8d`](https://suiscan.xyz/testnet/object/0x24dc7cb1ca163ae0622938398560f1ac0df0931ae2761a9eb4b1454d3b019d8d)
- PetAccessory Display: [`0xed54831b15d856751a1600f9d9b3700caf3a649030a914c2ba00d728907ae2c0`](https://suiscan.xyz/testnet/object/0xed54831b15d856751a1600f9d9b3700caf3a649030a914c2ba00d728907ae2c0)

**Transaction Digest**: `FoYHhdwAhu9zvDrrGozC3nLrwwnSeihRSpaRRdmVED8i`

To use this contract in your frontend, update your `.env` file:

```env
VITE_PACKAGE_ID=0x78d6573573f8ae65e06fb3a9c1c8abed118a99edc49d63795729bfa689cc0e05
VITE_NETWORK=testnet
```

### Contract Features

- **Pet NFT**: Each pet is a unique NFT with dynamic metadata
- **Game Balance**: Configurable game parameters for balanced gameplay
- **Events**: Emitted for all major pet actions for frontend integration
- **Dynamic Fields**: Used for equipped items and sleep tracking
- **PTB Operations**: Atomic multi-action transactions for enhanced user experience

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

#### Individual Actions
- **Feed**: Costs 5 coins, restores 20 hunger, gains 5 experience
- **Play**: Costs 15 energy and hunger, gains 25 happiness and 10 experience
- **Work**: Costs 20 energy, happiness, and hunger, gains 15 coins and 15 experience
- **Sleep**: Restores energy over time, gradually decreases happiness and hunger

#### PTB Combo Actions
- **Eat → Work → Sleep**: Combines feeding, working, and sleeping in one transaction
- **Wake → Eat → Work**: Wakes pet (if sleeping), feeds (if needed), then works

These combo actions provide gas efficiency and streamlined gameplay experience.

## PTB (Programmable Transaction Block) Features

The latest version introduces powerful combo actions using Sui's PTB capabilities:

### Smart Combo Logic
- **Conditional Execution**: Actions only execute if conditions are met
- **Resource Optimization**: Single transaction reduces gas costs
- **Error Handling**: Robust validation prevents failed transactions

### Available Combos
1. **Eat → Work → Sleep Combo**
   - Prerequisites: Pet must be awake, have coins to feed, and meet work requirements
   - Flow: Feed pet → Work for coins → Put pet to sleep
   - Benefits: Maximizes pet productivity in one action

2. **Wake → Eat → Work Combo**  
   - Prerequisites: Pet can be sleeping or awake, must meet work conditions
   - Flow: Wake pet (if sleeping) → Feed (if needed) → Work for coins
   - Benefits: Gets sleeping pets back to productive state quickly

### Technical Implementation
- Smart contract validates all conditions before execution
- UI shows combo buttons only when all prerequisites are met
- Atomic transactions ensure all-or-nothing execution

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
