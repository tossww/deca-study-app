import { PrismaClient } from '@prisma/client'
import { NextRequest } from 'next/server'

const prisma = new PrismaClient()

export async function getUserFromRequest(request: NextRequest): Promise<string | null> {
  try {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization')
    let token = authHeader?.replace('Bearer ', '')
    
    // If no auth header, try to get from cookie or custom header
    if (!token) {
      token = request.headers.get('x-session-token') || 
              request.cookies.get('session-token')?.value
    }

    if (!token) {
      return null
    }

    // Find session in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true }
    })

    if (!session || session.expiresAt < new Date()) {
      return null
    }

    return session.userId
  } catch (error) {
    console.error('Error getting user from request:', error)
    return null
  }
}