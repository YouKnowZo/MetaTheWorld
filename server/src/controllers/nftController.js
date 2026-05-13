const prisma = require('../config/prisma');

exports.getListings = async (req, res) => {
  try {
    // In a real app, this would query a marketplace table or contract
    // For now, we fetch lands that are not owned or are listed
    const listings = await prisma.land.findMany({
      where: { ownerId: null },
      take: 20
    });
    
    const formatted = listings.map(l => ({
      id: l.id,
      name: `Parcel #${l.landId}`,
      type: 'LAND',
      price: l.price / 1000, // mock conversion
      priceUSD: l.price,
      owner: 'Genesis',
      rare: l.price > 400,
      tokenId: String(l.landId)
    }));
    
    res.json(formatted);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch NFT listings' });
  }
};

exports.mint = async (req, res) => {
  try {
    const { name, type, price } = req.body;
    // Mock minting logic
    res.json({ 
      txHash: '0x' + Math.random().toString(16).slice(2, 66), 
      tokenId: String(Math.floor(Math.random() * 10000)) 
    });
  } catch (err) {
    res.status(500).json({ error: 'Minting failed' });
  }
};
