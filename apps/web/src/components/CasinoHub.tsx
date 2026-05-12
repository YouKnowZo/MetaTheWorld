import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface CasinoHubProps {
  isVisible: boolean;
}

interface GameResult {
  game: string;
  result: 'win' | 'loss';
  amount: number;
  timestamp: Date;
}

interface SlotResult {
  symbols: string[];
  isWinner: boolean;
  payout: number;
}

import { PokerHub } from './PokerHub';

export const CasinoHub: React.FC<CasinoHubProps> = ({ isVisible }) => {
  const [activeGame, setActiveGame] = useState<'lobby' | 'poker'>('lobby');
  const [jackpot, setJackpot] = useState(145782.34);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const [slotResult, setSlotResult] = useState<SlotResult | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [chips, setChips] = useState(1000);
  const [currentBet, setCurrentBet] = useState(10);

  const symbols = ['🍒', '🍋', '🍊', '🔔', '💎', '7️⃣', '🍀', '⭐'];

  useEffect(() => {
    // Increase jackpot progressively
    const interval = setInterval(() => {
      setJackpot(prev => prev + Math.random() * 0.5);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const playSlots = async () => {
    if (chips < currentBet) return;
    
    setIsSpinning(true);
    setChips(prev => prev - currentBet);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const result: SlotResult = {
      symbols: Array.from({ length: 3 }, () => symbols[Math.floor(Math.random() * symbols.length)]),
      isWinner: false,
      payout: 0
    };
    
    // Check for wins
    if (result.symbols[0] === result.symbols[1] && result.symbols[1] === result.symbols[2]) {
      result.isWinner = true;
      if (result.symbols[0] === '💎') {
        result.payout = currentBet * 100; // Diamond jackpot
      } else if (result.symbols[0] === '7️⃣') {
        result.payout = currentBet * 50;
      } else {
        result.payout = currentBet * 10;
      }
      setChips(prev => prev + result.payout);
    }
    
    setSlotResult(result);
    setIsSpinning(false);
    
    const gameResult: GameResult = {
      game: 'slots',
      result: result.isWinner ? 'win' : 'loss',
      amount: result.isWinner ? result.payout - currentBet : -currentBet,
      timestamp: new Date()
    };
    
    setGameResults(prev => [gameResult, ...prev.slice(0, 9)]);
  };

  const playBlackjack = () => {
    if (chips < currentBet) return;
    
    const playerScore = Math.floor(Math.random() * 21) + 1;
    const dealerScore = Math.floor(Math.random() * 21) + 1;
    const isWin = playerScore > dealerScore || (playerScore <= 21 && dealerScore > 21);
    
    setChips(prev => prev + (isWin ? currentBet : -currentBet));
    
    const result: GameResult = {
      game: 'blackjack',
      result: isWin ? 'win' : 'loss',
      amount: isWin ? currentBet : -currentBet,
      timestamp: new Date()
    };
    
    setGameResults(prev => [result, ...prev.slice(0, 9)]);
  };

  const playRoulette = () => {
    if (chips < currentBet) return;
    
    Math.floor(Math.random() * 37); // 0-36 random number for roulette
    const isWin = Math.random() > 0.5; // Simplified
    const payout = isWin ? currentBet * 2 : 0;
    
    setChips(prev => prev + payout - currentBet);
    
    const result: GameResult = {
      game: 'roulette',
      result: isWin ? 'win' : 'loss',
      amount: isWin ? payout - currentBet : -currentBet,
      timestamp: new Date()
    };
    
    setGameResults(prev => [result, ...prev.slice(0, 9)]);
  };

  const placeSportsBet = () => {
    if (chips < currentBet) return;
    
    const isWin = Math.random() > 0.4; // 60% win chance
    const payout = isWin ? currentBet * 1.8 : 0;
    
    setChips(prev => prev + payout - currentBet);
    
    const result: GameResult = {
      game: 'sports',
      result: isWin ? 'win' : 'loss',
      amount: isWin ? payout - currentBet : -currentBet,
      timestamp: new Date()
    };
    
    setGameResults(prev => [result, ...prev.slice(0, 9)]);
  };

  if (!isVisible) return null;

  return (
    <motion.div
      className="casino-container"
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="casino-header">
        <div className="casino-title">🎰 METAVERSE CASINO</div>
        {activeGame !== 'lobby' && (
          <button 
            className="back-btn glass-panel"
            onClick={() => setActiveGame('lobby')}
            style={{ 
              padding: '0.5rem 1rem', 
              color: 'var(--neon-cyan)', 
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            ← BACK TO LOBBY
          </button>
        )}
      </div>

      {activeGame === 'poker' ? (
        <div style={{ padding: '1rem 0' }}>
          <PokerHub />
        </div>
      ) : (
        <>

      <div className="jackpot-display">
        <div>💰 Progressive Jackpot</div>
        <div className="jackpot-amount">${jackpot.toLocaleString()}</div>
      </div>

      <div className="casino-stats">
        <div className="casino-stat">
          <div className="stat-label">Your Chips</div>
          <div className="stat-value">{chips.toLocaleString()}</div>
        </div>
        <div className="casino-stat">
          <div className="stat-label">Current Bet</div>
          <div className="stat-value">${currentBet}</div>
        </div>
      </div>

      <div className="bet-controls">
        <button 
          className="bet-btn"
          onClick={() => setCurrentBet(Math.max(1, currentBet - 5))}
        >
          -$5
        </button>
        <button 
          className="bet-btn"
          onClick={() => setCurrentBet(currentBet + 5)}
        >
          +$5
        </button>
        <button 
          className="bet-btn max-bet"
          onClick={() => setCurrentBet(100)}
        >
          MAX BET
        </button>
      </div>

      {/* Slot Machine */}
      <div className="slot-machine">
        <div className="slot-reels">
          {slotResult ? (
            slotResult.symbols.map((symbol, index) => (
              <div key={index} className="slot-reel">
                <div className="slot-symbol">{symbol}</div>
              </div>
            ))
          ) : (
            Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="slot-reel">
                <div className={`slot-symbol ${isSpinning ? 'spinning' : ''}`}>
                  {symbols[Math.floor(Math.random() * symbols.length)]}
                </div>
              </div>
            ))
          )}
        </div>
        
        {slotResult?.isWinner && (
          <motion.div
            className="win-notification"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
          >
            🎉 WIN! +${slotResult.payout}
          </motion.div>
        )}
        
        <button 
          className="spin-btn"
          onClick={playSlots}
          disabled={isSpinning || chips < currentBet}
        >
          {isSpinning ? 'SPINNING...' : 'SPIN TO WIN'}
        </button>
      </div>

      <div className="casino-games">
        <div className="casino-game" onClick={playBlackjack}>
          <div className="game-icon">🃏</div>
          <div className="game-name">Blackjack</div>
          <div className="game-status">Beat the dealer</div>
        </div>
        
        <div className="casino-game" onClick={playRoulette}>
          <div className="game-icon">🎲</div>
          <div className="game-name">Roulette</div>
          <div className="game-status">Spin & win</div>
        </div>
        
        <div className="casino-game" onClick={placeSportsBet}>
          <div className="game-icon">⚽</div>
          <div className="game-name">Sports Bet</div>
          <div className="game-status">Live betting</div>
        </div>
        
        <div className="casino-game" onClick={() => setActiveGame('poker')}>
          <div className="game-icon">🃏</div>
          <div className="game-name">Poker</div>
          <div className="game-status">Play now</div>
        </div>
      </div>
    </>
  )}

      {/* Recent Results */}
      <div className="recent-results">
        <div className="results-header">Recent Results</div>
        <div className="results-list">
          {gameResults.slice(0, 5).map((result, index) => (
            <div key={index} className={`result-item ${result.result}`}>
              <span className="result-game">{result.game.toUpperCase()}</span>
              <span className={`result-amount ${result.result}`}>
                {result.amount > 0 ? '+' : ''}${result.amount}
              </span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
