import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface EarningHubProps {
  isVisible: boolean;
}

interface EarningOpportunity {
  id: string;
  title: string;
  description: string;
  icon: string;
  earning: number;
  period: string;
  category: 'play' | 'stake' | 'trade' | 'social';
  active: boolean;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  reward: number;
  completed: boolean;
  progress: number;
  target: number;
}

export const EarningHub: React.FC<EarningHubProps> = ({ isVisible }) => {
  const [activeTab, setActiveTab] = useState<'play' | 'stake' | 'trade' | 'social'>('play');
  const [totalEarnings, setTotalEarnings] = useState(2847.32);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  const earningOpportunities: EarningOpportunity[] = [
    {
      id: '1',
      title: 'Land Mining',
      description: 'Earn from your virtual land',
      icon: '⛏️',
      earning: 45.50,
      period: '/hour',
      category: 'play',
      active: true
    },
    {
      id: '2',
      title: 'Casino Wins',
      description: 'Gambling profits',
      icon: '🎰',
      earning: 120.00,
      period: '/day',
      category: 'play',
      active: true
    },
    {
      id: '3',
      title: 'Tournament Prize',
      description: 'Win competitions',
      icon: '🏆',
      earning: 500.00,
      period: '/week',
      category: 'play',
      active: false
    },
    {
      id: '4',
      title: 'ETH Staking',
      description: 'Stake your crypto',
      icon: '💎',
      earning: 8.5,
      period: '% APY',
      category: 'stake',
      active: true
    },
    {
      id: '5',
      title: 'LP Rewards',
      description: 'Liquidity providing',
      icon: '🏊',
      earning: 15.2,
      period: '% APY',
      category: 'stake',
      active: true
    },
    {
      id: '6',
      title: 'NFT Trading',
      description: 'Buy low, sell high',
      icon: '🎨',
      earning: 234.50,
      period: '/trade',
      category: 'trade',
      active: true
    },
    {
      id: '7',
      title: 'Land Flipping',
      description: 'Real estate profits',
      icon: '🏘️',
      earning: 1200.00,
      period: '/flip',
      category: 'trade',
      active: true
    },
    {
      id: '8',
      title: 'Referral Bonus',
      description: 'Invite friends',
      icon: '👥',
      earning: 50.00,
      period: '/friend',
      category: 'social',
      active: true
    },
    {
      id: '9',
      title: 'Content Creation',
      description: 'Share experiences',
      icon: '📸',
      earning: 25.00,
      period: '/post',
      category: 'social',
      active: true
    }
  ];

  useEffect(() => {
    // Initialize achievements
    const initialAchievements: Achievement[] = [
      {
        id: '1',
        title: 'First Land Owner',
        description: 'Purchase your first piece of virtual land',
        icon: '🏡',
        reward: 100,
        completed: true,
        progress: 1,
        target: 1
      },
      {
        id: '2',
        title: 'High Roller',
        description: 'Win $1000 in casino games',
        icon: '🎲',
        reward: 500,
        completed: false,
        progress: 340,
        target: 1000
      },
      {
        id: '3',
        title: 'Social Butterfly',
        description: 'Refer 10 friends to the metaverse',
        icon: '🦋',
        reward: 200,
        completed: false,
        progress: 3,
        target: 10
      },
      {
        id: '4',
        title: 'Crypto Millionaire',
        description: 'Earn $10,000 total',
        icon: '💰',
        reward: 1000,
        completed: false,
        progress: 2847,
        target: 10000
      }
    ];
    setAchievements(initialAchievements);

    // Simulate earnings increase
    const interval = setInterval(() => {
      setTotalEarnings(prev => prev + Math.random() * 2);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const claimDailyReward = () => {
    const streakBonus = dailyStreak * 10;
    const baseReward = 50;
    const totalReward = baseReward + streakBonus;
    
    setTotalEarnings(prev => prev + totalReward);
    setDailyStreak(prev => prev + 1);
  };

  const activateEarning = (id: string) => {
    // Activate earning opportunity logic
    console.log('Activating earning:', id);
  };

  const filteredOpportunities = earningOpportunities.filter(opp => opp.category === activeTab);

  if (!isVisible) return null;

  return (
    <motion.div
      className="earning-hub"
      initial={{ opacity: 0, y: -50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      <div className="earning-header">
        <div className="total-earnings">
          <div className="earnings-label">Total Earnings</div>
          <div className="earnings-amount">${totalEarnings.toLocaleString()}</div>
        </div>
        <div className="daily-streak">
          <div className="streak-label">Daily Streak</div>
          <div className="streak-count">🔥 {dailyStreak} days</div>
        </div>
      </div>

      <div className="daily-reward-section">
        <button className="daily-reward-btn" onClick={claimDailyReward}>
          🎁 Claim Daily Reward (+${50 + dailyStreak * 10})
        </button>
      </div>

      <div className="earning-tabs">
        {(['play', 'stake', 'trade', 'social'] as const).map(tab => (
          <button
            key={tab}
            className={`earning-tab ${activeTab === tab ? 'active' : ''}`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === 'play' && '🎮 Play to Earn'}
            {tab === 'stake' && '💎 Stake & Earn'}
            {tab === 'trade' && '📈 Trade & Profit'}
            {tab === 'social' && '👥 Social Rewards'}
          </button>
        ))}
      </div>

      <div className="earning-opportunities">
        <AnimatePresence mode="wait">
          {filteredOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              className={`earning-card ${opportunity.active ? 'active' : ''}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => activateEarning(opportunity.id)}
            >
              <div className="earning-icon">{opportunity.icon}</div>
              <div className="earning-title">{opportunity.title}</div>
              <div className="earning-amount">
                {opportunity.period.includes('%') ? 
                  `${opportunity.earning}${opportunity.period}` : 
                  `$${opportunity.earning}${opportunity.period}`
                }
              </div>
              <div className="earning-period">{opportunity.description}</div>
              {opportunity.active && (
                <div className="earning-status">✅ Active</div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="achievements-section">
        <div className="achievements-header">🏆 Achievements</div>
        <div className="achievements-list">
          {achievements.map(achievement => (
            <div 
              key={achievement.id} 
              className={`achievement-item ${achievement.completed ? 'completed' : ''}`}
            >
              <div className="achievement-icon">{achievement.icon}</div>
              <div className="achievement-info">
                <div className="achievement-title">{achievement.title}</div>
                <div className="achievement-description">{achievement.description}</div>
                <div className="achievement-progress">
                  <div 
                    className="progress-bar"
                    style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                  />
                  <div className="progress-text">
                    {achievement.progress}/{achievement.target}
                  </div>
                </div>
              </div>
              <div className="achievement-reward">
                +${achievement.reward}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="leaderboard-section">
        <div className="leaderboard-header">🥇 Top Earners</div>
        <div className="leaderboard-list">
          {[
            { name: 'CryptoKing', earnings: 45234 },
            { name: 'MetaQueen', earnings: 38901 },
            { name: 'LandLord', earnings: 32567 },
            { name: 'You', earnings: Math.floor(totalEarnings) },
            { name: 'CasinoAce', earnings: 28443 }
          ].sort((a, b) => b.earnings - a.earnings).map((player, index) => (
            <div 
              key={player.name} 
              className={`leaderboard-item ${player.name === 'You' ? 'current-user' : ''}`}
            >
              <div className="rank">#{index + 1}</div>
              <div className="player-name">{player.name}</div>
              <div className="player-earnings">${player.earnings.toLocaleString()}</div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};
