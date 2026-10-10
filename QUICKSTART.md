# ⚡ VoteBlox - Quick Start Guide

This project is fully installed, configured, compiled, and ready to run.

---

## 🚀 1-Step Launch

Open a terminal in the root directory and run:

```bash
npm run dev:all
```

*(Or simply double-click `start.bat` on Windows)*

This concurrently starts:
1. **Ganache Local Blockchain** on `http://127.0.0.1:7545` (Chain ID `1337`)
2. **Express Server & SQLite Database** on `http://localhost:5000`
3. **React Client** on `http://localhost:3000`

---

## 🦊 MetaMask Configuration

To interact with the smart contracts in the browser:

1. Open your MetaMask extension.
2. Click the network dropdown -> **Add a network** -> **Add a network manually**:
   - **Network Name**: `Ganache Local`
   - **New RPC URL**: `http://127.0.0.1:7545`
   - **Chain ID**: `1337`
   - **Currency Symbol**: `ETH`
3. Import one or more test accounts using their private keys:
   - **Admin / Deployer Account** (`0x90F8bf6A479f320ead074411a4B0e7944Ea8c9C1`):  
     `0x4f3edf983ac636a65a842ce7c78d9aa706d3b113bce9c46f30d7d21715b23b1d`
   - **Voter Account 1** (`0xFFcf8FDEE72ac11b5c542428B35EEF5769C409f0`):  
     `0x6cbed15c793ce57650b9877cf6fa156fbef513c4e6134f022a85b1ffdd59b2a1`
   - **Voter Account 2** (`0x22d491Bde2303f2f43325b2108D26f1eAbA1e32b`):  
     `0x6370fd033278c143179d81c5526140625662b8daa446c22ee2d73db3707e620c`

---

## 🔑 Default Login Credentials

- **Admin Login**: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
  - **Username**: `admin`
  - **Password**: `admin123`
- **User Registration / Login**: [http://localhost:3000/user/register](http://localhost:3000/user/register)
  - In development mode, the OTP is automatically auto-filled in the modal and printed to the server terminal. You do not need to configure an email provider to test locally.

---

## 🛠️ Helpful Commands

| Command | Action |
|---|---|
| `npm run dev:all` | Start local blockchain, backend server, and frontend client concurrently |
| `npm run dev` | Start backend server and frontend client only (if running Ganache GUI separately) |
| `npm run blockchain` | Start only the local Ganache blockchain node |
| `npm run deploy` | Compile and redeploy contracts to Ganache (auto-updates contract address in `.env`) |
| `npm run deploy-fresh` | Redeploy contract and wipe SQLite database for a clean start |

