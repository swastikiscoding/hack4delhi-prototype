# Hack4Delhi Prototype - Unified Electoral Roll

A comprehensive blockchain-based electoral management system built with modern web technologies and smart contracts on Ethereum.

## 📋 Project Overview

This project implements a **Unified Electoral Roll (UER)** system designed to manage voter registration, verification, and data migration across different electoral authorities. It combines:

- **Smart Contracts** for immutable electoral data management
- **Backend API** for processing voter data and blockchain interactions
- **Frontend Application** for role-based access to electoral operations

## 🏗️ Architecture & Tech Stack

### Blockchain Layer
- **Language**: Solidity
- **Framework**: Foundry (Forge)
- **Network**: Ethereum (Sepolia testnet - Chain ID: 11155111)
- **Key Contract**: `UnifiedElectoralRoll.sol`

### Backend Server
- **Framework**: Express.js (Node.js)
- **Language**: JavaScript
- **Database**: MongoDB
- **Key Features**: 
  - Voter management
  - Blockchain contract interaction
  - Data transfer/migration handling
  - File upload integration (Cloudinary)

### Frontend Client
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Web3 Integration**: Wallet connection & smart contract interaction

## 📁 Project Structure

```
hack4delhi-prototype/
├── blockchain/              # Solidity smart contracts & deployment scripts
│   ├── src/                # Contract source code
│   ├── script/             # Deployment & interaction scripts
│   ├── test/               # Contract tests
│   ├── abi/                # Contract ABIs
│   └── broadcast/          # Deployment transaction records
├── server/                 # Express.js backend API
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── models/         # Database schemas
│   │   ├── routes/         # API endpoints
│   │   ├── blockchain/     # Web3 integration
│   │   └── utils/          # Helper functions
│   └── package.json
├── react-client/           # React frontend application
│   ├── src/
│   │   ├── pages/         # Application pages
│   │   ├── components/    # Reusable components
│   │   ├── config/        # Configuration files
│   │   └── store/         # State management
│   └── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- **Node.js** v16+ 
- **npm** or **yarn**
- **Foundry** (for blockchain development)
- **MetaMask** or compatible Web3 wallet
- **MongoDB** (for backend)

### Installation

#### 1. Clone Repository
```bash
git clone <repository-url>
cd hack4delhi-prototype
```

#### 2. Blockchain Setup
```bash
cd blockchain
npm install
# or use forge directly if installed
forge install
```

#### 3. Backend Setup
```bash
cd ../server
npm install
cp .env.example .env
# Update .env with your configuration
```

#### 4. Frontend Setup
```bash
cd ../react-client
npm install
```

## ⚙️ Configuration

### Blockchain (.env)
```
PRIVATE_KEY=<your-private-key>
RPC_URL=<sepolia-rpc-url>
CONTRACT_ADDRESS=<deployed-uer-address>
```

### Server (.env)
```
PORT=5000
MONGODB_URI=<mongodb-connection-string>
CONTRACT_ADDRESS=<deployed-uer-address>
PRIVATE_KEY=<deployer-private-key>
CLOUDINARY_URL=<cloudinary-upload-url>
```

### Frontend (.env)
```
VITE_CONTRACT_ADDRESS=<deployed-uer-address>
VITE_CHAIN_ID=11155111
VITE_RPC_URL=<sepolia-rpc-url>
```

## 🏃 Running the Project

### Development

**Blockchain - Run Tests**
```bash
cd blockchain
forge test
```

**Blockchain - Deploy to Sepolia**
```bash
cd blockchain
forge script script/DeployUER.s.sol --rpc-url $RPC_URL --private-key $PRIVATE_KEY --broadcast
```

**Backend - Start Server**
```bash
cd server
npm run dev
```

**Frontend - Start Dev Server**
```bash
cd react-client
npm run dev
```

### Production

**Build Frontend**
```bash
cd react-client
npm run build
npm run preview
```

**Deploy Smart Contracts**
```bash
cd blockchain
forge script script/DeployUER.s.sol --rpc-url $MAINNET_RPC_URL --private-key $PRIVATE_KEY --broadcast
```

## 📚 API Endpoints

### Voter Management
- `GET /api/voters` - List all voters
- `POST /api/voters` - Register new voter
- `GET /api/voters/:id` - Get voter details
- `PUT /api/voters/:id` - Update voter information

### Blockchain Operations
- `POST /api/blockchain/verify` - Verify voter on blockchain
- `POST /api/blockchain/migrate` - Initiate data migration
- `GET /api/blockchain/status` - Check migration status

### Metadata
- `GET /api/meta/constituencies` - Fetch constituency data
- `GET /api/meta/states` - Fetch state information

## 🔑 Smart Contract Roles

- **ECI (Election Commission of India)** - Administrative authority
- **State EC** - State-level election commission
- **ERO (Electoral Registration Officer)** - District-level registration
- **BLO (Booth Level Officer)** - Booth-level verification

## 🧪 Testing

### Smart Contract Tests
```bash
cd blockchain
forge test -v
```

### Backend Tests
```bash
cd server
npm test
```

### Frontend Tests
```bash
cd react-client
npm test
```

## 📝 Key Features

✅ **Voter Registration** - Register and manage voter data  
✅ **Role-Based Access** - Different permissions for ECI, State EC, ERO, BLO  
✅ **Data Migration** - Secure transfer of voter records  
✅ **Blockchain Verification** - Immutable voter records on Ethereum  
✅ **Multi-Level Authority** - Hierarchical approval workflow  
✅ **Responsive UI** - Mobile-friendly interface  

## 🔐 Security Considerations

- Smart contracts use OpenZeppelin's access control patterns
- Environment variables for sensitive data
- MongoDB connection with credentials
- Role-based authorization on backend
- Web3 wallet integration for frontend authentication

## 📄 License

This project is licensed under the MIT License - see individual LICENSE files in each directory.

## 🤝 Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit your changes (`git commit -m 'Add amazing feature'`)
3. Push to the branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## 📞 Support

For issues, questions, or contributions, please open an issue in the repository.

---

**Last Updated**: January 2026  
**Network**: Ethereum Sepolia (Testnet)  
**Chain ID**: 11155111
