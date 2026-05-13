exports.getRooms = async (req, res) => {
  res.json([
    { id: 'r1', name: 'The Penthouse', entryFee: 50, occupancy: 12, maxCapacity: 50, perks: ['Private NFT gallery', 'VIP concierge'], isActive: true },
    { id: 'r2', name: 'Crypto Whales Lounge', entryFee: 200, occupancy: 8, maxCapacity: 20, perks: ['Alpha signals', 'Whale tracking'], isActive: true },
  ]);
};

exports.enterRoom = async (req, res) => {
  res.json({ success: true, txHash: '0x' + Math.random().toString(16).slice(2, 66) });
};
