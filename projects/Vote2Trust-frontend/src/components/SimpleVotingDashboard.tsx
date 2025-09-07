import React, { useState } from 'react'

const SimpleVotingDashboard: React.FC = () => {
  const [phase, setPhase] = useState<'registration' | 'commit' | 'reveal' | 'completed'>('registration')
  const [isRegistered, setIsRegistered] = useState(false)
  const [hasCommitted, setHasCommitted] = useState(false)
  const [hasRevealed, setHasRevealed] = useState(false)
  const [voteChoice, setVoteChoice] = useState('')
  const [salt, setSalt] = useState('')
  const [results, setResults] = useState({ 'Yes': 0, 'No': 0, 'Abstain': 0 })
  const [showAdmin, setShowAdmin] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false) // Regular users don't have admin access

  const handleRegister = () => {
    setIsRegistered(true)
    alert('✅ Successfully registered as voter!')
    // Auto-advance to commit phase after registration
    setTimeout(() => {
      setPhase('commit')
      alert('🎉 Registration phase complete! Commit phase has started.')
    }, 1000)
  }

  const handleCommit = () => {
    if (!voteChoice) {
      alert('❌ Please select a vote choice')
      return
    }
    if (!salt) {
      alert('❌ Please enter a salt')
      return
    }
    setHasCommitted(true)
    alert('✅ Vote committed successfully!')
    // Auto-advance to reveal phase after commit
    setTimeout(() => {
      setPhase('reveal')
      alert('🎉 Commit phase complete! Reveal phase has started.')
    }, 1000)
  }

  const handleReveal = () => {
    if (!voteChoice) {
      alert('❌ Please select a vote choice')
      return
    }
    if (!salt) {
      alert('❌ Please enter a salt')
      return
    }
    setHasRevealed(true)
    setResults(prev => ({
      ...prev,
      [voteChoice]: prev[voteChoice as keyof typeof prev] + 1
    }))
    alert('✅ Vote revealed successfully!')
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
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPhaseText = () => {
    switch (phase) {
      case 'registration': return 'Voter Registration Open'
      case 'commit': return 'Commit Phase Active'
      case 'reveal': return 'Reveal Phase Active'
      case 'completed': return 'Voting Completed'
      default: return 'Unknown Phase'
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', margin: 0 }}>
              🗳️ Vote2Trust
            </h1>
            <p style={{ color: '#6b7280', margin: '5px 0 0 0' }}>
              Decentralized Voting Platform - DEMO
            </p>
            {!isAdmin && (
              <button
                onClick={() => setIsAdmin(true)}
                style={{
                  padding: '5px 10px',
                  background: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '12px',
                  marginTop: '5px'
                }}
              >
                Become Admin (Demo)
              </button>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <span style={{
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              background: phase === 'registration' ? '#dbeafe' : 
                         phase === 'commit' ? '#fef3c7' :
                         phase === 'reveal' ? '#fed7aa' : '#dcfce7',
              color: phase === 'registration' ? '#1e40af' : 
                     phase === 'commit' ? '#92400e' :
                     phase === 'reveal' ? '#c2410c' : '#166534'
            }}>
              {getPhaseText()}
            </span>
            {/* Admin panel only visible to admins */}
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
                onMouseOver={(e) => e.currentTarget.style.background = '#2563eb'}
                onMouseOut={(e) => e.currentTarget.style.background = '#3b82f6'}
              >
                Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Main Content */}
        <div>
          {/* Poll Info */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '25px',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
              Community Governance Proposal
            </h2>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              Should we implement the new feature X in our protocol?
            </p>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px', marginBottom: '20px' }}>
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Total Votes</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {results.Yes + results.No + results.Abstain}
                </div>
              </div>
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Registered</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {isRegistered ? 'Yes' : 'No'}
                </div>
              </div>
              <div style={{ background: '#f9fafb', padding: '15px', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '5px' }}>Your Status</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937' }}>
                  {hasRevealed ? 'Voted' : hasCommitted ? 'Committed' : 'Not Voted'}
                </div>
              </div>
            </div>

            {/* Voting Options */}
            <div>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                Voting Options
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {['Yes', 'No', 'Abstain'].map((option) => (
                  <div key={option} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f9fafb',
                    padding: '12px 15px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{option}</span>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      {results[option as keyof typeof results]} votes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Phase-specific Actions */}
          {phase === 'registration' && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>👤</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                Voter Registration
              </h3>
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>
                Register your wallet address to participate in this voting process.
              </p>
              <button
                onClick={handleRegister}
                disabled={isRegistered}
                style={{
                  padding: '12px 24px',
                  background: isRegistered ? '#d1d5db' : '#3b82f6',
                  color: isRegistered ? '#6b7280' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: isRegistered ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  width: '100%'
                }}
              >
                {isRegistered ? 'Already Registered' : 'Register as Voter'}
              </button>
            </div>
          )}

          {phase === 'commit' && isRegistered && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                Commit Your Vote
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Select your vote:
                </label>
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
                  <option value="">Choose an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Abstain">Abstain</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Enter a random salt:
                </label>
                <input
                  type="text"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  placeholder="e.g., mySecretSalt123"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <button
                onClick={handleCommit}
                disabled={hasCommitted}
                style={{
                  padding: '12px 24px',
                  background: hasCommitted ? '#d1d5db' : '#3b82f6',
                  color: hasCommitted ? '#6b7280' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: hasCommitted ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  width: '100%'
                }}
              >
                {hasCommitted ? 'Vote Committed' : 'Commit Vote'}
              </button>
            </div>
          )}

          {phase === 'reveal' && hasCommitted && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                Reveal Your Vote
              </h3>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Enter your vote choice:
                </label>
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
                  <option value="">Choose an option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                  <option value="Abstain">Abstain</option>
                </select>
              </div>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
                  Enter the same salt:
                </label>
                <input
                  type="text"
                  value={salt}
                  onChange={(e) => setSalt(e.target.value)}
                  placeholder="Enter the same salt from commit phase"
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <button
                onClick={handleReveal}
                disabled={hasRevealed}
                style={{
                  padding: '12px 24px',
                  background: hasRevealed ? '#d1d5db' : '#3b82f6',
                  color: hasRevealed ? '#6b7280' : 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: hasRevealed ? 'not-allowed' : 'pointer',
                  fontWeight: '600',
                  fontSize: '16px',
                  width: '100%'
                }}
              >
                {hasRevealed ? 'Vote Revealed' : 'Reveal Vote'}
              </button>
            </div>
          )}

          {phase === 'completed' && (
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '25px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '48px', marginBottom: '15px' }}>🎉</div>
              <h3 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '20px' }}>
                Voting Results
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                {Object.entries(results).map(([option, count]) => (
                  <div key={option} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    background: '#f9fafb',
                    padding: '15px',
                    borderRadius: '8px'
                  }}>
                    <span style={{ fontWeight: '500', color: '#1f2937' }}>{option}</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
                      {count} votes
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div>
          {/* User Status */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
              Your Voting Status
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Registered</span>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: isRegistered ? '#10b981' : '#d1d5db'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Vote Committed</span>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: hasCommitted ? '#10b981' : '#d1d5db'
                }}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '14px', color: '#6b7280' }}>Vote Revealed</span>
                <div style={{
                  width: '12px',
                  height: '12px',
                  borderRadius: '50%',
                  background: hasRevealed ? '#10b981' : '#d1d5db'
                }}></div>
              </div>
            </div>
          </div>

          {/* Admin Panel - Only visible to admins */}
          {isAdmin && showAdmin && (
            <div style={{
              background: '#f0f9ff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '15px' }}>
                Admin Controls
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  onClick={() => setPhase('registration')}
                  style={{
                    padding: '8px 16px',
                    background: phase === 'registration' ? '#3b82f6' : 'white',
                    color: phase === 'registration' ? 'white' : '#3b82f6',
                    border: '1px solid #3b82f6',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Registration Phase
                </button>
                <button
                  onClick={() => setPhase('commit')}
                  style={{
                    padding: '8px 16px',
                    background: phase === 'commit' ? '#f59e0b' : 'white',
                    color: phase === 'commit' ? 'white' : '#f59e0b',
                    border: '1px solid #f59e0b',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Commit Phase
                </button>
                <button
                  onClick={() => setPhase('reveal')}
                  style={{
                    padding: '8px 16px',
                    background: phase === 'reveal' ? '#f97316' : 'white',
                    color: phase === 'reveal' ? 'white' : '#f97316',
                    border: '1px solid #f97316',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}
                >
                  Reveal Phase
                </button>
                <button
                  onClick={() => setPhase('completed')}
                  style={{
                    padding: '8px 16px',
                    background: phase === 'completed' ? '#10b981' : 'white',
                    color: phase === 'completed' ? 'white' : '#10b981',
                    border: '1px solid #10b981',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '500'
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

export default SimpleVotingDashboard
