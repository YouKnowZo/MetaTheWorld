import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useGameStore } from '../store'

export interface Friend {
  id: string
  name: string
  avatar: {
    appearance: string
    clothing: string
    accessories: string[]
  }
  status: 'online' | 'offline' | 'busy' | 'away'
  relationship: 'friend' | 'best-friend' | 'crush' | 'dating' | 'partner' | 'married'
  compatibilityScore: number
  sharedInterests: string[]
  lastSeen: Date
  messages: Message[]
  mood: string
  location: string
  activities: string[]
}

export interface Message {
  id: string
  senderId: string
  content: string
  timestamp: Date
  type: 'text' | 'emoji' | 'gift' | 'invite'
  read: boolean
}

export interface SocialActivity {
  id: string
  type: 'friend-request' | 'message' | 'date-invite' | 'gift-received' | 'relationship-milestone'
  from: string
  timestamp: Date
  content: string
  action?: () => void
}

export const SocialSystem: React.FC = () => {
  const { currentUser } = useGameStore()
  const [activeTab, setActiveTab] = useState<'friends' | 'dating' | 'chat' | 'activities'>('friends')
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(null)
  const [message, setMessage] = useState('')
  const [friends, setFriends] = useState<Friend[]>([])
  const [activities, setActivities] = useState<SocialActivity[]>([])

  // Initialize demo friends and activities
  useEffect(() => {
    const demoFriends: Friend[] = [
      {
        id: '1',
        name: 'Alex Rivera',
        avatar: {
          appearance: 'casual-cool',
          clothing: 'streetwear',
          accessories: ['sunglasses', 'watch']
        },
        status: 'online',
        relationship: 'best-friend',
        compatibilityScore: 95,
        sharedInterests: ['building', 'racing', 'exploring'],
        lastSeen: new Date(),
        messages: [
          {
            id: 'm1',
            senderId: '1',
            content: 'Hey! Want to explore the new mountain region together?',
            timestamp: new Date(Date.now() - 1000 * 60 * 5),
            type: 'text',
            read: false
          }
        ],
        mood: '😎 Feeling adventurous',
        location: 'Downtown Plaza',
        activities: ['Racing', 'Building']
      },
      {
        id: '2',
        name: 'Maya Chen',
        avatar: {
          appearance: 'elegant',
          clothing: 'business-casual',
          accessories: ['earrings', 'necklace']
        },
        status: 'online',
        relationship: 'crush',
        compatibilityScore: 87,
        sharedInterests: ['design', 'art', 'socializing'],
        lastSeen: new Date(),
        messages: [
          {
            id: 'm2',
            senderId: '2',
            content: 'I love what you did with your house! The garden is beautiful 🌸',
            timestamp: new Date(Date.now() - 1000 * 60 * 15),
            type: 'text',
            read: false
          }
        ],
        mood: '🎨 Creating something beautiful',
        location: 'Art District',
        activities: ['Interior Design', 'Gardening']
      },
      {
        id: '3',
        name: 'Jordan Smith',
        avatar: {
          appearance: 'sporty',
          clothing: 'athletic',
          accessories: ['cap', 'sneakers']
        },
        status: 'busy',
        relationship: 'friend',
        compatibilityScore: 78,
        sharedInterests: ['sports', 'competition', 'fitness'],
        lastSeen: new Date(Date.now() - 1000 * 60 * 30),
        messages: [],
        mood: '💪 Working out',
        location: 'Sports Center',
        activities: ['Gym Training', 'Racing']
      }
    ]

    const demoActivities: SocialActivity[] = [
      {
        id: 'a1',
        type: 'message',
        from: 'Alex Rivera',
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        content: 'Sent you a message about exploring together!'
      },
      {
        id: 'a2',
        type: 'gift-received',
        from: 'Maya Chen',
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        content: 'Sent you a rare flower for your garden 🌺'
      },
      {
        id: 'a3',
        type: 'friend-request',
        from: 'Sam Wilson',
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        content: 'Wants to be your friend!'
      }
    ]

    setFriends(demoFriends)
    setActivities(demoActivities)
  }, [])

  const sendMessage = () => {
    if (!selectedFriend || !message.trim()) return

    const newMessage: Message = {
      id: `m${Date.now()}`,
      senderId: currentUser?.address || 'user',
      content: message,
      timestamp: new Date(),
      type: 'text',
      read: true
    }

    setFriends(prev => prev.map(friend => 
      friend.id === selectedFriend.id 
        ? { ...friend, messages: [...friend.messages, newMessage] }
        : friend
    ))
    setMessage('')
  }

  const improveRelationship = (friendId: string) => {
    setFriends(prev => prev.map(friend => {
      if (friend.id === friendId) {
        const newScore = Math.min(100, friend.compatibilityScore + 5)
        let newRelationship = friend.relationship
        
        if (newScore > 90 && friend.relationship === 'crush') {
          newRelationship = 'dating'
        } else if (newScore > 95 && friend.relationship === 'dating') {
          newRelationship = 'partner'
        }
        
        return { ...friend, compatibilityScore: newScore, relationship: newRelationship }
      }
      return friend
    }))
  }

  const getRelationshipColor = (relationship: string) => {
    const colors = {
      'friend': '#4ade80',
      'best-friend': '#22d3ee',
      'crush': '#f472b6',
      'dating': '#fb7185',
      'partner': '#e879f9',
      'married': '#fbbf24'
    }
    return colors[relationship as keyof typeof colors] || '#4ade80'
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="social-system"
    >
      <div className="social-header">
        <h2>🌟 Social Hub</h2>
        <div className="tab-buttons">
          {(['friends', 'dating', 'chat', 'activities'] as const).map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="social-content">
        <AnimatePresence mode="wait">
          {activeTab === 'friends' && (
            <motion.div
              key="friends"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="friends-tab"
            >
              <div className="friends-grid">
                {friends.map(friend => (
                  <motion.div
                    key={friend.id}
                    className="friend-card"
                    whileHover={{ scale: 1.02 }}
                    onClick={() => setSelectedFriend(friend)}
                    style={{'--relationship-color': getRelationshipColor(friend.relationship), '--border-color': getRelationshipColor(friend.relationship)} as React.CSSProperties}
                  >
                    <div className="friend-avatar">
                      <div className={`status-indicator ${friend.status}`} />
                      <span className="avatar-emoji">👤</span>
                    </div>
                    <div className="friend-info">
                      <h4>{friend.name}</h4>
                      <p className="relationship relationship-color">
                        {friend.relationship.replace('-', ' ')}
                      </p>
                      <p className="compatibility">💕 {friend.compatibilityScore}% compatible</p>
                      <p className="mood">{friend.mood}</p>
                      <p className="location">📍 {friend.location}</p>
                    </div>
                    {friend.messages.some(m => !m.read) && (
                      <div className="unread-badge">{friend.messages.filter(m => !m.read).length}</div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'dating' && (
            <motion.div
              key="dating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="dating-tab"
            >
              <div className="dating-tips">
                <h3>💕 Dating in Meta The World</h3>
                <ul>
                  <li>Send gifts to increase compatibility</li>
                  <li>Visit together to build memories</li>
                  <li>Complete activities together for relationship milestones</li>
                  <li>Customize your avatar to impress your crush</li>
                </ul>
              </div>
              
              <div className="relationship-progress">
                {friends.filter(f => ['crush', 'dating', 'partner', 'married'].includes(f.relationship)).map(friend => (
                  <div key={friend.id} className="relationship-card">
                    <h4>{friend.name}</h4>
                    <div className="progress-bar">
                      <div 
                        className="progress-fill"
                        style={{ 
                          width: `${friend.compatibilityScore}%`,
                          '--progress-color': getRelationshipColor(friend.relationship)
                        } as React.CSSProperties}
                      />
                    </div>
                    <button 
                      onClick={() => improveRelationship(friend.id)}
                      className="date-button"
                    >
                      Plan Date 💝
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'chat' && (
            <motion.div
              key="chat"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="chat-tab"
            >
              {selectedFriend ? (
                <div className="chat-window">
                  <div className="chat-header">
                    <button onClick={() => setSelectedFriend(null)}>← Back</button>
                    <h3>{selectedFriend.name}</h3>
                    <span className={`status ${selectedFriend.status}`}>{selectedFriend.status}</span>
                  </div>
                  <div className="messages">
                    {selectedFriend.messages.map(msg => (
                      <div key={msg.id} className={`message ${msg.senderId === currentUser?.address ? 'sent' : 'received'}`}>
                        <p>{msg.content}</p>
                        <span className="timestamp">{msg.timestamp.toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                  <div className="message-input">
                    <input
                      type="text"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="Type a message..."
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <button onClick={sendMessage}>Send</button>
                  </div>
                </div>
              ) : (
                <div className="select-friend">
                  <p>Select a friend to start chatting!</p>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'activities' && (
            <motion.div
              key="activities"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="activities-tab"
            >
              <h3>📱 Recent Activity</h3>
              <div className="activities-list">
                {activities.map(activity => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="activity-item"
                  >
                    <div className="activity-icon">
                      {activity.type === 'message' && '💬'}
                      {activity.type === 'friend-request' && '👋'}
                      {activity.type === 'gift-received' && '🎁'}
                      {activity.type === 'date-invite' && '💕'}
                      {activity.type === 'relationship-milestone' && '🎉'}
                    </div>
                    <div className="activity-content">
                      <p><strong>{activity.from}</strong> {activity.content}</p>
                      <span className="activity-time">{activity.timestamp.toLocaleString()}</span>
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
