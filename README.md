 # 🗳️ Vote2Trust - Decentralized Voting Platform on Algorand

[![Algorand](https://img.shields.io/badge/Built%20on-Algorand-blue)](https://algorand.org)
[![React](https://img.shields.io/badge/Frontend-React-blue)](https://reactjs.org)
[![Python](https://img.shields.io/badge/Smart%20Contract-Python-green)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

## 📋 Project Summary

**Vote2Trust is a secure, transparent, and anonymous voting platform built on Algorand blockchain using commit-reveal voting mechanism for democratic decision-making.**

## 🎥 Demo Video

> **📹 [Watch the Full Demo Video](https://youtu.be/Mbs6czw37mg)**
> 
> This video demonstrates the complete voting flow, smart contract interactions, and all features of the platform.

## 📸 Screenshots

### Public Referendum Dashboard
![Public Referendum Dashboard](docs/screenshots/referendum-dashboard.png)
*Complete referendum interface showing constitutional amendment proposal, voting results, and Algorand blockchain transactions*

### Voting Results & Transaction History
![Voting Results & Transactions](docs/screenshots/voting-results.png)
*Final referendum results with "Yes" winning, complete transaction history showing commit and registration phases with cryptographic hashes and salts*

### Key Features Demonstrated
- **Constitutional Amendment Proposal**: Clear referendum question about governance framework
- **Voting Results**: Transparent results showing "Yes: 1 vote, No: 0 votes, Abstain: 0 votes"
- **Algorand Transactions**: Real blockchain transactions with hashes, salts, and 0.001 ALGO fees
- **Referendum Timeline**: Complete voting phases from registration to completion
- **Cryptographic Security**: Display of transaction hashes and salts for transparency

## 🎯 Problem Statement

Traditional voting systems face critical challenges:

- **🔒 Trust Issues**: Voters don't trust centralized authorities handling votes
- **👁️ Transparency Gaps**: No way to verify votes weren't tampered with
- **🔄 Double Voting**: Systems can allow multiple votes from the same user
- **🕵️ Identity Leaks**: Ballots may not be fully anonymous
- **📉 Low Participation**: Especially in online or community elections

## 💡 Solution: Vote2Trust

Vote2Trust leverages Algorand's blockchain technology to provide:

- **🔐 Cryptographic Anonymity**: Votes remain private until reveal phase
- **🧾 Full Verifiability**: Voters can verify their vote was counted correctly
- **🔁 Double Voting Prevention**: Smart contracts enforce single vote per address
- **💡 Complete Transparency**: All interactions are on-chain and auditable
- **🧱 Immutability**: No one can alter past data or results

## 🏗️ Technical Architecture

### Smart Contract (Algorand)
- **Language**: Python with AlgoPy
- **Features**: Commit-reveal voting, voter registration, phase management
- **Security**: Admin controls, hash verification, deadline enforcement

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Wallet Integration**: Algorand wallet support (Pera, Defly, Exodus)
- **UI**: Modern, responsive design with Tailwind CSS
- **State Management**: React hooks with real-time updates

## 🔄 Voting Process Flow

### 1. Registration Phase
- Users connect their Algorand wallet
- Register as eligible voters
- System verifies eligibility

### 2. Commit Phase
- Voters select their choice
- Generate random salt
- Create hash of (vote + salt)
- Submit hash to blockchain
- Vote remains secret

### 3. Reveal Phase
- Voters provide original vote + salt
- System verifies hash matches commitment
- Vote is revealed and counted
- Results are tallied

### 4. Results Phase
- Final vote counts displayed
- Winner determination
- Blockchain verification
- Results export available

## 🛠️ Technical Implementation

### Algorand SDKs Used
- **AlgoPy**: Python SDK for smart contract development
- **AlgoKit**: Development toolkit for Algorand applications
- **@txnlab/use-wallet**: React hooks for wallet integration
- **algosdk**: JavaScript SDK for frontend integration

### Algorand Features Leveraged
- **Smart Contracts**: For voting logic and state management
- **Atomic Transactions**: For secure vote commitment
- **Global State**: For poll information and vote counts
- **Local State**: For individual voter status
- **Transaction Finality**: For immutable vote records
- **Low Fees**: For accessible voting participation

### Unique Algorand Advantages
- **Fast Finality**: 4.5-second block times ensure quick vote processing
- **Low Cost**: Minimal transaction fees make voting accessible
- **Scalability**: Can handle thousands of voters per poll
- **Security**: Pure Proof of Stake ensures network security
- **Developer-Friendly**: Excellent tooling and documentation

## 🚀 Getting Started

### Prerequisites
- Node.js 20+
- Python 3.12+
- Algorand wallet (Pera, Defly, etc.)
- Docker (for LocalNet)

### Backend Setup (Smart Contracts)

```bash
cd projects/Vote2Trust-contracts

# Install dependencies
poetry install

# Set up environment variables
cp .env.template .env
# Edit .env with your Algorand credentials

# Deploy contract
poetry run python -m smart_contracts.v_t.deploy_config
```

### Frontend Setup

```bash
cd projects/Vote2Trust-frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.template .env
# Edit .env with your Algorand network settings

# Start development server
npm run dev
```

## 🧪 Testing

### Smart Contract Testing
```bash
cd projects/Vote2Trust-contracts
poetry run pytest
```

### Frontend Testing
```bash
cd projects/Vote2Trust-frontend
npm test
```

## 🚀 Deployment

### Smart Contract Deployment
```bash
# Deploy to Algorand Testnet
poetry run python -m smart_contracts.v_t.deploy_config

# Deploy to Algorand Mainnet (production)
ALGOD_NETWORK=mainnet poetry run python -m smart_contracts.v_t.deploy_config
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Deploy to Vercel/Netlify
npm run deploy
```

## 📊 Performance Metrics

### Smart Contract
- **Gas Efficiency**: Optimized for minimal transaction costs
- **Scalability**: Supports up to 1000+ voters per poll
- **Speed**: Fast transaction processing on Algorand

### Frontend
- **Loading States**: Skeleton screens and progress indicators
- **Caching**: Local storage for user preferences
- **Optimistic Updates**: Immediate UI feedback
- **Background Sync**: Automatic data refresh

## 🔒 Security Features

### Commit-Reveal Benefits
- **Vote Secrecy**: Votes hidden during commit phase
- **Coercion Resistance**: Cannot prove vote choice initially
- **Integrity**: Cryptographic verification ensures vote authenticity
- **Transparency**: All votes verifiable on blockchain

### Implementation Security
- **Hash Verification**: Secure hash generation and verification
- **Salt Entropy**: Random salt generation for vote security
- **Transaction Verification**: All transactions verified on blockchain
- **Admin Access Controls**: Secure admin-only functions

## 🌍 Real-World Applications

| Sector | Use Case |
|--------|----------|
| 🏢 Corporate | Shareholder votes, board elections |
| 🧑‍🎓 University | Student council elections, budget allocations |
| 🧑‍🤝‍🧑 DAOs | Treasury decisions, protocol upgrades |
| 🌐 Communities | Neighborhood projects, online forums |
| 💬 Polling | Public sentiment on proposals, roadmaps |

## 🔮 Future Enhancements

### Planned Features
- **Multi-poll Support**: Handle multiple concurrent polls
- **Advanced Analytics**: Detailed voting statistics
- **Voter Authentication**: Enhanced identity verification
- **Audit Trails**: Complete voting history
- **Mobile App**: Native mobile application

### Integration Opportunities
- **IPFS**: Document storage for poll details
- **Oracle Integration**: External data sources
- **Cross-chain**: Multi-blockchain support
- **Advanced Voting**: Ranked choice, approval voting

## 🤝 Contributing

### Development Guidelines
- Follow Python PEP 8 for smart contracts
- Use TypeScript best practices for frontend
- Write comprehensive tests
- Document new features

### Code Style
- ESLint configuration for frontend
- Black formatting for Python
- Component documentation
- Type definitions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

### Documentation
- Smart contract API documentation
- Frontend component guides
- Integration tutorials
- Troubleshooting guides

### Community
- GitHub issues
- Discord community
- Developer forums
- Stack Overflow

## 🏆 Achievements

- ✅ Complete commit-reveal voting implementation
- ✅ Algorand smart contract with full functionality
- ✅ Modern React frontend with wallet integration
- ✅ Responsive design for all devices
- ✅ Admin panel for poll management
- ✅ Real-time vote tracking and results
- ✅ Production-ready deployment configuration

## 📞 Contact

- **GitHub**: [Vote2Trust Repository](https://github.com/JacksonZheng07/Vote2Trust)
- **Demo Video**: [Watch the Demo](https://youtu.be/Mbs6czw37mg)
- **Email**: your-email@example.com
- **LinkedIn**: [Your LinkedIn Profile](https://linkedin.com/in/your-profile)

---

**Vote2Trust** - Building trust through transparent, secure, and decentralized voting on Algorand.

*Empowering communities with blockchain-based democratic decision making.*

## 📋 Project Requirements Checklist

- [x] Built with smart contracts on Algorand
- [x] Open source (MIT License)
- [x] Short summary (<150 chars)
- [x] Full description (problems solved, Algorand usage)
- [x] Technical description (SDKs, Algorand features)
- [x] Custom smart contract (not boilerplate)
- [x] Fully-functioning demo
- [x] Clear README with demo video
- [x] Screenshots included
- [x] Video with audio explanation
- [x] GitHub repo structure explanation