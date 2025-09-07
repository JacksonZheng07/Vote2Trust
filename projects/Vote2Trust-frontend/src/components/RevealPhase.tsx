import React, { useState } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { Poll } from './VotingDashboard'

interface RevealPhaseProps {
  poll: Poll
  onVoteRevealed: () => void
}

const RevealPhase: React.FC<RevealPhaseProps> = ({ poll, onVoteRevealed }) => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [revealedVote, setRevealedVote] = useState<string>('')
  const [revealedSalt, setRevealedSalt] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState(false)
  const [verificationResult, setVerificationResult] = useState<'success' | 'error' | null>(null)

  const verifyHash = async () => {
    if (!revealedVote || !revealedSalt) {
      enqueueSnackbar('Please enter both your vote and salt', { variant: 'warning' })
      return
    }

    setIsVerifying(true)
    
    try {
      // In a real implementation, this would verify against the committed hash on the blockchain
      // For demo purposes, we'll simulate the verification
      const message = `${revealedVote}:${revealedSalt}`
      const encoder = new TextEncoder()
      const data = encoder.encode(message)
      const hashBuffer = await crypto.subtle.digest('SHA-256', data)
      const hashArray = Array.from(new Uint8Array(hashBuffer))
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
      
      // Simulate verification (in real implementation, compare with stored hash)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock verification - in real implementation, this would check against blockchain
      setVerificationResult('success')
      enqueueSnackbar('Hash verification successful!', { variant: 'success' })
      
    } catch (error) {
      setVerificationResult('error')
      enqueueSnackbar('Hash verification failed', { variant: 'error' })
    } finally {
      setIsVerifying(false)
    }
  }

  const handleRevealVote = async () => {
    if (!activeAddress || !transactionSigner) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
      return
    }

    if (verificationResult !== 'success') {
      enqueueSnackbar('Please verify your hash first', { variant: 'warning' })
      return
    }

    setLoading(true)
    
    try {
      // In a real implementation, this would call the smart contract's reveal function
      enqueueSnackbar('Revealing vote to blockchain...', { variant: 'info' })
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      // Mock successful reveal
      onVoteRevealed()
      
    } catch (error) {
      enqueueSnackbar('Failed to reveal vote', { variant: 'error' })
      console.error('Reveal error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </div>
        
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Reveal Phase</h3>
        <p className="text-gray-600">
          Reveal your vote by providing the same vote choice and salt you used during the commit phase. 
          The system will verify this matches your committed hash.
        </p>
      </div>

      <div className="space-y-6">
        {/* Vote Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Your vote choice (must match what you committed):
          </label>
          <div className="space-y-2">
            {poll.options.map((option, index) => (
              <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                <input
                  type="radio"
                  name="revealedVote"
                  value={option}
                  checked={revealedVote === option}
                  onChange={(e) => setRevealedVote(e.target.value)}
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
            Your salt (must match what you used during commit):
          </label>
          <input
            type="text"
            value={revealedSalt}
            onChange={(e) => setRevealedSalt(e.target.value)}
            placeholder="Enter the same salt you used during commit phase"
            className="input input-bordered w-full"
          />
          <p className="text-xs text-gray-500 mt-1">
            This must be exactly the same salt you used when committing your vote.
          </p>
        </div>

        {/* Verification */}
        {revealedVote && revealedSalt && (
          <div>
            <button
              onClick={verifyHash}
              disabled={isVerifying}
              className="btn btn-secondary w-full"
            >
              {isVerifying ? (
                <>
                  <span className="loading loading-spinner loading-sm"></span>
                  Verifying Hash...
                </>
              ) : (
                'Verify Hash'
              )}
            </button>
          </div>
        )}

        {/* Verification Result */}
        {verificationResult && (
          <div className={`p-4 rounded-lg ${
            verificationResult === 'success' 
              ? 'bg-green-50 border border-green-200' 
              : 'bg-red-50 border border-red-200'
          }`}>
            <div className="flex items-center space-x-2">
              {verificationResult === 'success' ? (
                <>
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-green-800">Hash Verification Successful!</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-medium text-red-800">Hash Verification Failed!</span>
                </>
              )}
            </div>
            <p className={`text-sm mt-1 ${
              verificationResult === 'success' ? 'text-green-700' : 'text-red-700'
            }`}>
              {verificationResult === 'success' 
                ? 'Your vote and salt match the committed hash. You can now reveal your vote.'
                : 'The vote and salt you provided do not match your committed hash. Please check your inputs.'
              }
            </p>
          </div>
        )}

        {/* Reveal Button */}
        {verificationResult === 'success' && (
          <button
            onClick={handleRevealVote}
            disabled={loading || poll.hasRevealed}
            className={`btn btn-primary w-full ${poll.hasRevealed ? 'btn-disabled' : ''}`}
          >
            {loading ? (
              <>
                <span className="loading loading-spinner loading-sm"></span>
                Revealing Vote...
              </>
            ) : poll.hasRevealed ? (
              'Vote Already Revealed'
            ) : (
              'Reveal Vote to Blockchain'
            )}
          </button>
        )}

        {poll.hasRevealed && (
          <div className="mt-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center space-x-2 text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">Vote Revealed Successfully!</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              Your vote has been revealed and counted. Thank you for participating!
            </p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-orange-50 rounded-lg p-4">
          <div className="flex items-center space-x-2 text-orange-800 mb-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="font-medium">Reveal Phase Instructions</span>
          </div>
          <ul className="text-sm text-orange-700 space-y-1">
            <li>1. <strong>Enter your vote:</strong> Select the same option you committed</li>
            <li>2. <strong>Enter your salt:</strong> Use the exact same salt from commit phase</li>
            <li>3. <strong>Verify:</strong> System checks if vote + salt matches your committed hash</li>
            <li>4. <strong>Reveal:</strong> Submit your vote to be counted in the final tally</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default RevealPhase
