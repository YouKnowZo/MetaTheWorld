import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export interface VirtualLifeProps {
  isVisible: boolean;
}

interface Avatar {
  name: string;
  level: number;
  experience: number;
  health: number;
  energy: number;
  happiness: number;
  wealth: number;
  reputation: number;
}

interface Career {
  id: string;
  name: string;
  level: number;
  salary: number;
  description: string;
  requirements: string[];
}

interface Property {
  id: string;
  name: string;
  type: 'apartment' | 'house' | 'mansion' | 'penthouse';
  value: number;
  monthlyIncome: number;
  owned: boolean;
}

export const VirtualLife: React.FC<VirtualLifeProps> = ({ isVisible }) => {
  const [avatar, setAvatar] = useState<Avatar>({
    name: 'MetaUser',
    level: 12,
    experience: 2340,
    health: 85,
    energy: 70,
    happiness: 90,
    wealth: 25000,
    reputation: 75
  });

  const [activeCareer, setActiveCareer] = useState<Career>({
    id: '1',
    name: 'Crypto Trader',
    level: 3,
    salary: 150,
    description: 'Master the art of digital asset trading',
    requirements: ['Market Analysis', 'Risk Management']
  });

  const [properties, setProperties] = useState<Property[]>([
    {
      id: '1',
      name: 'Downtown Loft',
      type: 'apartment',
      value: 50000,
      monthlyIncome: 500,
      owned: true
    },
    {
      id: '2',
      name: 'Suburban Villa',
      type: 'house',
      value: 120000,
      monthlyIncome: 1200,
      owned: false
    },
    {
      id: '3',
      name: 'Luxury Mansion',
      type: 'mansion',
      value: 500000,
      monthlyIncome: 5000,
      owned: false
    },
    {
      id: '4',
      name: 'Sky Penthouse',
      type: 'penthouse',
      value: 1000000,
      monthlyIncome: 10000,
      owned: false
    }
  ]);

  const careers: Career[] = [
    {
      id: '1',
      name: 'Crypto Trader',
      level: 3,
      salary: 150,
      description: 'Master the art of digital asset trading',
      requirements: ['Market Analysis', 'Risk Management']
    },
    {
      id: '2',
      name: 'NFT Artist',
      level: 1,
      salary: 200,
      description: 'Create and sell digital art',
      requirements: ['Creativity', 'Digital Design']
    },
    {
      id: '3',
      name: 'Metaverse Architect',
      level: 1,
      salary: 300,
      description: 'Design virtual spaces',
      requirements: ['3D Modeling', 'Architecture']
    },
    {
      id: '4',
      name: 'Casino Manager',
      level: 1,
      salary: 400,
      description: 'Run your own casino empire',
      requirements: ['Business Management', 'Gaming Knowledge']
    }
  ];

  useEffect(() => {
    // Simulate life progression
    const interval = setInterval(() => {
      setAvatar(prev => ({
        ...prev,
        experience: prev.experience + Math.floor(Math.random() * 10),
        wealth: prev.wealth + activeCareer.salary,
        energy: Math.max(0, prev.energy - 1),
        health: Math.min(100, prev.health + (Math.random() > 0.7 ? 1 : 0))
      }));
    }, 10000);

    return () => clearInterval(interval);
  }, [activeCareer.salary]);

  const workShift = () => {
    if (avatar.energy < 20) return;
    
    setAvatar(prev => ({
      ...prev,
      energy: prev.energy - 20,
      wealth: prev.wealth + activeCareer.salary,
      experience: prev.experience + 50,
      happiness: prev.happiness + 5
    }));
  };

  const rest = () => {
    setAvatar(prev => ({
      ...prev,
      energy: Math.min(100, prev.energy + 30),
      health: Math.min(100, prev.health + 10)
    }));
  };

  const socialize = () => {
    if (avatar.energy < 10) return;
    
    setAvatar(prev => ({
      ...prev,
      energy: prev.energy - 10,
      happiness: Math.min(100, prev.happiness + 15),
      reputation: Math.min(100, prev.reputation + 5)
    }));
  };

  const buyProperty = (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property || avatar.wealth < property.value) return;
    
    setAvatar(prev => ({
      ...prev,
      wealth: prev.wealth - property.value
    }));
    
    setProperties(prev => 
      prev.map(p => 
        p.id === propertyId ? { ...p, owned: true } : p
      )
    );
  };

  const changeCareer = (career: Career) => {
    setActiveCareer(career);
  };

  const levelUp = () => {
    const expNeeded = avatar.level * 1000;
    if (avatar.experience >= expNeeded) {
      setAvatar(prev => ({
        ...prev,
        level: prev.level + 1,
        experience: prev.experience - expNeeded
      }));
      return true;
    }
    return false;
  };

  // Check for level up
  useEffect(() => {
    const expNeeded = avatar.level * 1000;
    if (avatar.experience >= expNeeded) {
      levelUp();
    }
  }, [avatar.experience, avatar.level, levelUp]);

  if (!isVisible) return null;

  return (
    <motion.div
      className="life-sim-panel"
      initial={{ opacity: 0, x: -100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Avatar Display */}
      <div className="avatar-section">
        <div className="avatar-preview">
          👤
        </div>
        <div className="avatar-info">
          <div className="avatar-name">{avatar.name}</div>
          <div className="avatar-level">Level {avatar.level}</div>
          <div className="experience-bar">
            <div 
              className="exp-fill"
              style={{ width: `${(avatar.experience / (avatar.level * 1000)) * 100}%` }}
            />
            <div className="exp-text">
              XP: {avatar.experience}/{avatar.level * 1000}
            </div>
          </div>
        </div>
      </div>

      {/* Life Stats */}
      <div className="life-stats">
        <div className="life-stat">
          <div className="stat-name">Health</div>
          <div className="stat-bar">
            <div 
              className="stat-fill health-fill"
              style={{ width: `${avatar.health}%` }}
            />
          </div>
          <div className="stat-value">{avatar.health}%</div>
        </div>

        <div className="life-stat">
          <div className="stat-name">Energy</div>
          <div className="stat-bar">
            <div 
              className="stat-fill energy-fill"
              style={{ width: `${avatar.energy}%` }}
            />
          </div>
          <div className="stat-value">{avatar.energy}%</div>
        </div>

        <div className="life-stat">
          <div className="stat-name">Happiness</div>
          <div className="stat-bar">
            <div 
              className="stat-fill happiness-fill"
              style={{ width: `${avatar.happiness}%` }}
            />
          </div>
          <div className="stat-value">{avatar.happiness}%</div>
        </div>

        <div className="life-stat">
          <div className="stat-name">Reputation</div>
          <div className="stat-bar">
            <div 
              className="stat-fill reputation-fill"
              style={{ width: `${avatar.reputation}%` }}
            />
          </div>
          <div className="stat-value">{avatar.reputation}%</div>
        </div>
      </div>

      {/* Wealth Display */}
      <div className="wealth-display">
        <div className="wealth-label">💰 Net Worth</div>
        <div className="wealth-amount">${avatar.wealth.toLocaleString()}</div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button 
          className="action-btn work-btn"
          onClick={workShift}
          disabled={avatar.energy < 20}
        >
          💼 Work (+${activeCareer.salary})
        </button>
        <button 
          className="action-btn rest-btn"
          onClick={rest}
        >
          😴 Rest (+30 Energy)
        </button>
        <button 
          className="action-btn social-btn"
          onClick={socialize}
          disabled={avatar.energy < 10}
        >
          🎭 Socialize (+15 Happiness)
        </button>
      </div>

      {/* Career Section */}
      <div className="career-section">
        <div className="career-title">🏢 Career</div>
        <div className="current-career">
          <div className="career-name">{activeCareer.name}</div>
          <div className="career-level">Level {activeCareer.level}</div>
          <div className="career-salary">${activeCareer.salary}/hour</div>
        </div>
        
        <div className="career-options">
          {careers.filter(c => c.id !== activeCareer.id).map(career => (
            <div 
              key={career.id}
              className="career-option"
              onClick={() => changeCareer(career)}
            >
              <div className="career-info">
                <div className="career-name">{career.name}</div>
                <div className="career-description">{career.description}</div>
              </div>
              <div className="career-earnings">${career.salary}/hr</div>
            </div>
          ))}
        </div>
      </div>

      {/* Real Estate */}
      <div className="property-section">
        <div className="property-title">🏠 Real Estate</div>
        <div className="property-list">
          {properties.map(property => (
            <div 
              key={property.id}
              className={`property-item ${property.owned ? 'owned' : ''}`}
            >
              <div className="property-info">
                <div className="property-name">{property.name}</div>
                <div className="property-income">+${property.monthlyIncome}/month</div>
              </div>
              <div className="property-actions">
                {property.owned ? (
                  <span className="owned-badge">✅ Owned</span>
                ) : (
                  <button 
                    className="buy-btn"
                    onClick={() => buyProperty(property.id)}
                    disabled={avatar.wealth < property.value}
                  >
                    Buy ${property.value.toLocaleString()}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Income Summary */}
      <div className="income-summary">
        <div className="income-title">📈 Passive Income</div>
        <div className="monthly-income">
          ${properties
            .filter(p => p.owned)
            .reduce((sum, p) => sum + p.monthlyIncome, 0)
            .toLocaleString()}/month
        </div>
      </div>
    </motion.div>
  );
};
