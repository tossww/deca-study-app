import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'

export async function POST(request: NextRequest) {
  try {
    console.log('🔐 Login attempt started')
    console.log('🔗 DATABASE_URL exists:', !!process.env.DATABASE_URL)
    console.log('🔗 DATABASE_URL length:', process.env.DATABASE_URL?.length || 0)

    // Test database connection first
    try {
      await prisma.$queryRaw`SELECT 1`
      console.log('✅ Database connection successful')
    } catch (dbError) {
      console.error('❌ Database connection failed:', dbError)
      return NextResponse.json({
        error: 'Database connection failed. Please check if DATABASE_URL is set and database is initialized.',
        details: process.env.NODE_ENV === 'development' ? String(dbError) : undefined
      }, { status: 500 })
    }

    const { email, isGuest } = await request.json()
    console.log('📧 Login request:', { email, isGuest: !!isGuest })

    if (!email || !email.includes('@')) {
      console.log('❌ Invalid email provided')
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    let user = await prisma.user.findUnique({
      where: { email },
    })
    console.log('👤 User lookup result:', user ? 'found' : 'not found')

    if (!user) {
      console.log('➕ Creating new user')
      user = await prisma.user.create({
        data: {
          email,
          isGuest: isGuest || false
        },
      })
      console.log('✅ User created:', user.id)
    }

    const token = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days

    console.log('🎫 Creating session token')
    await prisma.session.create({
      data: {
        userId: user.id,
        token,
        expiresAt,
      },
    })
    console.log('✅ Session created successfully')

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        isGuest: user.isGuest || false
      },
      token,
    })

    // Set HttpOnly session cookie for convenience and security
    response.cookies.set('session-token', token, {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      expires: expiresAt,
    })

    return response
  } catch (error) {
    console.error('❌ Login error:', error)
    return NextResponse.json({
      error: 'Internal server error',
      details: process.env.NODE_ENV === 'development' ? String(error) : undefined,
      message: 'Check Vercel function logs for more details'
    }, { status: 500 })
  } finally {
    await prisma.$disconnect()
  }
}