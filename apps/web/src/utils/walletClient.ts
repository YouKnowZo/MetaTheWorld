// src/utils/walletClient.ts
import { BrowserProvider } from 'ethers';

let walletClient: BrowserProvider | null = null;

export function getWalletClient(): BrowserProvider {
  if (!walletClient) {
    const eth = (window as any).ethereum;
    if (!eth) {
      throw new Error('Ethereum provider not found');
    }
    walletClient = new BrowserProvider(eth);
  }
  return walletClient;
}
