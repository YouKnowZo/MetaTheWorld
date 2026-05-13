const prisma = require('./prisma');

const seedDatabase = async () => {
  try {
    const count = await prisma.land.count();
    if (count === 0) {
      console.log("🌱 Seeding initial lands...");
      const gridSize = 5;
      const landTypes = ['residential', 'commercial', 'industrial', 'park', 'beach', 'mountain'];
      
      const landsToCreate = [];
      for (let x = -gridSize; x <= gridSize; x++) {
        for (let z = -gridSize; z <= gridSize; z++) {
          const id = x * 1000 + z;
          const noise = Math.sin(x * 0.1) * Math.cos(z * 0.1);
          const height = noise * 2;
          
          landsToCreate.push({
             landId: id,
             price: Math.floor(100 + Math.random() * 500),
             type: landTypes[Math.floor(Math.random() * landTypes.length)],
             resources: Math.floor(Math.random() * 100),
             lat: 40.7128 + (x * 0.001),
             lng: -74.0060 + (z * 0.001),
             posX: x * 4,
             posY: height,
             posZ: z * 4
          });
        }
      }
      
      await prisma.land.createMany({ data: landsToCreate });
      console.log("✅ Seeding complete.");
    }
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  }
};

module.exports = seedDatabase;
