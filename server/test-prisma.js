const { PrismaClient } = require('@prisma/client')
try {
  const prisma = new PrismaClient({})
  console.log('Successfully initialized Prisma Client with {}')
} catch (e) {
  console.error('Failed to initialize Prisma Client with {}:', e)
}
