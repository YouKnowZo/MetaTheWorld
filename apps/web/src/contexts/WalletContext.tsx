import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserProvider, formatEther, parseEther } from 'ethers';
import { useGameStore } from '../store';

interface Transaction {
  id: string;
  type: 'send' | 'receive';
  amount: number;
  currency: string;
  address: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: Date;
  hash?: string;
}

interface WalletContextType {
  address: string | null;
  balanceEth: string;
  balanceUsd: number;
  transactions: Transaction[];
  isConnecting: boolean;
  connectWallet: () => Promise<void>;
  sendTransaction: (to: string, amount: string, currency: string) => Promise<boolean>;
  token: string | null;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const ETH_USD_RATE = 3300; // Static generic rate for simplicity

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [address, setAddress] = useState<string | null>(null);
  const [balanceEth, setBalanceEth] = useState<string>('0');
  const [balanceUsd, setBalanceUsd] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isConnecting, setIsConnecting] = useState(false);
  const [provider, setProvider] = useState<BrowserProvider | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('meta_token'));

  // Initialize provider and check if already connected
  useEffect(() => {
    const init = async () => {
      const eth = (window as any).ethereum;
      if (eth) {
        const newProvider = new BrowserProvider(eth);
        setProvider(newProvider);
        
        try {
          const accounts = await newProvider.listAccounts();
          if (accounts.length > 0) {
            const currentAddress = accounts[0].address;
            setAddress(currentAddress);
            updateBalance(newProvider, currentAddress);
          }
        } catch (error) {
          console.error("Failed to list accounts on init:", error);
        }

        // Listen for account changes
        if (eth.on) {
          eth.on('accountsChanged', (accounts: string[]) => {
            if (accounts.length > 0) {
              setAddress(accounts[0]);
              updateBalance(newProvider, accounts[0]);
              // When account changes, we should clear token and disconnect if not matching
              setToken(null);
              localStorage.removeItem('meta_token');
            } else {
              setAddress(null);
              setBalanceEth('0');
              setBalanceUsd(0);
              setToken(null);
              localStorage.removeItem('meta_token');
            }
          });
        }
      }
    };
    init();

    return () => {
      const eth = (window as any).ethereum;
      if (eth && eth.removeListener) {
        eth.removeAllListeners('accountsChanged');
      }
    };
  }, []);

  const updateBalance = async (prov: BrowserProvider, addr: string) => {
    try {
      const balanceWei = await prov.getBalance(addr);
      const formattedBalance = formatEther(balanceWei);
      setBalanceEth(parseFloat(formattedBalance || '0').toFixed(4));
      setBalanceUsd(parseFloat(formattedBalance) * ETH_USD_RATE);
    } catch (error) {
      console.error("Failed to fetch balance:", error);
    }
  };

  const connectWallet = async () => {
    setIsConnecting(true);
    try {
      const eth = (window as any).ethereum;
      if (!eth) {
        throw new Error("MetaMask or Web3 provider not found. Please install a wallet.");
      }
      
      const newProvider = new BrowserProvider(eth);
      setProvider(newProvider);

      const accounts = await newProvider.send('eth_requestAccounts', []);
      if (accounts && accounts.length > 0) {
        const activeAddress = accounts[0];
        setAddress(activeAddress);
        await updateBalance(newProvider, activeAddress);

        // Authenticate with backend
        const signer = await newProvider.getSigner();
        const message = "Login to Meta The World";
        const signature = await signer.signMessage(message);

        const res = await fetch('http://localhost:4000/auth/exchange', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ address: activeAddress, message, signature })
        });
        
        if (res.ok) {
          const data = await res.json();
          setToken(data.token);
          localStorage.setItem('meta_token', data.token);
          
          // Optional: initialize the global game store
          if (data.user) {
            useGameStore.getState().setCurrentUser(data.user);
            useGameStore.getState().syncBackend();
          }
        } else {
          console.error("Backend auth failed", await res.text());
        }
      }
    } catch (error) {
      console.error("Connection failed:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  };

  const sendTransaction = async (to: string, amount: string, currency: string) => {
    if (!provider || !address) {
      console.error("Wallet not connected");
      return false;
    }

    const newTx: Transaction = {
      id: Date.now().toString(),
      type: 'send',
      amount: parseFloat(amount),
      currency,
      address: to,
      status: 'pending',
      timestamp: new Date(),
    };

    setTransactions(prev => [newTx, ...prev]);

    try {
      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to,
        value: parseEther(amount)
      });
      
      // Update pending tx with hash
      setTransactions(prev => 
        prev.map(t => t.id === newTx.id ? { ...t, hash: tx.hash } : t)
      );

      // Wait for confirmation
      const receipt = await tx.wait();
      
      setTransactions(prev => 
        prev.map(t => t.id === newTx.id ? { ...t, status: receipt && receipt.status === 1 ? 'confirmed' : 'failed' } : t)
      );
      
      // Update balance
      await updateBalance(provider, address);
      return receipt !== null && receipt.status === 1;
    } catch (error) {
      console.error("Transaction failed:", error);
      setTransactions(prev => 
        prev.map(t => t.id === newTx.id ? { ...t, status: 'failed' } : t)
      );
      return false;
    }
  };

  return (
    <WalletContext.Provider value={{
      address,
      balanceEth,
      balanceUsd,
      transactions,
      isConnecting,
      connectWallet,
      sendTransaction,
      token
    }}>
      {children}
    </WalletContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWalletContext must be used within a WalletProvider');
  }
  return context;
};
