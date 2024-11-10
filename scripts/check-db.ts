import { PrismaClient } from '@prisma/client'

async function checkDatabase() {
  const prisma = new PrismaClient()
  
  try {
    // Try to connect to the database
    await prisma.$connect()
    console.log('✅ Successfully connected to the database')

    // Try to create a test user
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'test-password'
      }
    })
    console.log('✅ Successfully created test user:', testUser)

    // Clean up
    await prisma.user.delete({
      where: { id: testUser.id }
    })
    console.log('✅ Successfully cleaned up test data')

  } catch (error) {
    console.error('❌ Database check failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

checkDatabase()