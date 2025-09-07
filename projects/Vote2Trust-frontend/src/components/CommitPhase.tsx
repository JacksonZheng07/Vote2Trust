import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { Poll } from './VotingDashboard'

interface CommitPhaseProps {
  poll: Poll
  onVoteCommitted: () => void
}

const CommitPhase: React.FC<CommitPhaseProps> = ({ poll, onVoteCommitted }) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>('')
  const [salt, setSalt] = useState<string>('')
  const [generatedHash, setGeneratedHash] = useState<string>('')
  const [showHash, setShowHash] = useState(false)

  // Generate a random salt if not provided
  const generateRandomSalt = () => {
    const randomSalt = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    setSalt(randomSalt)
  }

  // Generate hash from vote + salt
  const generateHash = async () => {
    if (!selectedOption || !salt) {
      enqueueSnackbar('Please select an option and enter a salt', { variant: 'warning' })
      return
    }

    try {
      // In a real implementation, this would use keccak256 from a crypto library
      // For demo purposes, we'll create a simple hash
      const message = `${selectedOption}:${salt}`
      const encoder = new TextEncoder()
      const data = encoder.encode(message)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      setGeneratedHash(hashHex)
      setShowHash(true)
    } catch (error) {
      enqueueSnackbar('Failed to generate hash', { variant: 'error' })
    }
  }

  const handleCommitVote = async () => {
    if (!activeAddress || !transactionSigner) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
      return
    }

    if (!generatedHash) {
      enqueueSnackbar('Please generate a hash first', { variant: 'warning' })
      return
    }

    setLoading(true)
    
    try {
      // In a real implementation, this would call the smart contract's commit function
      enqueueSnackbar('Committing vote to blockchain...', { variant: 'info' })
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock successful commit
      onVoteCommitted()
      
    } catch (error) {
      enqueueSnackbar('Failed to commit vote', { variant: 'error' })
      console.error('Commit error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Commit Phase</h3>
        <p className="text-gray-600">
          Submit a hash of your vote to keep it secret until the reveal phase. 
          You'll need to remember your vote and salt for the reveal phase.
        </p>
      </div>

      <div className="space-y-6">
        {/* Vote Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select your vote:
          </label>
          <div className="space-y-2">
            {poll.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="vote"
                  value={option}
                  checked={selectedOption === option}
                  onChange={(e) => setSelectedOption(e.target.value)}
                  className="w-4 h-4 text-blue-600"
                />
                <span className="font-medium text-gray-900">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Salt Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Salt (random string to secure your vote):
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={salt}
              onChange={(e) => setSalt(e.target.value)}
              placeholder="Enter a random string or generate one"
              className="input input-bordered flex-1"
            />
            <button
              onClick={generateRandomSalt}
              className="btn btn-outline"
            >
              Generate
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Keep this salt secret! You'll need it to reveal your vote later.
          </p>
        </div>

        {/* Hash Generation */}
        {selectedOption && salt && (
          <div>
            <button
              onClick={generateHash}
              className="btn btn-secondary w-full"
            >
              Generate Vote Hash
            </button>
          </div>
        )}

        {/* Generated Hash Display */}
        {showHash && generatedHash && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="text-sm font-medium text-gray-700 mb-2">Generated Hash:</div>
            <div className="font-mono text-sm bg-white rounded border p-2 break-all">
              {generatedHash}
            </div>
            <div className="mt-2 p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-2 text-yellow-800">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
                <span className="font-medium">Important!</span>
              </div>
              <ul className="text-sm text-yellow-700 mt-1 space-y-1">
                <li>• Save your vote choice: <strong>{selectedOption}</strong></li>
                <li>• Save your salt: <strong>{salt}</strong></li>
                <li>• You'll need both to reveal your vote later</li>
              </ul>
            </div>
          </div>
        )}

        {/* Commit Button */}
        {generatedHash && (
          <button
            onClick={handleCommitVote}
            disabled={loading || poll.hasCommitted}
            className={`btn btn-primary w-full ${poll.hasCommitted ? 'btn-disabled' : ''}`}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Committing Vote...
              </>
            ) : poll.hasCommitted ? (
              'Vote Already Committed'
            ) : (
              'Commit Vote to Blockchain'
            )}
          </button>
        )}

        {poll.hasCommitted && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Vote Committed Successfully!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your vote hash has been submitted to the blockchain. Wait for the reveal phase to begin.
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-blue-800 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">How Commit-Reveal Works</span>
          </div>
          <ul className="text-sm text-blue-700 space-y-1">
            <li>1. <strong>Commit:</strong> Submit a hash of your vote + salt (keeps vote secret)</li>
            <li>2. <strong>Reveal:</strong> Later, submit your actual vote + salt to verify the hash</li>
            <li>3. <strong>Security:</strong> Prevents vote buying and coercion since votes are hidden initially</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default CommitPhase
