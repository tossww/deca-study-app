// Build information utility

export interface BuildInfo {
  version: string
  branch: string
  buildTime: string
  environment: string
}

// This will be populated at build time or runtime
export function getBuildInfo(): BuildInfo {
  // In production, these could be environment variables
  // For now, we'll use dynamic values

  const isDevelopment = process.env.NODE_ENV === 'development'

  return {
    version: process.env.NEXT_PUBLIC_VERSION || '1.0.0',
    branch: process.env.NEXT_PUBLIC_GIT_BRANCH || 'staging',
    buildTime: process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString(),
    environment: isDevelopment ? 'Development' : 'Production'
  }
}