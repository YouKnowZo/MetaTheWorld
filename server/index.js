const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const { ethers } = require('ethers')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const app = express()
const PORT = process.env.PORT || 4000

app.use(cors())
app.use(bodyParser.json())

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'

// Middleware to protect routes
const auth = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'unauthorized' })
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.user = payload
    next()
  } catch (err) {
    res.status(403).json({ error: 'invalid token' })
  }
}
app.post('/auth/exchange', async (req, res) => {
  try {
    const { address, message, signature } = req.body
    if (!address || !message || !signature) return res.status(400).json({ error: 'missing' })

    // verify signature
    let signer
    try {
      signer = ethers.verifyMessage(message, signature)
    } catch (e) {
      return res.status(400).json({ error: 'invalid signature' })
    }

    if (signer.toLowerCase() !== address.toLowerCase()) {
      return res.status(403).json({ error: 'address mismatch' })
    }

    // Upsert User
    let user = await prisma.user.findUnique({ where: { address: address.toLowerCase() } })
    if (!user) {
      user = await prisma.user.create({
        data: {
          address: address.toLowerCase(),
          balance: 2000.0 // Give 2000 ETH starting balance as requested
        }
      })
    }

    const token = jwt.sign({ address: address.toLowerCase(), id: user.id }, JWT_SECRET, { expiresIn: '1h' })
    return res.json({ token, user })
  } catch (err) {
    console.error('auth error', err)
    return res.status(500).json({ error: 'server error' })
  }
})

app.get('/api/users/me', auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: { lands: { include: { buildings: true } }, avatar: true, vehicles: true }
    })
    res.json(user)
  } catch (err) {
    res.status(500).json({ error: 'server error' })
  }
})

app.get('/api/lands', async (req, res) => {
  try {
    const lands = await prisma.land.findMany({ include: { buildings: true } })
    res.json(lands)
  } catch(err) {
    res.status(500).json({ error: 'server error' })
  }
})

app.post('/api/lands/buy', auth, async (req, res) => {
  try {
    const { landId } = req.body
    const land = await prisma.land.findUnique({ where: { landId } })
    if (!land) return res.status(404).json({ error: 'not found' })
    if (land.ownerId) return res.status(400).json({ error: 'already owned' })
    
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (user.balance < land.price) return res.status(400).json({ error: 'insufficient funds' })

    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: user.balance - land.price }
      }),
      prisma.land.update({
        where: { landId },
        data: { ownerId: user.id }
      })
    ])

    res.json({ success: true, message: 'Land purchased!' })
  } catch(err) {
    res.status(500).json({ error: 'server error' })
  }
})

app.post('/api/buildings/build', auth, async (req, res) => {
  try {
    const { landId, type } = req.body
    // Simplified building logic
    const cost = 50 
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (user.balance < cost) return res.status(400).json({ error: 'insufficient funds' })

    const land = await prisma.land.findUnique({ where: { landId } })
    if (land.ownerId !== user.id) return res.status(403).json({ error: 'unauthorized' })

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { balance: user.balance - cost } }),
      prisma.building.create({
        data: {
          type,
          posX: land.posX,
          posY: land.posY,
          posZ: land.posZ,
          landId: land.id
        }
      })
    ])

    res.json({ success: true, message: 'Built successfully!' })
  } catch(err) {
    res.status(500).json({ error: 'server error' })
  }
})

app.post('/api/avatar/save', auth, async (req, res) => {
  try {
    const { skin, hair, top, bottom } = req.body
    const avatar = await prisma.avatar.upsert({
      where: { userId: req.user.id },
      update: { skin, hair, top, bottom },
      create: { userId: req.user.id, skin, hair, top, bottom }
    })
    res.json({ success: true, avatar })
  } catch(err) {
    res.status(500).json({ error: 'server error' })
  }
})

app.post('/api/vehicles/buy', auth, async (req, res) => {
  try {
    const { brand, model, type, price } = req.body
    const user = await prisma.user.findUnique({ where: { id: req.user.id } })
    if (user.balance < price) return res.status(400).json({ error: 'insufficient funds' })

    await prisma.$transaction([
      prisma.user.update({ where: { id: user.id }, data: { balance: user.balance - price } }),
      prisma.vehicle.create({
        data: {
          brand, model, type, price, ownerId: user.id
        }
      })
    ])
    res.json({ success: true, message: 'Vehicle purchased!' })
  } catch(err) {
    res.status(500).json({ error: 'server error' })
  }
})

const seedDatabase = async () => {
  const count = await prisma.land.count()
  if (count === 0) {
    console.log("Seeding lands...")
    const gridSize = 5
    const landTypes = ['residential', 'commercial', 'industrial', 'park', 'beach', 'mountain']
    
    for (let x = -gridSize; x <= gridSize; x++) {
      for (let z = -gridSize; z <= gridSize; z++) {
        const id = x * 1000 + z
        const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1)
        const height = noise * 2
        
        await prisma.land.create({
          data: {
             landId: id,
             price: Math.floor(100 + Math.random() * 500),
             type: landTypes[Math.floor(Math.random() * landTypes.length)],
             resources: Math.floor(Math.random() * 100),
             lat: 40.7128 + (x * 0.001),
             lng: -74.0060 + (z * 0.001),
             posX: x * 4,
             posY: height,
             posZ: z * 4
          }
        })
      }
    }
    console.log("Seeding complete.")
  }
}

app.listen(PORT, async () => {
  await seedDatabase()
  console.log(`API and Auth server listening on http://localhost:${PORT}`)
})
