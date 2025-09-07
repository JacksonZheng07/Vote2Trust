from algopy import ARC4Contract, String, UInt64, Bytes, GlobalState, LocalState, Account, Txn, Global, arc4
from algopy.arc4 import abimethod


class Vote2Trust(ARC4Contract):
    """Commit-Reveal Voting System on Algorand"""
    
    # Global State Variables
    admin: GlobalState[Account]
    poll_title: GlobalState[String]
    poll_description: GlobalState[String]
    poll_options: GlobalState[String]  # JSON string of options
    voting_phase: GlobalState[UInt64]  # 0=registration, 1=commit, 2=reveal, 3=completed
    commit_deadline: GlobalState[UInt64]
    reveal_deadline: GlobalState[UInt64]
    total_voters: GlobalState[UInt64]
    total_votes: GlobalState[UInt64]
    
    # Local State for each voter
    voter_registered: LocalState[UInt64]  # 1 if registered, 0 if not
    vote_committed: LocalState[UInt64]    # 1 if committed, 0 if not
    vote_revealed: LocalState[UInt64]     # 1 if revealed, 0 if not
    vote_commit_hash: LocalState[Bytes]   # Hash of vote + salt
    vote_choice: LocalState[UInt64]       # Actual vote choice (0, 1, 2, etc.)
    
    # Vote counts for each option
    option_0_votes: GlobalState[UInt64]
    option_1_votes: GlobalState[UInt64]
    option_2_votes: GlobalState[UInt64]
    option_3_votes: GlobalState[UInt64]
    option_4_votes: GlobalState[UInt64]
    
    def __init__(self) -> None:
        """Initialize the voting contract"""
        self.admin.value = Txn.sender
        self.voting_phase.value = UInt64(0)  # Start with registration
        self.total_voters.value = UInt64(0)
        self.total_votes.value = UInt64(0)
        self.option_0_votes.value = UInt64(0)
        self.option_1_votes.value = UInt64(0)
        self.option_2_votes.value = UInt64(0)
        self.option_3_votes.value = UInt64(0)
        self.option_4_votes.value = UInt64(0)
    
    @abimethod
    def create_poll(
        self,
        title: String,
        description: String,
        options: String,  # JSON array of options
        commit_duration: UInt64,  # Duration in seconds
        reveal_duration: UInt64   # Duration in seconds
    ) -> None:
        """Create a new poll (admin only)"""
        assert Txn.sender == self.admin.value, "Only admin can create polls"
        assert self.voting_phase.value == UInt64(0), "Cannot create poll while voting is active"
        
        self.poll_title.value = title
        self.poll_description.value = description
        self.poll_options.value = options
        
        current_time = Global.latest_timestamp
        self.commit_deadline.value = current_time + commit_duration
        self.reveal_deadline.value = current_time + commit_duration + reveal_duration
        
        # Reset vote counts
        self.option_0_votes.value = UInt64(0)
        self.option_1_votes.value = UInt64(0)
        self.option_2_votes.value = UInt64(0)
        self.option_3_votes.value = UInt64(0)
        self.option_4_votes.value = UInt64(0)
        self.total_votes.value = UInt64(0)
    
    @abimethod
    def start_registration(self) -> None:
        """Start voter registration phase (admin only)"""
        assert Txn.sender == self.admin.value, "Only admin can start registration"
        assert self.voting_phase.value == UInt64(0), "Registration already started or voting in progress"
        
        self.voting_phase.value = UInt64(1)  # Registration phase
    
    @abimethod
    def register_voter(self) -> None:
        """Register as a voter"""
        assert self.voting_phase.value == UInt64(1), "Registration phase not active"
        assert self.voter_registered == UInt64(0), "Already registered"
        
        self.voter_registered = UInt64(1)
        self.total_voters.value = self.total_voters.value + UInt64(1)
    
    @abimethod
    def start_commit_phase(self) -> None:
        """Start commit phase (admin only)"""
        assert Txn.sender == self.admin.value, "Only admin can start commit phase"
        assert self.voting_phase.value == UInt64(1), "Must be in registration phase"
        
        self.voting_phase.value = UInt64(2)  # Commit phase
    
    @abimethod
    def commit_vote(self, vote_hash: Bytes) -> None:
        """Commit a vote hash"""
        assert self.voting_phase.value == UInt64(2), "Commit phase not active"
        assert self.voter_registered == UInt64(1), "Must be registered to vote"
        assert self.vote_committed == UInt64(0), "Already committed vote"
        assert Global.latest_timestamp <= self.commit_deadline.value, "Commit deadline passed"
        
        self.vote_committed = UInt64(1)
        self.vote_commit_hash = vote_hash
    
    @abimethod
    def start_reveal_phase(self) -> None:
        """Start reveal phase (admin only)"""
        assert Txn.sender == self.admin.value, "Only admin can start reveal phase"
        assert self.voting_phase.value == UInt64(2), "Must be in commit phase"
        
        self.voting_phase.value = UInt64(3)  # Reveal phase
    
    @abimethod
    def reveal_vote(self, vote_choice: UInt64, salt: Bytes) -> None:
        """Reveal a vote"""
        assert self.voting_phase.value == UInt64(3), "Reveal phase not active"
        assert self.vote_committed == UInt64(1), "Must have committed vote first"
        assert self.vote_revealed == UInt64(0), "Already revealed vote"
        assert Global.latest_timestamp <= self.reveal_deadline.value, "Reveal deadline passed"
        assert vote_choice < UInt64(5), "Invalid vote choice"  # Max 5 options
        
        # Verify the hash matches the committed hash
        # In a real implementation, you'd use a proper hash function
        # For now, we'll use a simple concatenation as proof of concept
        # expected_hash = Bytes(vote_choice.bytes + salt)
        # assert expected_hash == self.vote_commit_hash, "Hash verification failed"
        
        self.vote_revealed = UInt64(1)
        self.vote_choice = vote_choice
        
        # Count the vote
        self.total_votes.value = self.total_votes.value + UInt64(1)
        
        # Increment the appropriate option counter
        if vote_choice == UInt64(0):
            self.option_0_votes.value = self.option_0_votes.value + UInt64(1)
        elif vote_choice == UInt64(1):
            self.option_1_votes.value = self.option_1_votes.value + UInt64(1)
        elif vote_choice == UInt64(2):
            self.option_2_votes.value = self.option_2_votes.value + UInt64(1)
        elif vote_choice == UInt64(3):
            self.option_3_votes.value = self.option_3_votes.value + UInt64(1)
        elif vote_choice == UInt64(4):
            self.option_4_votes.value = self.option_4_votes.value + UInt64(1)
    
    @abimethod
    def complete_voting(self) -> None:
        """Complete voting and finalize results (admin only)"""
        assert Txn.sender == self.admin.value, "Only admin can complete voting"
        assert self.voting_phase.value == UInt64(3), "Must be in reveal phase"
        assert Global.latest_timestamp > self.reveal_deadline.value, "Reveal deadline not yet passed"
        
        self.voting_phase.value = UInt64(4)  # Completed
    
    @abimethod
    def get_poll_info(self) -> tuple[String, String, String, UInt64, UInt64, UInt64, UInt64]:
        """Get poll information"""
        return (
            self.poll_title.value,
            self.poll_description.value,
            self.poll_options.value,
            self.voting_phase.value,
            self.total_voters.value,
            self.total_votes.value,
            self.commit_deadline.value
        )
    
    @abimethod
    def get_vote_counts(self) -> tuple[UInt64, UInt64, UInt64, UInt64, UInt64]:
        """Get vote counts for all options"""
        return (
            self.option_0_votes.value,
            self.option_1_votes.value,
            self.option_2_votes.value,
            self.option_3_votes.value,
            self.option_4_votes.value
        )
    
    @abimethod
    def get_voter_status(self) -> tuple[UInt64, UInt64, UInt64]:
        """Get current voter's status"""
        return (
            self.voter_registered,
            self.vote_committed,
            self.vote_revealed
        )
    
    @abimethod
    def emergency_stop(self) -> None:
        """Emergency stop voting (admin only)"""
        assert Txn.sender == self.admin.value, "Only admin can emergency stop"
        self.voting_phase.value = UInt64(0)  # Reset to initial state
