const axios = require('axios');

let cachedPrices = null;
let lastFetch = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

exports.getPrices = async (req, res) => {
  const now = Date.now();
  
  if (cachedPrices && (now - lastFetch < CACHE_DURATION)) {
    return res.json(cachedPrices);
  }

  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
      params: {
        ids: 'bitcoin,ethereum,matic-network,tether',
        vs_currencies: 'usd',
        include_24hr_change: 'true'
      }
    });

    cachedPrices = response.data;
    lastFetch = now;
    res.json(cachedPrices);
  } catch (err) {
    console.error('CoinGecko Error:', err.message);
    if (cachedPrices) {
      return res.json(cachedPrices); // Return stale cache on error
    }
    res.status(500).json({ error: 'Failed to fetch prices' });
  }
};
