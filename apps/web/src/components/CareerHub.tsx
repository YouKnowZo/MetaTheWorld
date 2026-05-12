import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export interface Job {
  id: string
  title: string
  company: string
  department: string
  level: 'entry' | 'junior' | 'senior' | 'lead' | 'executive'
  salary: number
  requirements: string[]
  skills: string[]
  workHours: number
  satisfaction: number
  colleagues: string[]
  unlocked: boolean
}

export interface Skill {
  id: string
  name: string
  category: 'technical' | 'creative' | 'social' | 'business'
  level: number
  experience: number
  maxLevel: 100
  benefits: string[]
}

export interface Achievement {
  id: string
  title: string
  description: string
  icon: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  unlocked: boolean
  unlockedAt?: Date
  reward: {
    money?: number
    skill?: string
    item?: string
  }
}

export const CareerHub: React.FC = () => {
  // const { currentUser } = useGameStore()
  const [activeTab, setActiveTab] = useState<'jobs' | 'skills' | 'achievements'>('jobs')
  const [currentJob, setCurrentJob] = useState<Job | null>(null)
  
  const [jobs] = useState<Job[]>([
    {
      id: 'j1',
      title: 'Virtual Architect',
      company: 'MetaBuild Corp',
      department: 'Design',
      level: 'junior',
      salary: 50000,
      requirements: ['Building skill 25+', 'Creativity 30+'],
      skills: ['building', 'creativity', 'design'],
      workHours: 40,
      satisfaction: 85,
      colleagues: ['Sarah Johnson', 'Mike Chen'],
      unlocked: true
    },
    {
      id: 'j2',
      title: 'Social Media Manager',
      company: 'MetaConnect',
      department: 'Marketing',
      level: 'senior',
      salary: 75000,
      requirements: ['Social skill 50+', 'Communication 40+'],
      skills: ['social', 'communication', 'marketing'],
      workHours: 35,
      satisfaction: 90,
      colleagues: ['Alex Rivera', 'Emma Wilson'],
      unlocked: true
    },
    {
      id: 'j3',
      title: 'Virtual Race Driver',
      company: 'Speed Demons Racing',
      department: 'Sports',
      level: 'lead',
      salary: 120000,
      requirements: ['Driving skill 75+', 'Reflexes 60+'],
      skills: ['driving', 'reflexes', 'competition'],
      workHours: 30,
      satisfaction: 95,
      colleagues: ['Jordan Smith', 'Casey Brown'],
      unlocked: false
    },
    {
      id: 'j4',
      title: 'Metaverse CEO',
      company: 'Your Company',
      department: 'Executive',
      level: 'executive',
      salary: 500000,
      requirements: ['Leadership 90+', 'Business 80+', 'All skills 50+'],
      skills: ['leadership', 'business', 'management'],
      workHours: 50,
      satisfaction: 100,
      colleagues: ['Board of Directors'],
      unlocked: false
    }
  ])

  const [skills, setSkills] = useState<Skill[]>([
    {
      id: 's1',
      name: 'Building',
      category: 'technical',
      level: 35,
      experience: 1250,
      maxLevel: 100,
      benefits: ['Faster construction', 'Better quality builds', 'Unique materials']
    },
    {
      id: 's2',
      name: 'Social',
      category: 'social',
      level: 42,
      experience: 1680,
      maxLevel: 100,
      benefits: ['More friends', 'Better relationships', 'Group bonuses']
    },
    {
      id: 's3',
      name: 'Driving',
      category: 'technical',
      level: 28,
      experience: 840,
      maxLevel: 100,
      benefits: ['Better handling', 'Higher speeds', 'Custom vehicles']
    },
    {
      id: 's4',
      name: 'Creativity',
      category: 'creative',
      level: 38,
      experience: 1140,
      maxLevel: 100,
      benefits: ['Unique designs', 'Art creation', 'Innovation bonus']
    }
  ])

  const [achievements] = useState<Achievement[]>([
    {
      id: 'a1',
      title: 'First Job',
      description: 'Get your first job in the metaverse',
      icon: '💼',
      rarity: 'common',
      unlocked: true,
      unlockedAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
      reward: { money: 1000 }
    },
    {
      id: 'a2',
      title: 'Skill Master',
      description: 'Reach level 50 in any skill',
      icon: '🎯',
      rarity: 'rare',
      unlocked: false,
      reward: { money: 5000, skill: 'All skills +5' }
    },
    {
      id: 'a3',
      title: 'Social Butterfly',
      description: 'Make 10 friends in the metaverse',
      icon: '🦋',
      rarity: 'epic',
      unlocked: false,
      reward: { money: 10000, item: 'Charisma Booster' }
    },
    {
      id: 'a4',
      title: 'Metaverse Mogul',
      description: 'Earn $1,000,000 total',
      icon: '👑',
      rarity: 'legendary',
      unlocked: false,
      reward: { money: 100000, item: 'Golden Crown' }
    }
  ])

  const applyForJob = (job: Job) => {
    if (!job.unlocked) {
      alert('Requirements not met!')
      return
    }
    setCurrentJob(job)
    alert(`Congratulations! You got the job as ${job.title}!`)
  }

  const trainSkill = (skillId: string) => {
    setSkills(prev => prev.map(skill => {
      if (skill.id === skillId) {
        const newExp = skill.experience + 50
        const newLevel = Math.min(skill.maxLevel, Math.floor(newExp / 30))
        return { ...skill, experience: newExp, level: newLevel }
      }
      return skill
    }))
  }

  const getRarityColor = (rarity: string) => {
    const colors = {
      common: '#64748b',
      rare: '#3b82f6',
      epic: '#8b5cf6',
      legendary: '#f59e0b'
    }
    return colors[rarity as keyof typeof colors] || '#64748b'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="career-hub"
    >
      <div className="career-header">
        <h2>💼 Career Hub</h2>
        {currentJob && (
          <div className="current-job-banner">
            <span>Currently working as: <strong>{currentJob.title}</strong></span>
            <span>Salary: ${currentJob.salary.toLocaleString()}/month</span>
          </div>
        )}
        <div className="tab-navigation">
          {(['jobs', 'skills', 'achievements'] as const).map(tab => (
            <button
              key={tab}
              className={`nav-tab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === 'jobs' && '💼'}
              {tab === 'skills' && '🎯'}
              {tab === 'achievements' && '🏆'}
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="career-content">
        <AnimatePresence mode="wait">
          {activeTab === 'jobs' && (
            <motion.div
              key="jobs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="jobs-section"
            >
              <div className="jobs-grid">
                {jobs.map(job => (
                  <motion.div
                    key={job.id}
                    className={`job-card ${!job.unlocked ? 'locked' : ''} ${currentJob?.id === job.id ? 'current' : ''}`}
                    whileHover={{ scale: job.unlocked ? 1.02 : 1 }}
                    layout
                  >
                    <div className="job-header">
                      <h3>{job.title}</h3>
                      <span className="company">{job.company}</span>
                      <div className="job-level">{job.level.charAt(0).toUpperCase() + job.level.slice(1)}</div>
                    </div>
                    
                    <div className="job-details">
                      <div className="salary">💰 ${job.salary.toLocaleString()}/month</div>
                      <div className="hours">⏰ {job.workHours} hours/week</div>
                      <div className="satisfaction">😊 {job.satisfaction}% satisfaction</div>
                    </div>

                    <div className="requirements">
                      <h4>Requirements:</h4>
                      <ul>
                        {job.requirements.map((req, index) => (
                          <li key={index} className={job.unlocked ? 'met' : 'unmet'}>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="colleagues">
                      <h4>Team:</h4>
                      <div className="colleague-list">
                        {job.colleagues.map((colleague, index) => (
                          <span key={index} className="colleague-badge">
                            {colleague}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      className={`job-action-btn ${!job.unlocked ? 'disabled' : ''}`}
                      onClick={() => applyForJob(job)}
                      disabled={!job.unlocked}
                    >
                      {currentJob?.id === job.id ? '✅ Current Job' : 
                       job.unlocked ? '📝 Apply' : '🔒 Locked'}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'skills' && (
            <motion.div
              key="skills"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="skills-section"
            >
              <div className="skills-grid">
                {skills.map(skill => (
                  <motion.div
                    key={skill.id}
                    className="skill-card"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="skill-header">
                      <h3>{skill.name}</h3>
                      <span className="skill-category">{skill.category}</span>
                    </div>
                    
                    <div className="skill-progress">
                      <div className="level">Level {skill.level}</div>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill"
                          style={{ width: `${(skill.level / skill.maxLevel) * 100}%` }}
                        />
                      </div>
                      <div className="experience">
                        {skill.experience} / {skill.level * 30} XP
                      </div>
                    </div>

                    <div className="skill-benefits">
                      <h4>Benefits:</h4>
                      <ul>
                        {skill.benefits.map((benefit, index) => (
                          <li key={index}>{benefit}</li>
                        ))}
                      </ul>
                    </div>

                    <button
                      className="train-btn"
                      onClick={() => trainSkill(skill.id)}
                    >
                      🎓 Train (+50 XP)
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'achievements' && (
            <motion.div
              key="achievements"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="achievements-section"
            >
              <div className="achievements-grid">
                {achievements.map(achievement => (
                  <motion.div
                    key={achievement.id}
                    className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
                    style={{ borderColor: getRarityColor(achievement.rarity) }}
                    whileHover={{ scale: achievement.unlocked ? 1.02 : 1 }}
                  >
                    <div className="achievement-icon">
                      <span className="icon-large">{achievement.icon}</span>
                      <div 
                        className="rarity-badge"
                        style={{ backgroundColor: getRarityColor(achievement.rarity) }}
                      >
                        {achievement.rarity}
                      </div>
                    </div>
                    
                    <div className="achievement-info">
                      <h3>{achievement.title}</h3>
                      <p>{achievement.description}</p>
                      
                      {achievement.unlocked && achievement.unlockedAt && (
                        <div className="unlock-date">
                          Unlocked: {achievement.unlockedAt.toLocaleDateString()}
                        </div>
                      )}
                      
                      <div className="reward-info">
                        <h4>Reward:</h4>
                        {achievement.reward.money && (
                          <span className="reward-item">💰 ${achievement.reward.money.toLocaleString()}</span>
                        )}
                        {achievement.reward.skill && (
                          <span className="reward-item">📈 {achievement.reward.skill}</span>
                        )}
                        {achievement.reward.item && (
                          <span className="reward-item">🎁 {achievement.reward.item}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  )
}
