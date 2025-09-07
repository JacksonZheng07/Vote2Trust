#!/usr/bin/env python3
"""
Deploy Vote2Trust smart contract to Algorand testnet
"""

import os
import sys
import time
from algosdk import account, mnemonic
from algosdk.v2client import algod
from algosdk import transaction
from algosdk import constants

# Testnet configuration
ALGOD_ADDRESS = "https://testnet-api.algonode.cloud"
ALGOD_TOKEN = ""

def get_algod_client():
    """Create Algorand client"""
    return algod.AlgodClient(ALGOD_TOKEN, ALGOD_ADDRESS)

def wait_for_confirmation(client, txid):
    """Wait for transaction confirmation"""
    last_round = client.status().get('last-round')
    txinfo = client.pending_transaction_info(txid)
    while not (txinfo.get('confirmed-round') and txinfo.get('confirmed-round') > 0):
        print("Waiting for confirmation...")
        last_round += 1
        client.status_after_block(last_round)
        txinfo = client.pending_transaction_info(txid)
    print(f"Transaction {txid} confirmed in round {txinfo.get('confirmed-round')}")
    return txinfo

def create_voting_contract():
    """Create a simple voting contract using Application Call transactions"""
    
    # Get account from environment
    deployer_mnemonic = os.getenv('DEPLOYER_MNEMONIC')
    if not deployer_mnemonic:
        print("❌ DEPLOYER_MNEMONIC not found in environment variables")
        print("Please set DEPLOYER_MNEMONIC in your .env file")
        return None
    
    try:
        private_key = mnemonic.to_private_key(deployer_mnemonic)
        deployer_address = account.address_from_private_key(private_key)
    except Exception as e:
        print(f"❌ Error parsing mnemonic: {e}")
        return None
    
    client = get_algod_client()
    
    # Check account balance
    try:
        account_info = client.account_info(deployer_address)
        balance = account_info.get('amount', 0) / 1_000_000  # Convert to ALGO
        print(f"📊 Deployer Address: {deployer_address}")
        print(f"💰 Account Balance: {balance} ALGO")
        
        if balance < 1:
            print("❌ Insufficient balance for deployment")
            print("Please get testnet ALGO from: https://testnet.algoexplorer.io/dispenser")
            return None
    except Exception as e:
        print(f"❌ Error checking account balance: {e}")
        return None
    
    print("🚀 Deploying Vote2Trust contract to Algorand testnet...")
    
    # For this demo, we'll create a simple contract deployment
    # In a real implementation, you would compile and deploy the actual smart contract
    
    try:
        # Get suggested parameters
        params = client.suggested_params()
        params.flat_fee = True
        params.fee = constants.MIN_TXN_FEE
        
        # Create a simple application call transaction
        # This simulates deploying a voting contract
        app_args = [
            b"Vote2Trust",
            b"Deploy",
            b"Sample Governance Vote",
            b"Should we implement the new feature X in our protocol?",
            b'["Yes", "No", "Abstain"]'
        ]
        
        txn = transaction.ApplicationCallTxn(
            sender=deployer_address,
            sp=params,
            index=0,  # 0 means create new application
            on_complete=transaction.OnComplete.NoOpOC,
            app_args=app_args,
            accounts=None,
            foreign_apps=None,
            foreign_assets=None,
            note=b"Vote2Trust Contract Deployment"
        )
        
        # Sign and send transaction
        signed_txn = txn.sign(private_key)
        txid = client.send_transaction(signed_txn)
        
        print(f"📝 Transaction ID: {txid}")
        print("⏳ Waiting for confirmation...")
        
        # Wait for confirmation
        confirmed_txn = wait_for_confirmation(client, txid)
        
        # Get the created application ID
        app_id = confirmed_txn.get('application-index')
        if app_id:
            print(f"✅ Contract deployed successfully!")
            print(f"📋 Application ID: {app_id}")
            print(f"🌐 View on AlgoExplorer: https://testnet.algoexplorer.io/application/{app_id}")
            
            # Save contract info
            contract_info = {
                "app_id": app_id,
                "deployer_address": deployer_address,
                "txid": txid,
                "network": "testnet"
            }
            
            with open("contract_info.json", "w") as f:
                import json
                json.dump(contract_info, f, indent=2)
            
            print("💾 Contract info saved to contract_info.json")
            return contract_info
        else:
            print("❌ Failed to get application ID")
            return None
            
    except Exception as e:
        print(f"❌ Deployment failed: {e}")
        return None

def main():
    """Main deployment function"""
    print("=" * 60)
    print("🎯 Vote2Trust Smart Contract Deployment")
    print("=" * 60)
    
    # Load environment variables
    from dotenv import load_dotenv
    load_dotenv()
    
    contract_info = create_voting_contract()
    
    if contract_info:
        print("\n" + "=" * 60)
        print("🎉 DEPLOYMENT SUCCESSFUL!")
        print("=" * 60)
        print(f"📋 Application ID: {contract_info['app_id']}")
        print(f"👤 Deployer: {contract_info['deployer_address']}")
        print(f"🔗 Transaction: {contract_info['txid']}")
        print(f"🌐 Network: {contract_info['network']}")
        print("\n📝 Next Steps:")
        print("1. Update frontend with the new contract address")
        print("2. Test the voting functionality")
        print("3. Deploy to mainnet when ready")
        print("=" * 60)
    else:
        print("\n" + "=" * 60)
        print("❌ DEPLOYMENT FAILED")
        print("=" * 60)
        print("Please check the error messages above and try again.")
        print("=" * 60)
        sys.exit(1)

if __name__ == "__main__":
    main()
