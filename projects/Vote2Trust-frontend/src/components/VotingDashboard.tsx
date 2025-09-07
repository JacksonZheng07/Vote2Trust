import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import VoterRegistration from './VoterRegistration'
import CommitPhase from './CommitPhase'
import RevealPhase from './RevealPhase'
import ResultsDisplay from './ResultsDisplay'
import AdminPanel from './AdminPanel'

export interface Poll {
  id: string
  title: string
  description: string
  options: string[]
  phase: 'registration' | 'commit' | 'reveal' | 'tally' | 'completed'
  startTime: Date
  commitEndTime: Date
  revealEndTime: Date
  totalVotes: number
  results?: { [option: string]: number }
  isRegistered: boolean
  hasCommitted: boolean
  hasRevealed: boolean
}

const VotingDashboard: React.FC = () => {
  const { activeAddress } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  
  // Mock poll data - in real implementation, this would come from smart contract
  const [currentPoll, setCurrentPoll] = useState<Poll>({
    id: 'poll-1',
    title: 'Community Governance Proposal',
    description: 'Should we implement the new feature X in our protocol?',
    options: ['Yes', 'No', 'Abstain'],
    phase: 'registration',
    startTime: new Date(),
    commitEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    revealEndTime: new Date(Date.now() + 48 * 60 * 60 * 1000), // 48 hours
    totalVotes: 0,
    isRegistered: false,
    hasCommitted: false,
    hasRevealed: false
  })

  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  useEffect(() => {
    // Check if user is admin (in real implementation, check against smart contract)
    if (activeAddress) {
      // Mock admin check - replace with actual smart contract call
      setIsAdmin(activeAddress === 'ADMIN_ADDRESS_HERE')
    }
  }, [activeAddress])

  const updatePollPhase = (newPhase: Poll['phase']) => {
    setCurrentPoll(prev => ({ ...prev, phase: newPhase }))
  }

  const handleVoterRegistered = () => {
    setCurrentPoll(prev => ({ ...prev, isRegistered: true }))
    enqueueSnackbar('Successfully registered as voter!', { variant: 'success' })
  }

  const handleVoteCommitted = () => {
    setCurrentPoll(prev => ({ ...prev, hasCommitted: true }))
    enqueueSnackbar('Vote committed successfully!', { variant: 'success' })
  }

  const handleVoteRevealed = () => {
    setCurrentPoll(prev => ({ ...prev, hasRevealed: true }))
    enqueueSnackbar('Vote revealed successfully!', { variant: 'success' })
  }

  const getPhaseStatus = () => {
    const now = new Date()
    switch (currentPoll.phase) {
      case 'registration':
        return { status: 'Voter Registration Open', color: 'text-blue-600', bgColor: 'bg-blue-100' }
      case 'commit':
        return { status: 'Commit Phase Active', color: 'text-yellow-600', bgColor: 'bg-yellow-100' }
      case 'reveal':
        return { status: 'Reveal Phase Active', color: 'text-orange-600', bgColor: 'bg-orange-100' }
      case 'tally':
        return { status: 'Tallying Votes', color: 'text-purple-600', bgColor: 'bg-purple-100' }
      case 'completed':
        return { status: 'Voting Completed', color: 'text-green-600', bgColor: 'bg-green-100' }
      default:
        return { status: 'Unknown Phase', color: 'text-gray-600', bgColor: 'bg-gray-100' }
    }
  }

  const phaseStatus = getPhaseStatus()

  if (!activeAddress) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Connect Your Wallet</h2>
            <p className="text-gray-600 mb-6">Please connect your wallet to participate in the voting process.</p>
            <button className="btn btn-primary w-full">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Vote2Trust</h1>
                <p className="text-sm text-gray-500">Decentralized Voting Platform</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${phaseStatus.bgColor} ${phaseStatus.color}`}>
                {phaseStatus.status}
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="btn btn-outline btn-sm"
                >
                  Admin Panel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Poll Information */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">{currentPoll.title}</h2>
              <p className="text-gray-600 mb-6">{currentPoll.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Total Votes</div>
                  <div className="text-2xl font-bold text-gray-900">{currentPoll.totalVotes}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Registered Voters</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {currentPoll.isRegistered ? 'Yes' : 'No'}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="text-sm font-medium text-gray-500">Your Status</div>
                  <div className="text-2xl font-bold text-gray-900">
                    {currentPoll.hasRevealed ? 'Voted' : currentPoll.hasCommitted ? 'Committed' : 'Not Voted'}
                  </div>
                </div>
              </div>

              {/* Voting Options */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Voting Options</h3>
                <div className="space-y-2">
                  {currentPoll.options.map((option, index) => (
                    <div key={index} className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
                      <span className="font-medium text-gray-900">{option}</span>
                      {currentPoll.results && (
                        <span className="text-sm text-gray-500">
                          {currentPoll.results[option] || 0} votes
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Phase-specific Components */}
            {currentPoll.phase === 'registration' && (
              <VoterRegistration 
                poll={currentPoll}
                onRegistered={handleVoterRegistered}
              />
            )}

            {currentPoll.phase === 'commit' && currentPoll.isRegistered && (
              <CommitPhase 
                poll={currentPoll}
                onVoteCommitted={handleVoteCommitted}
              />
            )}

            {currentPoll.phase === 'reveal' && currentPoll.hasCommitted && (
              <RevealPhase 
                poll={currentPoll}
                onVoteRevealed={handleVoteRevealed}
              />
            )}

            {currentPoll.phase === 'completed' && (
              <ResultsDisplay poll={currentPoll} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* User Status Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Voting Status</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Wallet Connected</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Registered</span>
                  <div className={`w-3 h-3 rounded-full ${currentPoll.isRegistered ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vote Committed</span>
                  <div className={`w-3 h-3 rounded-full ${currentPoll.hasCommitted ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Vote Revealed</span>
                  <div className={`w-3 h-3 rounded-full ${currentPoll.hasRevealed ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Voting Timeline</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${currentPoll.phase === 'registration' ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Registration</div>
                    <div className="text-xs text-gray-500">Register to vote</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${currentPoll.phase === 'commit' ? 'bg-yellow-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Commit Phase</div>
                    <div className="text-xs text-gray-500">Submit vote hash</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${currentPoll.phase === 'reveal' ? 'bg-orange-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Reveal Phase</div>
                    <div className="text-xs text-gray-500">Reveal your vote</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${currentPoll.phase === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">Results</div>
                    <div className="text-xs text-gray-500">View final results</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Panel Modal */}
      {showAdminPanel && (
        <AdminPanel 
          poll={currentPoll}
          onUpdatePoll={setCurrentPoll}
          onClose={() => setShowAdminPanel(false)}
        />
      )}
    </div>
  )
}

export default VotingDashboard
