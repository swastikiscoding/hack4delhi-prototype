# Blockchain Module — Unified Electoral Roll & Voter Mobility

This folder contains the **blockchain layer** of the hackathon prototype
for **Election Synchronization & Unified Electoral Roll**.

It demonstrates how voter registration and inter-state voter migration
can be managed using a **role-based, tamper-proof registry**.

---

## 🧠 Design Philosophy

- Citizens do **not** need crypto wallets
- All on-chain actions are executed by authorized election officials
- Authority follows India’s constitutional hierarchy
- Blockchain is used for **integrity, auditability, and coordination**

---

## 🏗 System Architecture

**Root Authority**
- Election Commission of India (ECI)

**Delegated Authorities**
- State Election Commissions
- Electoral Registration Officers (ERO)
- Booth Level Officers (BLO)

Access is enforced using OpenZeppelin’s `AccessControl`.

---

## 🔄 Voter Lifecycle

1. **Registration**
   - ERO registers a voter (EPIC hash)
   - Duplicate registration is prevented on-chain

2. **Migration Request**
   - ERO initiates migration to another state/constituency
   - Voter is locked (cannot vote during transit)

3. **Verification**
   - BLO performs off-chain address verification
   - BLO confirms on-chain

4. **Approval / Rejection**
   - ERO finalizes migration
   - Registry updates atomically

---

## 🧪 Testing

All critical flows are covered using Foundry tests:

```bash
forge test -vv
