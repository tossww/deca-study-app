import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    console.log('🏥 Health check started')

    // Check environment variables
    const hasDbUrl = !!process.env.DATABASE_URL
    console.log('🔗 DATABASE_URL exists:', hasDbUrl)

    if (!hasDbUrl) {
      return NextResponse.json({
        status: 'error',
        message: 'DATABASE_URL environment variable not set',
        database: 'not configured',
        timestamp: new Date().toISOString()
      }, { status: 500 })
    }

    // Test database connection
    console.log('🔍 Testing database connection...')
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful')

    // Check if tables exist
    console.log('📋 Checking if tables exist...')
    const tableCheck = await prisma.$queryRaw`
      SELECT table_name FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name IN ('User', 'Question', 'Topic')
    `
    console.log('📊 Tables found:', tableCheck)

    return NextResponse.json({
      status: 'healthy',
      database: 'connected',
      tables: tableCheck,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    })
  } catch (error) {
    console.error('❌ Health check failed:', error)
    return NextResponse.json({
      status: 'error',
      message: 'Database health check failed',
      error: String(error),
      timestamp: new Date().toISOString(),
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}