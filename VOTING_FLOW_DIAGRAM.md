# 🔒 Commit-Reveal Voting Flow Diagram

## 📊 **Visual Flow of Your Vote2Trust Platform**

```
┌─────────────────────────────────────────────────────────────────┐
│                    🗳️ VOTE2TRUST PLATFORM                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   👤 VOTER      │    │   🤖 CONTRACT   │    │   🌐 BLOCKCHAIN │
└─────────────────┘    └─────────────────┘    └─────────────────┘

        │                       │                       │
        │ 1. Connect Wallet     │                       │
        ├──────────────────────►│                       │
        │                       │                       │
        │ 2. Register           │                       │
        ├──────────────────────►│                       │
        │                       │                       │
        │ 3. COMMIT PHASE 🔒    │                       │
        │                       │                       │
        │ Vote: "Yes"           │                       │
        │ Salt: "abc123"        │                       │
        │ Hash: "a1b2c3..."     │                       │
        ├──────────────────────►│                       │
        │                       │ Store Hash            │
        │                       ├──────────────────────►│
        │                       │                       │
        │ 4. REVEAL PHASE 🔓    │                       │
        │                       │                       │
        │ Vote: "Yes"           │                       │
        │ Salt: "abc123"        │                       │
        ├──────────────────────►│                       │
        │                       │ Verify Hash           │
        │                       │ ✅ Valid!             │
        │                       │ Count Vote            │
        │                       ├──────────────────────►│
        │                       │                       │
        │ 5. RESULTS 📊         │                       │
        │                       │                       │
        │ View Final Counts     │◄──────────────────────┤
        │ Yes: 1, No: 0, etc.   │                       │
        │                       │                       │
```

## 🔐 **Security Flow**

```
COMMIT PHASE (Hidden):
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   VOTER     │    │   CONTRACT  │    │  BLOCKCHAIN │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │ Vote: "Yes"       │                   │
       │ Salt: "secret"    │                   │
       │                   │                   │
       │ Hash = f(Yes + secret)                │
       │ = "a1b2c3d4..."   │                   │
       ├──────────────────►│                   │
       │                   │ Store Hash        │
       │                   ├──────────────────►│
       │                   │                   │
       │ 🔒 VOTE HIDDEN!   │ 🔒 VOTE HIDDEN!   │ 🔒 VOTE HIDDEN! │
       │                   │                   │

REVEAL PHASE (Open):
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   VOTER     │    │   CONTRACT  │    │  BLOCKCHAIN │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       │ Vote: "Yes"       │                   │
       │ Salt: "secret"    │                   │
       ├──────────────────►│                   │
       │                   │ Verify:           │
       │                   │ f(Yes + secret)   │
       │                   │ == "a1b2c3d4..."  │
       │                   │ ✅ MATCH!         │
       │                   │ Count Vote        │
       │                   ├──────────────────►│
       │                   │                   │
       │ 🔓 VOTE REVEALED! │ 🔓 VOTE COUNTED!  │ 🔓 VOTE STORED! │
       │                   │                   │
```

## 🎯 **Your Platform Implementation**

### **What Happens in Your UI:**

1. **Registration**: User connects wallet and registers
2. **Commit**: User selects vote + enters salt → Hash created
3. **Reveal**: User enters same vote + salt → Hash verified
4. **Results**: Valid votes counted and displayed

### **Security Features:**
- ✅ **Vote secrecy** during commit phase
- ✅ **Hash verification** prevents cheating
- ✅ **Blockchain immutability** ensures integrity
- ✅ **Transparent results** anyone can verify

## 🚀 **Test It Now!**

**Go to: http://localhost:5173**

**Try the complete flow and see the commit-reveal logic in action!**
