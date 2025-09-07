import React, { useState, useEffect } from 'react'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { Vote2TrustFactory } from '../contracts/VT'

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

const RealVotingDashboard: React.FC = () => {
  const { activeAddress, transactionSigner } = useWallet()
  const { enqueueSnackbar } = useSnackbar()
  
  const [currentPoll, setCurrentPoll] = useState<Poll>({
    id: 'poll-1',
    title: 'Loading...',
    description: 'Loading poll information...',
    options: ['Yes', 'No', 'Abstain'],
    phase: 'registration',
    startTime: new Date(),
    commitEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
    revealEndTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
    totalVotes: 0,
    isRegistered: false,
    hasCommitted: false,
    hasRevealed: false
  })

  const [isAdmin, setIsAdmin] = useState(false)
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [loading, setLoading] = useState(false)
  const [contractClient, setContractClient] = useState<any>(null)

  useEffect(() => {
    if (activeAddress) {
      initializeContract()
    }
  }, [activeAddress])

  const initializeContract = async () => {
    try {
      setLoading(true)
      
      // Create real contract client with Algorand integration
      const factory = new Vote2TrustFactory({
        defaultSender: activeAddress ?? undefined
      })
      
      const deployResult = await factory.deploy({
        onSchemaBreak: 'AppendApp',
        onUpdate: 'AppendApp',
      })
      
      const { appClient } = deployResult
      setContractClient(appClient)
      
      // Load poll information
      await loadPollInfo(appClient)
      
      // Set user as admin for demo purposes
      setIsAdmin(true)
      
      enqueueSnackbar('Connected to Algorand testnet!', { variant: 'success' })
      
    } catch (error) {
      console.error('Contract initialization error:', error)
      enqueueSnackbar('Failed to initialize contract', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const loadPollInfo = async (client: any) => {
    try {
      const pollInfo = await client.get_poll_info()
      const voteCounts = await client.get_vote_counts()
      
      // Parse poll information
      const title = pollInfo.return[0] || 'No Poll Active'
      const description = pollInfo.return[1] || 'No description available'
      const optionsJson = pollInfo.return[2] || '["Yes", "No", "Abstain"]'
      const phase = pollInfo.return[3] || 0
      const totalVoters = pollInfo.return[4] || 0
      const totalVotes = pollInfo.return[5] || 0
      const commitDeadline = pollInfo.return[6] || 0
      
      let options: string[] = ['Yes', 'No', 'Abstain']
      try {
        options = JSON.parse(optionsJson)
      } catch (e) {
        console.warn('Failed to parse options JSON:', e)
      }
      
      // Map phase number to string
      const phaseMap = ['registration', 'commit', 'reveal', 'tally', 'completed']
      const currentPhase = phaseMap[phase] || 'registration'
      
      // Get voter status if user is connected
      let voterStatus = { isRegistered: false, hasCommitted: false, hasRevealed: false }
      if (activeAddress) {
        try {
          const status = await client.get_voter_status()
          voterStatus = {
            isRegistered: status.return[0] === 1,
            hasCommitted: status.return[1] === 1,
            hasRevealed: status.return[2] === 1
          }
        } catch (e) {
          console.warn('Could not get voter status:', e)
        }
      }
      
      // Parse vote counts
      const results: { [option: string]: number } = {}
      if (voteCounts.return) {
        options.forEach((option, index) => {
          results[option] = voteCounts.return[index] || 0
        })
      }
      
      setCurrentPoll({
        id: 'poll-1',
        title,
        description,
        options,
        phase: currentPhase as Poll['phase'],
        startTime: new Date(),
        commitEndTime: new Date(commitDeadline * 1000),
        revealEndTime: new Date((commitDeadline + 3600) * 1000),
        totalVotes,
        results,
        ...voterStatus
      })
      
    } catch (error) {
      console.error('Failed to load poll info:', error)
      enqueueSnackbar('Failed to load poll information', { variant: 'error' })
    }
  }

  const handleVoterRegistered = async () => {
    if (!contractClient || !activeAddress) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
      return
    }

    try {
      setLoading(true)
      enqueueSnackbar('Registering as voter...', { variant: 'info' })
      
      await contractClient.send.register_voter()
      
      setCurrentPoll(prev => ({ ...prev, isRegistered: true }))
      enqueueSnackbar('Successfully registered as voter!', { variant: 'success' })
      
    } catch (error) {
      console.error('Registration error:', error)
      enqueueSnackbar('Failed to register as voter', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleVoteCommitted = async (voteChoice: number, salt: string) => {
    if (!contractClient || !activeAddress) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
      return
    }

    try {
      setLoading(true)
      enqueueSnackbar('Committing vote...', { variant: 'info' })
      
      // Create hash of vote + salt (simplified for demo)
      const voteHash = new Uint8Array([voteChoice, ...new TextEncoder().encode(salt)])
      
      await contractClient.send.commit_vote({ vote_hash: voteHash })
      
      setCurrentPoll(prev => ({ ...prev, hasCommitted: true }))
      enqueueSnackbar('Vote committed successfully!', { variant: 'success' })
      
    } catch (error) {
      console.error('Commit error:', error)
      enqueueSnackbar('Failed to commit vote', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleVoteRevealed = async (voteChoice: number, salt: string) => {
    if (!contractClient || !activeAddress) {
      enqueueSnackbar('Please connect your wallet first', { variant: 'error' })
      return
    }

    try {
      setLoading(true)
      enqueueSnackbar('Revealing vote...', { variant: 'info' })
      
      const saltBytes = new TextEncoder().encode(salt)
      
      await contractClient.send.reveal_vote({ 
        vote_choice: voteChoice, 
        salt: saltBytes 
      })
      
      setCurrentPoll(prev => ({ ...prev, hasRevealed: true }))
      enqueueSnackbar('Vote revealed successfully!', { variant: 'success' })
      
      // Reload poll info to get updated results
      await loadPollInfo(contractClient)
      
    } catch (error) {
      console.error('Reveal error:', error)
      enqueueSnackbar('Failed to reveal vote', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const updatePollPhase = async (newPhase: Poll['phase']) => {
    if (!contractClient || !isAdmin) {
      enqueueSnackbar('Admin access required', { variant: 'error' })
      return
    }

    try {
      setLoading(true)
      
      switch (newPhase) {
        case 'registration':
          await contractClient.send.start_registration()
          break
        case 'commit':
          await contractClient.send.start_commit_phase()
          break
        case 'reveal':
          await contractClient.send.start_reveal_phase()
          break
        case 'completed':
          await contractClient.send.complete_voting()
          break
      }
      
      setCurrentPoll(prev => ({ ...prev, phase: newPhase }))
      enqueueSnackbar(`Poll phase updated to ${newPhase}`, { variant: 'success' })
      
    } catch (error) {
      console.error('Phase update error:', error)
      enqueueSnackbar('Failed to update poll phase', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const getPhaseStatus = () => {
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
            <p className="text-gray-600 mb-6">Please connect your Algorand wallet to participate in the voting process.</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors w-full">
              Connect Wallet
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading && !contractClient) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Contract</h2>
          <p className="text-gray-600">Initializing Vote2Trust smart contract...</p>
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
                <p className="text-sm text-gray-500">Decentralized Voting Platform - Algorand</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${phaseStatus.bgColor} ${phaseStatus.color}`}>
                {phaseStatus.status}
              </div>
              {isAdmin && (
                <button
                  onClick={() => setShowAdminPanel(!showAdminPanel)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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
                  </p>

                  <button
                    onClick={handleVoterRegistered}
                    disabled={loading || currentPoll.isRegistered}
                    className={`px-6 py-3 rounded-lg transition-colors w-full ${
                      currentPoll.isRegistered 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading ? 'Registering...' : currentPoll.isRegistered ? 'Already Registered' : 'Register as Voter'}
                  </button>
                </div>
              </div>
            )}

            {currentPoll.phase === 'commit' && currentPoll.isRegistered && (
              <CommitPhase 
                poll={currentPoll}
                onVoteCommitted={handleVoteCommitted}
                loading={loading}
              />
            )}

            {currentPoll.phase === 'reveal' && currentPoll.hasCommitted && (
              <RevealPhase 
                poll={currentPoll}
                onVoteRevealed={handleVoteRevealed}
                loading={loading}
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

            {/* Admin Controls */}
            {isAdmin && (
              <div className="bg-blue-50 rounded-2xl shadow-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Controls</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => updatePollPhase('registration')}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPoll.phase === 'registration' ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 border border-blue-600'
                    }`}
                  >
                    Registration Phase
                  </button>
                  <button
                    onClick={() => updatePollPhase('commit')}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPoll.phase === 'commit' ? 'bg-yellow-600 text-white' : 'bg-white text-yellow-600 border border-yellow-600'
                    }`}
                  >
                    Commit Phase
                  </button>
                  <button
                    onClick={() => updatePollPhase('reveal')}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPoll.phase === 'reveal' ? 'bg-orange-600 text-white' : 'bg-white text-orange-600 border border-orange-600'
                    }`}
                  >
                    Reveal Phase
                  </button>
                  <button
                    onClick={() => updatePollPhase('completed')}
                    className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      currentPoll.phase === 'completed' ? 'bg-green-600 text-white' : 'bg-white text-green-600 border border-green-600'
                    }`}
                  >
                    Complete Voting
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Import the existing components
import CommitPhase from './CommitPhase'
import RevealPhase from './RevealPhase'
import ResultsDisplay from './ResultsDisplay'

export default RealVotingDashboard
