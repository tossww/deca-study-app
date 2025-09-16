import { NextResponse } from 'next/server'
import { execSync } from 'child_process'

export async function GET() {
  try {
    let gitBranch = 'unknown'
    let gitCommit = 'unknown'

    try {
      // Get current git branch
      gitBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim()

      // Get current commit hash (short version)
      gitCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
    } catch (error) {
      // Git commands failed (e.g., not a git repo or git not available)
      console.log('Git info not available:', error)
    }

    const buildInfo = {
      version: '1.0.1',
      branch: gitBranch,
      commit: gitCommit,
      buildTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version
    }

    return NextResponse.json(buildInfo)
  } catch (error) {
    console.error('Build info error:', error)
    return NextResponse.json({
      version: '1.0.1',
      branch: 'unknown',
      commit: 'unknown',
      buildTime: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'development'
    })
  }
}