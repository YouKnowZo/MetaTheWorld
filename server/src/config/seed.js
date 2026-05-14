const prisma = require('./prisma');

const seedDatabase = async () => {
  try {
    const count = await prisma.land.count();
    if (count === 0) {
      console.log("🌱 Seeding initial lands...");
      const gridSize = 5;
      const landTypes = ['residential', 'commercial', 'industrial', 'park', 'beach', 'mountain'];
      
      const landmarks = [
        { name: "Eiffel Tower", lat: 48.8584, lng: 2.2945, type: "landmark", price: 50000 },
        { name: "Louvre Museum", lat: 48.8606, lng: 2.3376, type: "commercial", price: 45000 },
        { name: "Times Square", lat: 40.7580, lng: -73.9855, type: "commercial", price: 60000 },
        { name: "Empire State Building", lat: 40.7484, lng: -73.9857, type: "landmark", price: 55000 },
        { name: "Central Park", lat: 40.7829, lng: -73.9654, type: "park", price: 30000 },
        { name: "Arc de Triomphe", lat: 48.8738, lng: 2.2950, type: "landmark", price: 25000 },
      ];

      const landsToCreate = landmarks.map((l, i) => ({
        landId: 10000 + i,
        price: l.price,
        priceUSD: l.price * 0.1, // Example conversion
        type: l.type,
        resources: 100,
        lat: l.lat,
        lng: l.lng,
        posX: 0,
        posY: 0,
        posZ: 0
      }));

      // Add some random surrounding parcels
      for (let i = 0; i < 50; i++) {
        const x = (Math.random() - 0.5) * 0.1;
        const z = (Math.random() - 0.5) * 0.1;
        landsToCreate.push({
          landId: 20000 + i,
          price: Math.floor(200 + Math.random() * 800),
          priceUSD: Math.floor(20 + Math.random() * 80),
          type: landTypes[Math.floor(Math.random() * landTypes.length)],
          resources: Math.floor(Math.random() * 100),
          lat: 48.8566 + x,
          lng: 2.3522 + z,
          posX: x * 1000,
          posY: 0,
          posZ: z * 1000
        });
      }
      
      await prisma.land.createMany({ data: landsToCreate });
      console.log("✅ Seeding complete.");
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
};

module.exports = seedDatabase;
