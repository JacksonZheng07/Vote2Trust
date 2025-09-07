# Vote2Trust Deployment Guide

This guide will help you deploy the Vote2Trust smart contract to Algorand and configure the frontend for production use.

## 🚀 Smart Contract Deployment

### Prerequisites

1. **Algorand Wallet**: Get testnet ALGO from [Algorand Testnet Faucet](https://testnet.algoexplorer.io/dispenser)
2. **Environment Setup**: Configure your environment variables
3. **Poetry**: Install Python dependencies

### Step 1: Environment Configuration

Create a `.env` file in the contracts directory:

```bash
cd projects/Vote2Trust-contracts
cp .env.template .env
```

Edit `.env` with your credentials:

```env
# Algorand Testnet Configuration
ALGOD_SERVER=https://testnet-api.algonode.cloud
ALGOD_TOKEN=
ALGOD_PORT=
ALGOD_NETWORK=testnet

# Indexer Configuration
INDEXER_SERVER=https://testnet-idx.algonode.cloud
INDEXER_TOKEN=
INDEXER_PORT=

# Deployer Account (your wallet)
DEPLOYER_MNEMONIC="your 25-word mnemonic phrase here"
```

### Step 2: Install Dependencies

```bash
# Install Python dependencies
poetry install

# Generate contract artifacts
poetry run python -m smart_contracts.v_t.deploy_config
```

### Step 3: Deploy to Testnet

```bash
# Deploy the contract
poetry run python -m smart_contracts.v_t.deploy_config
```

Expected output:
```
Vote2Trust contract deployed at [CONTRACT_ADDRESS] with app ID [APP_ID]
Sample poll created successfully
Registration phase started
```

### Step 4: Deploy to Mainnet (Production)

⚠️ **Warning**: Only deploy to mainnet after thorough testing!

```bash
# Update .env for mainnet
ALGOD_SERVER=https://mainnet-api.algonode.cloud
ALGOD_NETWORK=mainnet
INDEXER_SERVER=https://mainnet-idx.algonode.cloud

# Deploy to mainnet
poetry run python -m smart_contracts.v_t.deploy_config
```

## 🎨 Frontend Deployment

### Step 1: Environment Configuration

Create a `.env` file in the frontend directory:

```bash
cd projects/Vote2Trust-frontend
cp .env.template .env
```

Edit `.env` with your network settings:

```env
# Testnet Configuration
VITE_ENVIRONMENT=local
VITE_ALGOD_TOKEN=
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud
VITE_ALGOD_PORT=
VITE_ALGOD_NETWORK=testnet

VITE_INDEXER_TOKEN=
VITE_INDEXER_SERVER=https://testnet-idx.algonode.cloud
VITE_INDEXER_PORT=
```

### Step 2: Update Contract Address

After deploying the smart contract, update the frontend to use the deployed contract:

1. Copy the contract address from deployment output
2. Update the contract import in `src/components/RealVotingDashboard.tsx`
3. Or use environment variables for dynamic contract addresses

### Step 3: Build and Deploy

```bash
# Install dependencies
npm install

# Build for production
npm run build

# Deploy to your preferred platform
# Vercel
npx vercel --prod

# Netlify
npx netlify deploy --prod --dir=dist

# Or serve locally
npm run preview
```

## 🔧 Configuration Options

### Smart Contract Configuration

The contract supports various configuration options:

```python
# Poll creation parameters
title: str = "Your Poll Title"
description: str = "Detailed poll description"
options: str = '["Option 1", "Option 2", "Option 3"]'  # JSON array
commit_duration: int = 3600  # 1 hour in seconds
reveal_duration: int = 3600  # 1 hour in seconds
```

### Frontend Configuration

Environment variables for different networks:

```env
# Local Development
VITE_ALGOD_NETWORK=localnet
VITE_ALGOD_SERVER=http://localhost:4001

# Testnet
VITE_ALGOD_NETWORK=testnet
VITE_ALGOD_SERVER=https://testnet-api.algonode.cloud

# Mainnet
VITE_ALGOD_NETWORK=mainnet
VITE_ALGOD_SERVER=https://mainnet-api.algonode.cloud
```

## 🧪 Testing Deployment

### 1. Test Smart Contract Functions

```bash
# Test voter registration
poetry run python -c "
from smart_contracts.artifacts.v_t.v_t_client import Vote2TrustFactory
# Test contract functions
"

# Test poll creation
# Test commit phase
# Test reveal phase
# Test results
```

### 2. Test Frontend Integration

1. Open the deployed frontend URL
2. Connect your Algorand wallet
3. Test the complete voting flow:
   - Register as voter
   - Commit vote
   - Reveal vote
   - View results

### 3. Verify Blockchain Transactions

Check transactions on [AlgoExplorer](https://testnet.algoexplorer.io/):
- Voter registration transactions
- Vote commit transactions
- Vote reveal transactions
- Results verification

## 🔒 Security Considerations

### Smart Contract Security

1. **Admin Controls**: Only deployer can manage polls
2. **Phase Validation**: Strict phase transitions
3. **Hash Verification**: Cryptographic vote verification
4. **Deadline Enforcement**: Time-based voting phases
5. **Emergency Stop**: Admin can halt voting if needed

### Frontend Security

1. **Wallet Integration**: Secure wallet connection
2. **Transaction Signing**: User-controlled transaction signing
3. **Input Validation**: Client-side validation
4. **Error Handling**: Graceful error management

## 📊 Monitoring and Analytics

### Smart Contract Monitoring

Monitor contract activity:
- Total voters registered
- Votes committed vs revealed
- Phase transitions
- Error rates

### Frontend Analytics

Track user engagement:
- Wallet connection rates
- Voting completion rates
- User drop-off points
- Performance metrics

## 🚨 Troubleshooting

### Common Issues

1. **Contract Deployment Fails**
   - Check ALGO balance
   - Verify network connectivity
   - Check environment variables

2. **Frontend Can't Connect**
   - Verify contract address
   - Check network configuration
   - Ensure wallet is connected

3. **Voting Fails**
   - Check if in correct phase
   - Verify voter registration
   - Check transaction fees

### Debug Commands

```bash
# Check contract state
poetry run python -c "
from smart_contracts.artifacts.v_t.v_t_client import Vote2TrustFactory
# Debug contract state
"

# Check frontend logs
npm run dev
# Check browser console for errors
```

## 📈 Scaling Considerations

### For Large Elections

1. **Batch Processing**: Process votes in batches
2. **Gas Optimization**: Optimize contract for lower costs
3. **Frontend Caching**: Cache poll data
4. **CDN**: Use CDN for static assets

### For High Traffic

1. **Load Balancing**: Multiple frontend instances
2. **Database**: Store poll metadata off-chain
3. **Monitoring**: Real-time performance monitoring
4. **Auto-scaling**: Scale based on demand

## 🎯 Production Checklist

- [ ] Smart contract deployed to mainnet
- [ ] Contract address updated in frontend
- [ ] Environment variables configured
- [ ] SSL certificate installed
- [ ] Domain configured
- [ ] Monitoring set up
- [ ] Backup procedures in place
- [ ] Security audit completed
- [ ] Load testing performed
- [ ] Documentation updated

## 📞 Support

For deployment issues:
- Check the troubleshooting section
- Review Algorand documentation
- Contact the development team
- Join the community Discord

---

**Happy Deploying!** 🚀

Your Vote2Trust platform is now ready to empower communities with secure, transparent voting!
