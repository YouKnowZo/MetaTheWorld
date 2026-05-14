const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const landRoutes = require('./routes/landRoutes');
const nftRoutes = require('./routes/nftRoutes');
const cryptoController = require('./controllers/cryptoController');
const paymentController = require('./controllers/paymentController');
const auth = require('./middleware/auth');

const app = express();

// Middleware
app.use(cors());

// Special case for Stripe Webhook (needs raw body)
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), paymentController.handleWebhook);

app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/lands', landRoutes);
app.use('/api/nft', nftRoutes);
app.get('/api/crypto/prices', cryptoController.getPrices);

// Payment Routes
app.post('/api/payments/create-session', auth, paymentController.createCheckoutSession);

// Additional Mock API endpoints for a "real" feel without full DB schema changes yet
app.get('/api/vip-rooms', (req, res) => res.json([
  { id: 'r1', name: 'The Penthouse', entryFee: 50, occupancy: 12, maxCapacity: 50, perks: ['Private NFT gallery', 'VIP concierge'], isActive: true },
  { id: 'r2', name: 'Crypto Whales Lounge', entryFee: 200, occupancy: 8, maxCapacity: 20, perks: ['Alpha signals', 'Whale tracking'], isActive: true },
]));

app.get('/api/ad-slots', (req, res) => res.json([
  { id: 's1', location: 'Paris Eiffel Tower District', adType: 'BILLBOARD', dailyVisitors: 12400, priceUSD: 85, priceMTW: 1003, booked: false },
  { id: 's2', location: 'NYC Times Square Block', adType: 'BILLBOARD', dailyVisitors: 18700, priceUSD: 150, priceMTW: 1771, booked: true },
]));

app.get('/api/party-room/state', (req, res) => res.json({
  activeUsers: 247,
  dancing: 89,
  chatting: 134,
  watching: 24,
  currentTrack: 'Neon Nights',
  dj: 'DJ MetaWorld',
}));

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

module.exports = app;
