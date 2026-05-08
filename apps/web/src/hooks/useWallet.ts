import { useState } from 'react'

type WalletState = {
  address?: string
  token?: string
}

export function useWallet() {
  const [state, setState] = useState<WalletState>({})

  const connectAndSign = async () => {
    if (typeof (window as any).ethereum === 'undefined') {
      throw new Error('No ethereum provider found')
    }

    const ethereum = (window as any).ethereum
    const accounts: string[] = await ethereum.request({ method: 'eth_requestAccounts' })
    const address = accounts && accounts.length ? accounts[0] : undefined
    if (!address) throw new Error('No account')

    const timestamp = Date.now()
    const message = `Sign-in to Meta_The_World at ${timestamp}`

    // Request personal_sign via provider
    const signature: string = await ethereum.request({
      method: 'personal_sign',
      params: [message, address]
    })

    // Exchange signature for JWT from local auth server
    try {
      const resp = await fetch('http://localhost:4000/auth/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address, message, signature })
      })

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}))
        throw new Error(err.error || 'exchange failed')
      }

      const data = await resp.json()
      const token = data.token
      localStorage.setItem('mtw_token', token)
      localStorage.setItem('mtw_addr', address)
      setState({ address, token })
      return { address, token }
    } catch (e) {
      console.error('Exchange failed', e)
      // still set local signature fallback
      localStorage.setItem('mtw_signature', signature)
      setState({ address })
      return { address }
    }
  }

  return { ...state, connectAndSign }
}

export default useWallet
