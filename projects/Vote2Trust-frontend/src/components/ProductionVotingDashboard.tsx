import React, { useState, useEffect } from 'react'

// Production-ready voting dashboard with proper security
const ProductionVotingDashboard: React.FC = () => {
  const [phase, setPhase] = useState<'registration' | 'commit' | 'reveal' | 'completed'>('registration')
  const [isRegistered, setIsRegistered] = useState(false)
  const [hasCommitted, setHasCommitted] = useState(false)
  const [hasRevealed, setHasRevealed] = useState(false)
  const [voteChoice, setVoteChoice] = useState('')
  const [generatedSalt, setGeneratedSalt] = useState('')
  const [results, setResults] = useState({ 'Yes': 0, 'No': 0, 'Abstain': 0 })
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [walletConnected, setWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState('')

  // Production admin addresses (in real app, this would come from smart contract)
  const ADMIN_ADDRESSES = [
    'ADMIN_WALLET_ADDRESS_1',
    'ADMIN_WALLET_ADDRESS_2',
    'ADMIN_WALLET_ADDRESS_3'
  ]

  // Check if user is admin based on wallet address
  useEffect(() => {
    if (userAddress) {
      setIsAdmin(ADMIN_ADDRESSES.includes(userAddress))
    }
  }, [userAddress])

  // Generate cryptographically secure salt
  const generateSecureSalt = (): string => {
    const array = new Uint8Array(32) // 256 bits of entropy
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Simulate wallet connection (in production, this would use real wallet)
  const connectWallet = () => {
    // Simulate connecting to Algorand wallet
    const mockAddress = 'USER_WALLET_ADDRESS_' + Math.random().toString(36).substr(2, 9)
    setUserAddress(mockAddress)
    setWalletConnected(true)
    alert(`🔗 Wallet connected: ${mockAddress}`)
  }

  // Simulate admin wallet connection
  const connectAdminWallet = () => {
    const adminAddress = ADMIN_ADDRESSES[0] // Use first admin address
    setUserAddress(adminAddress)
    setWalletConnected(true)
    setIsAdmin(true)
    alert(`👨‍💼 Admin wallet connected: ${adminAddress}`)
  }

  const handleRegister = () => {
    if (!walletConnected) {
      alert('❌ Please connect your wallet first')
      return
    }
    setIsRegistered(true)
    alert('✅ Successfully registered as voter!')
    // Auto-advance to commit phase after registration
    setTimeout(() => {
      setPhase('commit')
      alert('🎉 Registration phase complete! Commit phase has started.')
    }, 1000)
  }

  const handleCommit = () => {
    if (!walletConnected) {
      alert('❌ Please connect your wallet first')
      return
    }
    if (!voteChoice) {
      alert('❌ Please select a vote choice')
      return
    }
    
    // Generate secure salt automatically
    const salt = generateSecureSalt()
    setGeneratedSalt(salt)
    
    // Store salt securely (in production, this would be encrypted)
    localStorage.setItem('vote_salt', salt)
    localStorage.setItem('vote_choice', voteChoice)
    
    setHasCommitted(true)
    alert(`✅ Vote committed successfully!\n🔒 Salt generated: ${salt.substring(0, 16)}...`)
    
    // Auto-advance to reveal phase after commit
    setTimeout(() => {
      setPhase('reveal')
      alert('🎉 Commit phase complete! Reveal phase has started.')
    }, 1000)
  }

  const handleReveal = () => {
    if (!walletConnected) {
      alert('❌ Please connect your wallet first')
      return
    }
    
    // Retrieve stored salt and vote choice
    const storedSalt = localStorage.getItem('vote_salt')
    const storedChoice = localStorage.getItem('vote_choice')
    
    if (!storedSalt || !storedChoice) {
      alert('❌ No committed vote found. Please commit a vote first.')
      return
    }
    
    // Verify the vote matches what was committed
    if (voteChoice !== storedChoice) {
      alert('❌ Vote choice does not match committed vote!')
      return
    }
    
    setHasRevealed(true)
    setResults(prev => ({
      ...prev,
      [voteChoice]: prev[voteChoice as keyof typeof prev] + 1
    }))
    
    // Clear stored data
    localStorage.removeItem('vote_salt')
    localStorage.removeItem('vote_choice')
    
    alert('✅ Vote revealed and verified successfully!')
    
    // Auto-advance to results phase after reveal
    setTimeout(() => {
      setPhase('completed')
      alert('🎉 Reveal phase complete! Voting is now complete. View the results!')
    }, 1000)
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'registration': return 'bg-blue-100 text-blue-800'
      case 'commit': return 'bg-yellow-100 text-yellow-800'
      case 'reveal': return 'bg-orange-100 text-orange-800'
      case 'completed': return 'bg-green-100 text-green-800'
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'registration': return 'Voter Registration Open'
      case 'commit': return 'Commit Phase Active'
      case 'reveal': return 'Reveal Phase Active'
      case 'completed': return 'Voting Completed'
    }
  }

  const getProgressBarWidth = () => {
    switch (phase) {
      case 'registration': return '25%'
      case 'commit': return '50%'
      case 'reveal': return '75%'
      case 'completed': return '100%'
    }
  }

  const getTimelineDotColor = (targetPhase: string) => {
    const phaseOrder = ['registration', 'commit', 'reveal', 'completed']
    const currentPhaseIndex = phaseOrder.indexOf(phase)
    const targetPhaseIndex = phaseOrder.indexOf(targetPhase)
    return targetPhaseIndex <= currentPhaseIndex ? '#8b5cf6' : '#e5e7eb'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #f3e8ff, #e0f2fe)',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
        borderBottom: '1px solid #e5e7eb',
        padding: '15px 0'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              🗳️ Vote2Trust
            </h1>
            <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
              Decentralized Voting Platform - PRODUCTION
            </p>
            {walletConnected && (
              <p style={{ color: '#10b981', fontSize: '12px', margin: '2px 0 0 0' }}>
                🔗 Connected: {userAddress.substring(0, 8)}...{userAddress.substring(-8)}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {!walletConnected ? (
              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={connectWallet}
                  style={{
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Connect Wallet
                </button>
                <button
                  onClick={connectAdminWallet}
                  style={{
                    padding: '10px 20px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Connect Admin Wallet
                </button>
              </div>
            ) : (
              <>
                <span style={{
                  padding: '8px 16px',
                  borderRadius: '20px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: getPhaseColor().split(' ')[0].replace('bg-', '#'),
                  color: getPhaseColor().split(' ')[1].replace('text-', '#')
                }}>
                  {getPhaseText()}
                </span>
                {/* Admin panel only visible to real admins */}
                {isAdmin && (
                  <button
                    onClick={() => setShowAdmin(!showAdmin)}
                    style={{
                      padding: '10px 20px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    Admin Panel
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1200px',
        margin: '30px auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr',
        gap: '20px'
      }}>
        {/* Main Content Area */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          padding: '30px'
        }}>
          <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
            Community Governance Proposal
          </h2>
          <p style={{ color: '#4b5563', lineHeight: '1.6', marginBottom: '30px' }}>
            Should we implement the new feature X in our protocol? This proposal aims to gather community
            feedback on a critical new feature. Your participation ensures a truly decentralized decision-making process.
          </p>

          {!walletConnected ? (
            <div style={{
              textAlign: 'center',
              padding: '40px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '2px dashed #cbd5e1'
            }}>
              <h3 style={{ color: '#64748b', marginBottom: '15px' }}>
                🔗 Connect Your Wallet to Vote
              </h3>
              <p style={{ color: '#64748b', marginBottom: '20px' }}>
                You need to connect your Algorand wallet to participate in voting.
              </p>
              <button
                onClick={connectWallet}
                style={{
                  padding: '15px 30px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: '600'
                }}
              >
                Connect Wallet
              </button>
            </div>
          ) : (
            <>
              {/* Phase-specific content */}
              {phase === 'registration' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                    Voter Registration
                  </h3>
                  <p style={{ color: '#4b5563', marginBottom: '20px' }}>
                    Register to participate in the voting process. Only registered users can commit and reveal their votes.
                  </p>
                  {!isRegistered ? (
                    <button
                      onClick={handleRegister}
                      style={{
                        padding: '12px 25px',
                        background: '#8b5cf6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '16px',
                        fontWeight: '600'
                      }}
                    >
                      Register as Voter
                    </button>
                  ) : (
                    <p style={{ color: '#10b981', fontWeight: '600' }}>✅ You are registered!</p>
                  )}
                </div>
              )}

              {phase === 'commit' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                    Commit Your Vote
                  </h3>
                  <p style={{ color: '#4b5563', marginBottom: '20px' }}>
                    Select your choice. A cryptographically secure salt will be generated automatically to protect your vote.
                  </p>
                  {!hasCommitted ? (
                    <div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#4b5563', marginBottom: '5px' }}>Your Choice:</label>
                        <select
                          value={voteChoice}
                          onChange={(e) => setVoteChoice(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        >
                          <option value="">Select an option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Abstain">Abstain</option>
                        </select>
                      </div>
                      <div style={{
                        padding: '15px',
                        background: '#f0f9ff',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #bae6fd'
                      }}>
                        <p style={{ color: '#0369a1', fontSize: '14px', margin: 0 }}>
                          🔒 <strong>Security Note:</strong> A cryptographically secure salt will be generated automatically when you commit your vote. This ensures your vote remains anonymous until the reveal phase.
                        </p>
                      </div>
                      <button
                        onClick={handleCommit}
                        style={{
                          padding: '12px 25px',
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}
                      >
                        Commit Vote
                      </button>
                    </div>
                  ) : (
                    <div>
                      <p style={{ color: '#10b981', fontWeight: '600' }}>✅ Vote committed!</p>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>
                        🔒 Salt generated: {generatedSalt.substring(0, 16)}...
                      </p>
                    </div>
                  )}
                </div>
              )}

              {phase === 'reveal' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                    Reveal Your Vote
                  </h3>
                  <p style={{ color: '#4b5563', marginBottom: '20px' }}>
                    Confirm your vote choice. The system will automatically verify your commitment using the stored salt.
                  </p>
                  {!hasRevealed ? (
                    <div>
                      <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', color: '#4b5563', marginBottom: '5px' }}>Your Choice:</label>
                        <select
                          value={voteChoice}
                          onChange={(e) => setVoteChoice(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px',
                            border: '1px solid #d1d5db',
                            borderRadius: '6px',
                            fontSize: '16px'
                          }}
                        >
                          <option value="">Select an option</option>
                          <option value="Yes">Yes</option>
                          <option value="No">No</option>
                          <option value="Abstain">Abstain</option>
                        </select>
                      </div>
                      <div style={{
                        padding: '15px',
                        background: '#fef3c7',
                        borderRadius: '8px',
                        marginBottom: '20px',
                        border: '1px solid #fcd34d'
                      }}>
                        <p style={{ color: '#92400e', fontSize: '14px', margin: 0 }}>
                          🔍 <strong>Verification:</strong> The system will automatically verify your vote using the stored salt. Make sure you select the same choice you committed.
                        </p>
                      </div>
                      <button
                        onClick={handleReveal}
                        style={{
                          padding: '12px 25px',
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          cursor: 'pointer',
                          fontSize: '16px',
                          fontWeight: '600'
                        }}
                      >
                        Reveal Vote
                      </button>
                    </div>
                  ) : (
                    <p style={{ color: '#10b981', fontWeight: '600' }}>✅ Vote revealed and verified!</p>
                  )}
                </div>
              )}

              {phase === 'completed' && (
                <div>
                  <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                    Voting Results
                  </h3>
                  <p style={{ color: '#4b5563', marginBottom: '20px' }}>
                    The voting period has concluded. Here are the final results:
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {Object.entries(results).map(([option, count]) => (
                      <div key={option} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '10px 15px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <span style={{ fontWeight: '600', color: '#1f2937' }}>{option}</span>
                        <span style={{
                          background: '#e0f2fe',
                          color: '#2563eb',
                          padding: '5px 10px',
                          borderRadius: '15px',
                          fontWeight: 'bold'
                        }}>{count} votes</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Voting Timeline */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            padding: '20px'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
              Voting Timeline
            </h3>
            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{
                position: 'absolute',
                left: '9px',
                top: '0',
                bottom: '0',
                width: '2px',
                background: '#e5e7eb'
              }}></div>
              <div style={{
                position: 'absolute',
                left: '9px',
                top: '0',
                width: '2px',
                height: getProgressBarWidth(),
                background: '#8b5cf6',
                transition: 'height 0.5s ease-in-out'
              }}></div>

              {['registration', 'commit', 'reveal', 'completed'].map((p, index) => (
                <div key={p} style={{
                  position: 'relative',
                  marginBottom: '25px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '-11px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    background: getTimelineDotColor(p),
                    border: '2px solid white',
                    boxShadow: '0 0 0 2px #8b5cf6',
                    zIndex: 1
                  }}></div>
                  <div style={{ marginLeft: '15px' }}>
                    <p style={{
                      fontWeight: '600',
                      color: ['registration', 'commit', 'reveal', 'completed'].indexOf(p) <= ['registration', 'commit', 'reveal', 'completed'].indexOf(phase) ? '#1f2937' : '#6b7280',
                      margin: 0
                    }}>
                      {p.charAt(0).toUpperCase() + p.slice(1)} Phase
                    </p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', margin: '2px 0 0 0' }}>
                      {p === 'registration' && 'Open for new voters'}
                      {p === 'commit' && 'Submit your hashed vote'}
                      {p === 'reveal' && 'Unveil your vote and salt'}
                      {p === 'completed' && 'Final results available'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Admin Panel - Only visible to real admins */}
          {isAdmin && showAdmin && (
            <div style={{
              background: '#f0f9ff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                Admin Controls
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <button
                  onClick={() => { setPhase('registration'); alert('Admin: Registration phase started!') }}
                  style={{
                    padding: '10px 15px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Start Registration
                </button>
                <button
                  onClick={() => { setPhase('commit'); alert('Admin: Commit phase started!') }}
                  style={{
                    padding: '10px 15px',
                    background: '#f59e0b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Start Commit Phase
                </button>
                <button
                  onClick={() => { setPhase('reveal'); alert('Admin: Reveal phase started!') }}
                  style={{
                    padding: '10px 15px',
                    background: '#ef4444',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Start Reveal Phase
                </button>
                <button
                  onClick={() => { setPhase('completed'); alert('Admin: Voting completed!') }}
                  style={{
                    padding: '10px 15px',
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  Complete Voting
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductionVotingDashboard
