# Deployment Guide (Vercel)

## Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Code must be pushed to GitHub
3. **Vercel CLI** (optional): `npm i -g vercel`

## Deployment Steps

### 1. Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New" → "Project"
3. Import your GitHub repository `tossww/deca-study-app`

### 2. Add Vercel Postgres Database

1. In your Vercel project dashboard, go to "Storage" tab
2. Click "Create Database" → "Postgres"
3. Choose database name (e.g., `deca-study-db`)
4. Select region (choose closest to your users)
5. Click "Create"

### 3. Configure Environment Variables

The `DATABASE_URL` will be automatically set by Vercel Postgres.

### 4. Deploy

1. Click "Deploy" in Vercel dashboard
2. Wait for build to complete
3. **Important**: First deployment may fail due to empty database

### 5. Initialize Database

After first deployment:

1. Go to your Vercel project dashboard
2. Navigate to "Functions" tab
3. Or use Vercel CLI:
   ```bash
   vercel env pull .env.local
   npx prisma db push
   npm run db:seed
   ```

### 6. Redeploy

After database is initialized:
1. Go back to Vercel dashboard
2. Click "Redeploy" on latest deployment
3. Your app should now work!

## Troubleshooting

### Internal Server Error
- Check Vercel function logs in dashboard
- Ensure DATABASE_URL is set correctly
- Verify database schema is deployed

### Build Failures
- Check that `prisma generate` runs in build process
- Verify all dependencies are in package.json

### Database Connection Issues
- Ensure Vercel Postgres is created and linked
- Check environment variables in Vercel dashboard

## Local Development

For local development, you can still use SQLite:

1. Copy `.env.example` to `.env`
2. Uncomment SQLite URL:
   ```
   DATABASE_URL="file:./dev.db"
   ```
3. Update `prisma/schema.prisma` back to SQLite:
   ```prisma
   datasource db {
     provider = "sqlite"
     url      = env("DATABASE_URL")
   }
   ```

## Environment Switching

The app is configured to work with both SQLite (local) and PostgreSQL (production). Adjust the schema and environment variables based on your deployment target.
