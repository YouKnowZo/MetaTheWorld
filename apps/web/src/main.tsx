import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './NewApp.tsx'
import { WalletProvider } from './contexts/WalletContext.tsx'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <WalletProvider>
      <App />
    </WalletProvider>
  </StrictMode>,
)
