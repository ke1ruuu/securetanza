// Database configuration for backend
export const DATABASE_CONFIG = {
  url: process.env.DATABASE_URL,
  directUrl: process.env.DIRECT_URL,
}

// Validate required environment variables
export function validateEnvVars() {
  const required = ['DATABASE_URL', 'DIRECT_URL']

  const missing = required.filter(key => !process.env[key])

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}