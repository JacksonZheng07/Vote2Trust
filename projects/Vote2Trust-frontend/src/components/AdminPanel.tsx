import React, { useState } from 'react'
import { useSnackbar } from 'notistack'
import { Poll } from './VotingDashboard'

interface AdminPanelProps {
  poll: Poll
  onUpdatePoll: (poll: Poll) => void
  onClose: () => void
}

const AdminPanel: React.FC<AdminPanelProps> = ({ poll, onUpdatePoll, onClose }) => {
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [newPollTitle, setNewPollTitle] = useState('')
  const [newPollDescription, setNewPollDescription] = useState('')
  const [newPollOptions, setNewPollOptions] = useState<string[]>(['', '', ''])

  const updatePollPhase = async (newPhase: Poll['phase']) => {
    setLoading(true)
    try {
      // In a real implementation, this would call smart contract functions
      enqueueSnackbar(`Updating poll phase to ${newPhase}...`, { variant: 'info' })
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      onUpdatePoll({ ...poll, phase: newPhase })
      enqueueSnackbar(`Poll phase updated to ${newPhase}`, { variant: 'success' })
    } catch (error) {
      enqueueSnackbar('Failed to update poll phase', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const createNewPoll = async () => {
    if (!newPollTitle.trim() || !newPollDescription.trim()) {
      enqueueSnackbar('Please fill in all required fields', { variant: 'warning' })
      return
    }

    const validOptions = newPollOptions.filter(option => option.trim() !== '')
    if (validOptions.length < 2) {
      enqueueSnackbar('Please provide at least 2 voting options', { variant: 'warning' })
      return
    }

    setLoading(true)
    try {
      // In a real implementation, this would deploy a new smart contract
      enqueueSnackbar('Creating new poll...', { variant: 'info' })
      
      // Simulate blockchain transaction
      await new Promise(resolve => setTimeout(resolve, 3000))
      
      const newPoll: Poll = {
        id: `poll-${Date.now()}`,
        title: newPollTitle,
        description: newPollDescription,
        options: validOptions,
        phase: 'registration',
        startTime: new Date(),
        commitEndTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
        revealEndTime: new Date(Date.now() + 48 * 60 * 60 * 1000),
        totalVotes: 0,
        isRegistered: false,
        hasCommitted: false,
        hasRevealed: false
      }
      
      onUpdatePoll(newPoll)
      enqueueSnackbar('New poll created successfully!', { variant: 'success' })
      
      // Reset form
      setNewPollTitle('')
      setNewPollDescription('')
      setNewPollOptions(['', '', ''])
    } catch (error) {
      enqueueSnackbar('Failed to create new poll', { variant: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const addOption = () => {
    setNewPollOptions([...newPollOptions, ''])
  }

  const removeOption = (index: number) => {
    if (newPollOptions.length > 2) {
      setNewPollOptions(newPollOptions.filter((_, i) => i !== index))
    }
  }

  const updateOption = (index: number, value: string) => {
    const updated = [...newPollOptions]
    updated[index] = value
    setNewPollOptions(updated)
  }

  const getPhaseButtonColor = (phase: Poll['phase']) => {
    switch (phase) {
      case 'registration': return 'btn-info'
      case 'commit': return 'btn-warning'
      case 'reveal': return 'btn-error'
      case 'tally': return 'btn-secondary'
      case 'completed': return 'btn-success'
      default: return 'btn-outline'
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
              <p className="text-gray-600">Manage voting polls and phases</p>
            </div>
            <button
              onClick={onClose}
              className="btn btn-ghost btn-circle"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Current Poll Management */}
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Poll Management</h3>
                
                <div className="mb-4">
                  <div className="text-sm text-gray-600 mb-2">Current Poll:</div>
                  <div className="font-medium text-gray-900">{poll.title}</div>
                  <div className="text-sm text-gray-500">Phase: {poll.phase}</div>
                </div>

                <div className="space-y-2">
                  <div className="text-sm font-medium text-gray-700">Change Poll Phase:</div>
                  <div className="grid grid-cols-2 gap-2">
                    {(['registration', 'commit', 'reveal', 'tally', 'completed'] as Poll['phase'][]).map((phase) => (
                      <button
                        key={phase}
                        onClick={() => updatePollPhase(phase)}
                        disabled={loading || poll.phase === phase}
                        className={`btn btn-sm ${getPhaseButtonColor(phase)} ${poll.phase === phase ? 'btn-disabled' : ''}`}
                      >
                        {loading ? (
                          <span className="loading loading-spinner loading-xs"></span>
                        ) : (
                          phase.charAt(0).toUpperCase() + phase.slice(1)
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Poll Statistics */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Poll Statistics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{poll.totalVotes}</div>
                    <div className="text-sm text-gray-600">Total Votes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">{poll.options.length}</div>
                    <div className="text-sm text-gray-600">Options</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Create New Poll */}
            <div className="space-y-6">
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Create New Poll</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Poll Title *
                    </label>
                    <input
                      type="text"
                      value={newPollTitle}
                      onChange={(e) => setNewPollTitle(e.target.value)}
                      placeholder="Enter poll title"
                      className="input input-bordered w-full"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={newPollDescription}
                      onChange={(e) => setNewPollDescription(e.target.value)}
                      placeholder="Enter poll description"
                      className="textarea textarea-bordered w-full h-20"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Voting Options *
                    </label>
                    <div className="space-y-2">
                      {newPollOptions.map((option, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, e.target.value)}
                            placeholder={`Option ${index + 1}`}
                            className="input input-bordered flex-1"
                          />
                          {newPollOptions.length > 2 && (
                            <button
                              onClick={() => removeOption(index)}
                              className="btn btn-ghost btn-sm text-red-600"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={addOption}
                      className="btn btn-outline btn-sm mt-2"
                    >
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Option
                    </button>
                  </div>

                  <button
                    onClick={createNewPoll}
                    disabled={loading}
                    className="btn btn-primary w-full"
                  >
                    {loading ? (
                      <>
                        <span className="loading loading-spinner loading-sm"></span>
                        Creating Poll...
                      </>
                    ) : (
                      'Create New Poll'
                    )}
                  </button>
                </div>
              </div>

              {/* Admin Actions */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Admin Actions</h3>
                <div className="space-y-2">
                  <button className="btn btn-outline w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export Results
                  </button>
                  <button className="btn btn-outline w-full">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    System Settings
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
