import React, { useState } from 'react'

export interface DemoPoll {
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

const DemoVotingDashboard: React.FC = () => {
  const [currentPoll, setCurrentPoll] = useState<DemoPoll>({
    id: 'poll-1',
    title: 'Community Governance Proposal',
    description: 'Should we implement the new feature X in our protocol?',
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

  const [isAdmin, setIsAdmin] = useState(true)
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const updatePollPhase = (newPhase: DemoPoll['phase']) => {
    setCurrentPoll(prev => ({ ...prev, phase: newPhase }))
  }

  const handleVoterRegistered = () => {
    setCurrentPoll(prev => ({ ...prev, isRegistered: true }))
  }

  const handleVoteCommitted = () => {
    setCurrentPoll(prev => ({ ...prev, hasCommitted: true }))
  }

  const handleVoteRevealed = () => {
    setCurrentPoll(prev => ({ ...prev, hasRevealed: true }))
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
                <p className="text-sm text-gray-500">Decentralized Voting Platform - DEMO</p>
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

            {/* Demo Phase Components */}
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
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Register as Voter (Demo)
                  </button>
                </div>
              </div>
            )}

            {currentPoll.phase === 'commit' && currentPoll.isRegistered && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Commit Phase</h3>
                  <p className="text-gray-600 mb-6">
                    Submit a hash of your vote to keep it secret until the reveal phase.
                  </p>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select your vote:
                      </label>
                      <div className="space-y-2">
                        {currentPoll.options.map((option, index) => (
                          <label key={index} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                            <input
                              type="radio"
                              name="vote"
                              value={option}
                              className="w-4 h-4 text-blue-600"
                            />
                            <span className="font-medium text-gray-900">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={handleVoteCommitted}
                      className="w-full px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                    >
                      Commit Vote (Demo)
                    </button>
                  </div>
                </div>
              </div>
            )}

            {currentPoll.phase === 'reveal' && currentPoll.hasCommitted && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Reveal Phase</h3>
                  <p className="text-gray-600 mb-6">
                    Reveal your vote by providing the same vote choice and salt you used during the commit phase.
                  </p>

                  <button
                    onClick={handleVoteRevealed}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Reveal Vote (Demo)
                  </button>
                </div>
              </div>
            )}

            {currentPoll.phase === 'completed' && (
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  
                  <h3 className="text-3xl font-bold text-gray-900 mb-2">Voting Results</h3>
                  <p className="text-gray-600 mb-4">
                    Final tally for: <strong>{currentPoll.title}</strong>
                  </p>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center justify-center space-x-2 text-green-800">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-lg font-semibold">Winner: Yes</span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      45 votes (53%)
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-900">Detailed Results</h4>
                    {['Yes', 'No', 'Abstain'].map((option, index) => {
                      const votes = option === 'Yes' ? 45 : option === 'No' ? 32 : 8
                      const percentage = option === 'Yes' ? 53 : option === 'No' ? 38 : 9
                      const isWinner = option === 'Yes'
                      
                      return (
                        <div key={index} className={`border rounded-lg p-4 ${isWinner ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}>
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-3">
                              <span className="font-medium text-gray-900">{option}</span>
                              {isWinner && (
                                <div className="flex items-center space-x-1 text-green-600">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                  <span className="text-xs font-medium">WINNER</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-gray-900">{votes} votes</div>
                              <div className="text-sm text-gray-600">{percentage}%</div>
                            </div>
                          </div>
                          
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all duration-500 ${
                                isWinner ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
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

            {/* Demo Controls */}
            <div className="bg-blue-50 rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Demo Controls</h3>
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
                  Results Phase
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DemoVotingDashboard
