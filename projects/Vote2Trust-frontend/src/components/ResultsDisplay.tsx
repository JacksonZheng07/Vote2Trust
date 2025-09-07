import React, { useState, useEffect } from 'react'
import { Poll } from './VotingDashboard'

interface ResultsDisplayProps {
  poll: Poll
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ poll }) => {
  const [results, setResults] = useState<{ [option: string]: number }>({})
  const [totalVotes, setTotalVotes] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading results from blockchain
    const loadResults = async () => {
      setLoading(true)
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock results - in real implementation, this would come from smart contract
      const mockResults = {
        'Yes': 45,
        'No': 32,
        'Abstain': 8
      }
      
      setResults(mockResults)
      setTotalVotes(Object.values(mockResults).reduce((sum, count) => sum + count, 0))
      setLoading(false)
    }

    loadResults()
  }, [poll.id])

  const getPercentage = (votes: number) => {
    if (totalVotes === 0) return 0
    return Math.round((votes / totalVotes) * 100)
  }

  const getWinningOption = () => {
    if (Object.keys(results).length === 0) return null
    return Object.entries(results).reduce((a, b) => results[a[0]] > results[b[0]] ? a : b)[0]
  }

  const winningOption = getWinningOption()

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <div className="text-center">
          <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="loading loading-spinner loading-lg text-purple-600"></span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">Loading Results</h3>
          <p className="text-gray-600">Fetching final vote tally from the blockchain...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        
        <h3 className="text-3xl font-bold text-gray-900 mb-2">Voting Results</h3>
        <p className="text-gray-600 mb-4">
          Final tally for: <strong>{poll.title}</strong>
        </p>
        
        {winningOption && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-center space-x-2 text-green-800">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-lg font-semibold">Winner: {winningOption}</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              {results[winningOption]} votes ({getPercentage(results[winningOption])}%)
            </p>
          </div>
        )}
      </div>

      {/* Results Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{totalVotes}</div>
          <div className="text-sm text-gray-600">Total Votes</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">{poll.options.length}</div>
          <div className="text-sm text-gray-600">Options</div>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-gray-900">
            {winningOption ? getPercentage(results[winningOption]) : 0}%
          </div>
          <div className="text-sm text-gray-600">Winning Margin</div>
        </div>
      </div>

      {/* Detailed Results */}
      <div className="space-y-4">
        <h4 className="text-lg font-semibold text-gray-900">Detailed Results</h4>
        {poll.options.map((option, index) => {
          const votes = results[option] || 0
          const percentage = getPercentage(votes)
          const isWinner = option === winningOption
          
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
              
              {/* Progress Bar */}
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

      {/* Blockchain Verification */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <div className="flex items-center space-x-2 text-blue-800 mb-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="font-medium">Blockchain Verification</span>
        </div>
        <p className="text-sm text-blue-700 mb-3">
          These results are verified on the blockchain and cannot be tampered with. 
          All votes were committed and revealed through the secure commit-reveal process.
        </p>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Votes Committed</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Votes Revealed</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Hash Verified</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">✓ Results Final</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3">
        <button className="btn btn-outline flex-1">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Download Results
        </button>
        <button className="btn btn-primary flex-1">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          View on Blockchain
        </button>
      </div>
    </div>
  )
}

export default ResultsDisplay
