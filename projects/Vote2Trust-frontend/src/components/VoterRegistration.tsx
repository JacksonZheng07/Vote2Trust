import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { Poll } from './VotingDashboard'

interface VoterRegistrationProps {
  poll: Poll
  onRegistered: () => void
}

const VoterRegistration: React.FC<VoterRegistrationProps> = ({ poll, onRegistered }) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!activeAddress || !transactionSigner) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
      return
    }

    setLoading(true)
    
    try {
      // In a real implementation, this would call the smart contract's register function
      // For now, we'll simulate the registration process
      enqueueSnackbar('Registering as voter...', { variant: 'info' })
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock successful registration
      onRegistered()
      
    } catch (error) {
      enqueueSnackbar('Failed to register as voter', { variant: 'error' })
      console.error('Registration error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Voter Registration</h3>
        <p className="text-gray-600 mb-6">
          Register your wallet address to participate in this voting process. 
          You can only register once per poll.
        </p>

        <div className="bg-blue-50 rounded-lg p-4 mb-6">
          <div className="flex items-center space-x-2 text-blue-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Registration Requirements</span>
          </div>
          <ul className="mt-2 text-sm text-blue-700 space-y-1">
            <li>• Connected wallet address</li>
            <li>• Sufficient gas fees for registration</li>
            <li>• One registration per address per poll</li>
          </ul>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="text-sm text-gray-600 mb-2">Your Wallet Address:</div>
          <div className="font-mono text-sm bg-white rounded border p-2 break-all">
            {activeAddress}
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading || poll.isRegistered}
          className={`btn btn-primary w-full ${poll.isRegistered ? 'btn-disabled' : ''}`}
        >
          {loading ? (
            <>
              <span className="loading loading-spinner loading-sm"></span>
              Registering...
            </>
          ) : poll.isRegistered ? (
            'Already Registered'
          ) : (
            'Register as Voter'
          )}
        </button>

        {poll.isRegistered && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Successfully Registered!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              You are now registered to vote in this poll. Wait for the commit phase to begin.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default VoterRegistration
