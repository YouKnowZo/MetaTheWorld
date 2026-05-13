const prisma = require('../config/prisma');

exports.getLands = async (req, res) => {
  try {
    const lands = await prisma.land.findMany({ 
      include: { 
        buildings: true,
        owner: { select: { address: true } }
      } 
    });
    res.json(lands);
  } catch (err) {
    console.error('Fetch Lands Error:', err);
    res.status(500).json({ error: 'Failed to fetch land parcels' });
  }
};

exports.buyLand = async (req, res) => {
  try {
    const { landId } = req.body;
    const land = await prisma.land.findUnique({ where: { landId } });
    
    if (!land) return res.status(404).json({ error: 'Land parcel not found' });
    if (land.ownerId) return res.status(400).json({ error: 'Land is already owned' });
    
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (user.balance < land.price) return res.status(400).json({ error: 'Insufficient MTW balance' });

    const result = await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: { balance: user.balance - land.price }
      }),
      prisma.land.update({
        where: { landId },
        data: { ownerId: user.id }
      })
    ]);

    res.json({ success: true, message: 'Land successfully purchased!', land: result[1] });
  } catch (err) {
    console.error('Buy Land Error:', err);
    res.status(500).json({ error: 'Internal server error during land purchase' });
  }
};
