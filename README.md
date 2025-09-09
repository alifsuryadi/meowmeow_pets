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
- **NEW**: Breed pets to create unique offspring with mixed genetic traits

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
- **Breeding System**: Create offspring by combining two level 2+ pets

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

**Package ID**: `0x8393d956356a256ab32821434080a01d43959319311a197a2830ceab52112a36`

**Contract Explorer**: [View on SuiScan](https://suiscan.xyz/testnet/object/0x8393d956356a256ab32821434080a01d43959319311a197a2830ceab52112a36)

**Created Objects**:

- Pet Display: [`0xf59789fb562b5d9f7807b6581df7513406f3315dcd93b9ceafe3143a023f74e6`](https://suiscan.xyz/testnet/object/0xf59789fb562b5d9f7807b6581df7513406f3315dcd93b9ceafe3143a023f74e6)
- PetAccessory Display: [`0x7f29ec07d2b18732f65a8cac8767092ccbb92d79cda0e7f1c333ff975ab6f6ff`](https://suiscan.xyz/testnet/object/0x7f29ec07d2b18732f65a8cac8767092ccbb92d79cda0e7f1c333ff975ab6f6ff)
- Publisher: [`0x6bc799d5bfd6e28d1242e304205d6dd4f5f76809e979f3c7f0d83fa7accacc19`](https://suiscan.xyz/testnet/object/0x6bc799d5bfd6e28d1242e304205d6dd4f5f76809e979f3c7f0d83fa7accacc19)
- Upgrade Cap: [`0xc4fcbfed696f777ae18900d92fdffb453af15fcb5af77a7e27a478c599aa3b27`](https://suiscan.xyz/testnet/object/0xc4fcbfed696f777ae18900d92fdffb453af15fcb5af77a7e27a478c599aa3b27)

**Transaction Digest**: `CdN16XdMbysrZGAkkhJ98t2EjjcLRxwnQPk9ekiKwrYp`

To use this contract in your frontend, update your `.env` file:

```env
VITE_PACKAGE_ID=0x8393d956356a256ab32821434080a01d43959319311a197a2830ceab52112a36
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
- **Work**: Costs 20 energy, happiness, and hunger, gains 25 coins and 15 experience
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

## Breeding System 🧬

Create new unique pets by combining the genetics of two existing pets. The breeding system uses sophisticated genetic inheritance to produce offspring with mixed traits.

### Breeding Requirements

#### Prerequisites for Each Parent Pet:

- **Minimum Level**: Level 2 or higher ⭐
- **High Happiness**: 70+ happiness points ❤️
- **Breeding Cost**: 50 coins per pet (100 total) 💰
- **Awake Status**: Must not be sleeping 😴
- **Cooldown Status**: Not in 24-hour breeding cooldown ⏰

#### UI Indicators:

The breeding system provides clear visual feedback:

- **Green indicators**: Requirements met ✅
- **Red indicators**: Needs improvement ❌
- **Progress bars**: Show completion percentage for each requirement
- **Ready badge**: Displayed when all conditions are satisfied

### Genetic Inheritance System

#### Base Stat Calculation:

1. **Parent Average**: Calculate average of each stat from both parents
2. **Random Variation**: Apply ±10 point random modifier per stat
3. **Minimum Bounds**: Ensure no stat goes below 0
4. **Starting Values**: All offspring begin at level 1 with 10 coins

#### Example Genetic Calculation:

```
Parent A: Energy=80, Happiness=75, Hunger=90
Parent B: Energy=70, Happiness=85, Hunger=60

Base Average: Energy=75, Happiness=80, Hunger=75
Random Variation: Energy±10, Happiness±10, Hunger±10
Final Offspring: Energy=77, Happiness=88, Hunger=69
```

### Breeding Process Flow

#### 1. **Preparation Phase**

- Switch to "Breeding System" mode from main interface
- Review breeding requirements and costs
- Ensure both pets meet all prerequisites

#### 2. **Parent Selection**

- Choose first parent from eligible pets list
- Choose second parent (different from first)
- View real-time breeding readiness status

#### 3. **Offspring Configuration**

- Enter custom name for new pet (max 20 characters)
- Review breeding preview with cost breakdown
- Confirm genetic inheritance details

#### 4. **Transaction Execution**

- Single atomic blockchain transaction creates offspring
- Both parents' coins automatically deducted
- 24-hour breeding cooldown applied to both parents
- New pet immediately appears in collection

### Smart Contract Features

#### Atomic Operations:

- All breeding logic executed in single transaction
- Prevents partial failures or inconsistent state
- Gas-efficient single-block execution

#### Validation Layer:

```move
// Smart contract validates all conditions:
assert!(parent1.level >= min_level, E_INSUFFICIENT_LEVEL);
assert!(parent1.happiness >= min_happiness, E_INSUFFICIENT_HAPPINESS);
assert!(parent1.coins >= breeding_cost, E_INSUFFICIENT_COINS);
assert!(!is_in_cooldown(parent1), E_BREEDING_COOLDOWN);
```

#### Event Logging:

```move
// Breeding events emitted for transparency:
sui::event::emit(PetBredEvent {
    parent1_id,
    parent2_id,
    offspring_id,
    breeding_cost,
    timestamp
});
```

### Advanced Features

#### Cooldown Management:

- 24-hour breeding cooldown per pet after successful breeding
- Cooldown tracked using blockchain timestamps
- UI displays remaining cooldown time in hours
- Prevents excessive breeding and maintains game balance

#### UI Integration:

- **Breeding Info Card**: Shows progress toward breeding requirements
- **Smart Recommendations**: Suggests actions to meet requirements
- **Real-time Updates**: Progress bars update as pet stats change
- **Error Prevention**: Disabled buttons when requirements not met

#### Cost-Benefit Analysis:

- **Investment**: 100 coins total (50 per parent)
- **Returns**: Unique offspring with mixed genetic traits
- **Strategy**: Breed high-stat pets to produce superior offspring
- **Collection Growth**: Expand pet collection organically

### Breeding Strategy Tips

#### Optimal Parent Selection:

1. **Level Priority**: Ensure both pets are level 2+ first
2. **Happiness Focus**: Play with pets to boost happiness to 70+
3. **Coin Management**: Work with pets to earn required 50 coins each
4. **Stat Optimization**: Choose parents with complementary high stats

#### Genetic Planning:

- **High Energy Parents**: Produce energetic offspring
- **Happy Parents**: Create naturally happy offspring
- **Balanced Parents**: Generate well-rounded offspring
- **Strategic Pairing**: Combine different strengths for variety

### Troubleshooting

#### Common Issues:

- **"Need 2+ pets"**: Adopt or breed more pets to unlock breeding
- **Level too low**: Focus on gaining experience through activities
- **Low happiness**: Play with pets more frequently
- **Insufficient coins**: Work with pets to earn required funds
- **Breeding cooldown**: Wait 24 hours between breeding sessions

#### UI Features for Problem Solving:

- **Progress tracking**: Visual indicators show exactly what's needed
- **Action suggestions**: Smart hints for next steps
- **Requirement breakdown**: Clear display of all prerequisites
- **Status updates**: Real-time feedback on breeding readiness

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
