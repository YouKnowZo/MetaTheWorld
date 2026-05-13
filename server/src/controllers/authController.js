const jwt = require('jsonwebtoken');
const { verifyMessage } = require('ethers');
const prisma = require('../config/prisma');
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret';

exports.exchange = async (req, res) => {
  try {
    const { address, message, signature } = req.body;
    if (!address || !message || !signature) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }

    // Verify signature
    let signer;
    try {
      signer = verifyMessage(message, signature);
    } catch (e) {
      return res.status(400).json({ error: 'Invalid signature format' });
    }

    if (signer.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({ error: 'Address mismatch' });
    }

    // Upsert User
    let user = await prisma.user.findUnique({ 
      where: { address: address.toLowerCase() },
      include: { avatar: true, vehicles: true, lands: true }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          address: address.toLowerCase(),
          balance: 2000.0 // Starting balance
        },
        include: { avatar: true, vehicles: true, lands: true }
      });
    }

    const token = jwt.sign({ address: address.toLowerCase(), id: user.id }, JWT_SECRET, { expiresIn: '24h' });
    
    return res.json({ token, user });
  } catch (err) {
    console.error('Auth Exchange Error:', err);
    return res.status(500).json({ error: 'Internal server error during authentication' });
  }
};

exports.me = async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { 
        lands: { include: { buildings: true } }, 
        avatar: true, 
        vehicles: true 
      }
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    res.json(user);
  } catch (err) {
    console.error('Fetch Me Error:', err);
    res.status(500).json({ error: 'Internal server error fetching user data' });
  }
};
