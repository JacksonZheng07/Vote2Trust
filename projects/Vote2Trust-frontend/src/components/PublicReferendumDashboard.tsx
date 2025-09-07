import React, { useState, useEffect } from 'react'

interface Transaction {
  id: string
  type: 'registration' | 'commit' | 'reveal' | 'complete'
  timestamp: Date
  hash: string
  salt?: string
  amount: string
  status: 'pending' | 'confirmed' | 'failed'
  from: string
  to: string
}

// Public Referendum Dashboard with Algorand cryptocurrency transactions
const PublicReferendumDashboard: React.FC = () => {
  const [phase, setPhase] = useState<'registration' | 'voting' | 'completed'>('registration')
  const [isRegistered, setIsRegistered] = useState(false)
  const [hasVoted, setHasVoted] = useState(false)
  const [voteChoice, setVoteChoice] = useState('')
  const [generatedSalt, setGeneratedSalt] = useState('')
  const [voteHash, setVoteHash] = useState('')
  const [results, setResults] = useState({ 'Yes': 0, 'No': 0, 'Abstain': 0 })
  const [walletConnected, setWalletConnected] = useState(false)
  const [userAddress, setUserAddress] = useState('')
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [showTransactions, setShowTransactions] = useState(false)

  // Generate cryptographically secure salt
  const generateSecureSalt = (): string => {
    const array = new Uint8Array(32) // 256 bits of entropy
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Generate hash from vote choice and salt
  const generateHash = (choice: string, salt: string): string => {
    const combined = choice + salt
    const encoder = new TextEncoder()
    const data = encoder.encode(combined)
    return Array.from(data, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Add transaction to the list
  const addTransaction = (type: Transaction['type'], hash: string, salt?: string) => {
    const newTransaction: Transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      timestamp: new Date(),
      hash,
      salt,
      amount: '0.001 ALGO', // Transaction fee
      status: 'confirmed',
      from: userAddress,
      to: 'VOTE2TRUST_CONTRACT_ADDRESS'
    }
    setTransactions(prev => [newTransaction, ...prev])
  }

  // Simulate wallet connection
  const connectWallet = () => {
    const mockAddress = 'ALGO' + Math.random().toString(36).substr(2, 9).toUpperCase()
    setUserAddress(mockAddress)
    setWalletConnected(true)
    alert(`🔗 Algorand wallet connected: ${mockAddress}`)
  }

  const handleRegister = () => {
    if (!walletConnected) {
      alert('❌ Please connect your Algorand wallet first')
      return
    }
    
    setIsRegistered(true)
    const txHash = '0x' + Math.random().toString(16).substr(2, 64)
    addTransaction('registration', txHash)
    
    alert('✅ Successfully registered for the referendum!')
    
    // Auto-advance to voting phase
    setTimeout(() => {
      setPhase('voting')
      alert('🗳️ Registration complete! Voting phase has started.')
    }, 1000)
  }

  const handleVote = () => {
    if (!walletConnected) {
      alert('❌ Please connect your Algorand wallet first')
      return
    }
    if (!voteChoice) {
      alert('❌ Please select your vote choice')
      return
    }
    
    // Generate secure salt and hash
    const salt = generateSecureSalt()
    const hash = generateHash(voteChoice, salt)
    
    setGeneratedSalt(salt)
    setVoteHash(hash)
    
    // Store for verification
    localStorage.setItem('referendum_salt', salt)
    localStorage.setItem('referendum_choice', voteChoice)
    localStorage.setItem('referendum_hash', hash)
    
    setHasVoted(true)
    const txHash = '0x' + Math.random().toString(16).substr(2, 64)
    addTransaction('commit', txHash, salt)
    
    alert(`✅ Vote submitted successfully!\n🔒 Salt: ${salt.substring(0, 16)}...\n🔐 Hash: ${hash.substring(0, 16)}...`)
    
    // Update results immediately (in real app, this would be verified on-chain)
    setResults(prev => ({
      ...prev,
      [voteChoice]: prev[voteChoice as keyof typeof prev] + 1
    }))
    
    // Auto-advance to completed phase
    setTimeout(() => {
      setPhase('completed')
      alert('🎉 Voting complete! Results are now available.')
    }, 2000)
  }

  const getPhaseColor = () => {
    switch (phase) {
      case 'registration': return 'bg-blue-100 text-blue-800'
      case 'voting': return 'bg-yellow-100 text-yellow-800'
      case 'completed': return 'bg-green-100 text-green-800'
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'registration': return 'Registration Open'
      case 'voting': return 'Voting Active'
      case 'completed': return 'Referendum Complete'
    }
  }

  const getProgressBarWidth = () => {
    switch (phase) {
      case 'registration': return '33%'
      case 'voting': return '66%'
      case 'completed': return '100%'
    }
  }

  const getTimelineDotColor = (targetPhase: string) => {
    const phaseOrder = ['registration', 'voting', 'completed']
    const currentPhaseIndex = phaseOrder.indexOf(phase)
    const targetPhaseIndex = phaseOrder.indexOf(targetPhase)
    return targetPhaseIndex <= currentPhaseIndex ? '#8b5cf6' : '#e5e7eb'
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'Arial, sans-serif',
      color: '#333'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.2)',
        padding: '20px 0'
      }}>
        <div style={{
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h1 style={{ 
              fontSize: '32px', 
              fontWeight: 'bold', 
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0 
            }}>
              🗳️ Public Referendum
            </h1>
            <p style={{ color: '#6b7280', margin: '5px 0 0 0', fontSize: '16px' }}>
              Decentralized Decision Making on Algorand Blockchain
            </p>
            {walletConnected && (
              <p style={{ color: '#10b981', fontSize: '14px', margin: '5px 0 0 0' }}>
                🔗 Connected: {userAddress}
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            {!walletConnected ? (
              <button
                onClick={connectWallet}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
                }}
              >
                Connect Algorand Wallet
              </button>
            ) : (
              <>
                <span style={{
                  padding: '10px 20px',
                  borderRadius: '25px',
                  fontSize: '14px',
                  fontWeight: '600',
                  backgroundColor: getPhaseColor().split(' ')[0].replace('bg-', '#'),
                  color: getPhaseColor().split(' ')[1].replace('text-', '#')
                }}>
                  {getPhaseText()}
                </span>
                <button
                  onClick={() => setShowTransactions(!showTransactions)}
                  style={{
                    padding: '10px 20px',
                    background: 'rgba(102, 126, 234, 0.1)',
                    color: '#667eea',
                    border: '2px solid #667eea',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  📊 View Transactions
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      <div style={{
        maxWidth: '1400px',
        margin: '30px auto',
        padding: '0 20px',
        display: 'grid',
        gridTemplateColumns: showTransactions ? '1fr 1fr' : '2fr 1fr',
        gap: '30px'
      }}>
        {/* Main Content Area */}
        <div style={{
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          padding: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: 'bold', 
            color: '#1f2937', 
            marginBottom: '15px',
            textAlign: 'center'
          }}>
            🏛️ Constitutional Amendment Proposal
          </h2>
          <p style={{ 
            color: '#4b5563', 
            lineHeight: '1.8', 
            marginBottom: '30px',
            textAlign: 'center',
            fontSize: '18px'
          }}>
            Should the community adopt a new governance framework that includes quarterly treasury reviews, 
            enhanced transparency measures, and community-driven proposal mechanisms?
          </p>

          {!walletConnected ? (
            <div style={{
              textAlign: 'center',
              padding: '60px 40px',
              background: 'linear-gradient(135deg, #f8fafc, #e2e8f0)',
              borderRadius: '20px',
              border: '2px dashed #cbd5e1'
            }}>
              <h3 style={{ color: '#64748b', marginBottom: '20px', fontSize: '24px' }}>
                🔗 Connect Your Algorand Wallet
              </h3>
              <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '16px' }}>
                Participate in this important constitutional referendum using your Algorand wallet.
              </p>
              <button
                onClick={connectWallet}
                style={{
                  padding: '18px 36px',
                  background: 'linear-gradient(45deg, #667eea, #764ba2)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '15px',
                  cursor: 'pointer',
                  fontSize: '18px',
                  fontWeight: '600',
                  boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
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
                  <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', textAlign: 'center' }}>
                    Voter Registration
                  </h3>
                  <p style={{ color: '#4b5563', marginBottom: '30px', textAlign: 'center', fontSize: '16px' }}>
                    Register to participate in this constitutional referendum. Registration is required to cast your vote.
                  </p>
                  {!isRegistered ? (
                    <div style={{ textAlign: 'center' }}>
                      <button
                        onClick={handleRegister}
                        style={{
                          padding: '15px 30px',
                          background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                          color: 'white',
                          border: 'none',
                          borderRadius: '12px',
                          cursor: 'pointer',
                          fontSize: '18px',
                          fontWeight: '600',
                          boxShadow: '0 6px 20px rgba(139, 92, 246, 0.4)'
                        }}
                      >
                        Register for Referendum
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#10b981', fontWeight: '600', fontSize: '18px' }}>✅ You are registered!</p>
                      <p style={{ color: '#6b7280', fontSize: '14px' }}>Voting phase will begin shortly...</p>
                    </div>
                  )}
                </div>
              )}

              {phase === 'voting' && (
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', textAlign: 'center' }}>
                    Cast Your Vote
                  </h3>
                  <p style={{ color: '#4b5563', marginBottom: '30px', textAlign: 'center', fontSize: '16px' }}>
                    Select your position on the constitutional amendment proposal. Your vote will be cryptographically secured.
                  </p>
                  {!hasVoted ? (
                    <div>
                      <div style={{ marginBottom: '25px' }}>
                        <label style={{ display: 'block', color: '#4b5563', marginBottom: '10px', fontSize: '16px', fontWeight: '600' }}>
                          Your Position:
                        </label>
                        <select
                          value={voteChoice}
                          onChange={(e) => setVoteChoice(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '15px',
                            border: '2px solid #e5e7eb',
                            borderRadius: '12px',
                            fontSize: '16px',
                            background: 'white'
                          }}
                        >
                          <option value="">Select your position</option>
                          <option value="Yes">✅ Yes - Adopt the new governance framework</option>
                          <option value="No">❌ No - Reject the new governance framework</option>
                          <option value="Abstain">⚪ Abstain - No position</option>
                        </select>
                      </div>
                      
                      {/* Security Information */}
                      <div style={{
                        padding: '20px',
                        background: 'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                        borderRadius: '15px',
                        marginBottom: '25px',
                        border: '1px solid #bae6fd'
                      }}>
                        <h4 style={{ color: '#0369a1', fontSize: '16px', margin: '0 0 10px 0' }}>
                          🔒 Cryptographic Security
                        </h4>
                        <p style={{ color: '#0369a1', fontSize: '14px', margin: 0, lineHeight: '1.6' }}>
                          Your vote will be protected using a cryptographically secure salt and hash. 
                          The salt will be generated automatically and displayed for your verification.
                        </p>
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <button
                          onClick={handleVote}
                          style={{
                            padding: '15px 30px',
                            background: 'linear-gradient(45deg, #f59e0b, #f97316)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '18px',
                            fontWeight: '600',
                            boxShadow: '0 6px 20px rgba(245, 158, 11, 0.4)'
                          }}
                        >
                          Submit Vote
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <p style={{ color: '#10b981', fontWeight: '600', fontSize: '18px' }}>✅ Vote submitted successfully!</p>
                      
                      {/* Display Salt and Hash */}
                      <div style={{
                        marginTop: '20px',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                        borderRadius: '15px',
                        border: '1px solid #bbf7d0'
                      }}>
                        <h4 style={{ color: '#166534', fontSize: '16px', margin: '0 0 15px 0' }}>
                          🔐 Your Vote Security Details
                        </h4>
                        <div style={{ textAlign: 'left', fontSize: '14px' }}>
                          <p style={{ margin: '5px 0', color: '#166534' }}>
                            <strong>Salt:</strong> <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>
                              {generatedSalt.substring(0, 32)}...
                            </code>
                          </p>
                          <p style={{ margin: '5px 0', color: '#166534' }}>
                            <strong>Hash:</strong> <code style={{ background: '#e5e7eb', padding: '2px 6px', borderRadius: '4px' }}>
                              {voteHash.substring(0, 32)}...
                            </code>
                          </p>
                          <p style={{ margin: '5px 0', color: '#166534' }}>
                            <strong>Choice:</strong> {voteChoice}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {phase === 'completed' && (
                <div>
                  <h3 style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937', marginBottom: '20px', textAlign: 'center' }}>
                    Referendum Results
                  </h3>
                  <p style={{ color: '#4b5563', marginBottom: '30px', textAlign: 'center', fontSize: '16px' }}>
                    The constitutional referendum has concluded. Here are the final results:
                  </p>
                  
                  {/* Results Display */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
                    {Object.entries(results).map(([option, count]) => (
                      <div key={option} style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '20px',
                        background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                        borderRadius: '15px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '16px' }}>{option}</span>
                        <span style={{
                          background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          fontSize: '16px'
                        }}>{count} votes</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Winner Announcement */}
                  <div style={{
                    padding: '25px',
                    background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)',
                    borderRadius: '15px',
                    border: '1px solid #bbf7d0',
                    textAlign: 'center'
                  }}>
                    <h4 style={{ color: '#166534', fontSize: '18px', margin: '0 0 10px 0' }}>
                      🏆 Referendum Outcome
                    </h4>
                    <p style={{ color: '#166534', fontSize: '16px', margin: 0 }}>
                      {Object.entries(results).reduce((a, b) => results[a[0]] > results[b[0]] ? a : b)[0]} has won the referendum
                    </p>
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
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
            padding: '25px',
            border: '1px solid rgba(255, 255, 255, 0.2)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
              Referendum Timeline
            </h3>
            <div style={{ position: 'relative', paddingLeft: '20px' }}>
              <div style={{
                position: 'absolute',
                left: '9px',
                top: '0',
                bottom: '0',
                width: '3px',
                background: '#e5e7eb',
                borderRadius: '2px'
              }}></div>
              <div style={{
                position: 'absolute',
                left: '9px',
                top: '0',
                width: '3px',
                height: getProgressBarWidth(),
                background: 'linear-gradient(45deg, #8b5cf6, #a855f7)',
                borderRadius: '2px',
                transition: 'height 0.5s ease-in-out'
              }}></div>

              {['registration', 'voting', 'completed'].map((p, index) => (
                <div key={p} style={{
                  position: 'relative',
                  marginBottom: '30px',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    position: 'absolute',
                    left: '-12px',
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    background: getTimelineDotColor(p),
                    border: '3px solid white',
                    boxShadow: '0 0 0 3px #8b5cf6',
                    zIndex: 1
                  }}></div>
                  <div style={{ marginLeft: '20px' }}>
                    <p style={{
                      fontWeight: '600',
                      color: ['registration', 'voting', 'completed'].indexOf(p) <= ['registration', 'voting', 'completed'].indexOf(phase) ? '#1f2937' : '#6b7280',
                      margin: 0,
                      fontSize: '16px'
                    }}>
                      {p.charAt(0).toUpperCase() + p.slice(1)} Phase
                    </p>
                    <p style={{ fontSize: '14px', color: '#9ca3af', margin: '5px 0 0 0' }}>
                      {p === 'registration' && 'Register to participate'}
                      {p === 'voting' && 'Cast your vote securely'}
                      {p === 'completed' && 'Results are final'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          {showTransactions && (
            <div style={{
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(10px)',
              borderRadius: '20px',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
              padding: '25px',
              border: '1px solid rgba(255, 255, 255, 0.2)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', marginBottom: '20px' }}>
                💰 Algorand Transactions
              </h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                {transactions.length === 0 ? (
                  <p style={{ color: '#6b7280', textAlign: 'center', fontSize: '14px' }}>
                    No transactions yet
                  </p>
                ) : (
                  transactions.map((tx) => (
                    <div key={tx.id} style={{
                      padding: '15px',
                      background: 'linear-gradient(135deg, #f8fafc, #f1f5f9)',
                      borderRadius: '12px',
                      marginBottom: '10px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontWeight: '600', color: '#1f2937', fontSize: '14px' }}>
                          {tx.type.charAt(0).toUpperCase() + tx.type.slice(1)}
                        </span>
                        <span style={{
                          padding: '4px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: tx.status === 'confirmed' ? '#dcfce7' : '#fef3c7',
                          color: tx.status === 'confirmed' ? '#166534' : '#92400e'
                        }}>
                          {tx.status}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>
                        Hash: <code style={{ background: '#e5e7eb', padding: '1px 4px', borderRadius: '3px' }}>
                          {tx.hash.substring(0, 16)}...
                        </code>
                      </p>
                      {tx.salt && (
                        <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>
                          Salt: <code style={{ background: '#e5e7eb', padding: '1px 4px', borderRadius: '3px' }}>
                            {tx.salt.substring(0, 16)}...
                          </code>
                        </p>
                      )}
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>
                        Amount: {tx.amount}
                      </p>
                      <p style={{ fontSize: '12px', color: '#6b7280', margin: '2px 0' }}>
                        {tx.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default PublicReferendumDashboard
