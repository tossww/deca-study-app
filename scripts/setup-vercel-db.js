#!/usr/bin/env node

/**
 * Setup script for Vercel database deployment
 * This script should be run after setting up Vercel Postgres
 */

const { execSync } = require('child_process');

console.log('🔄 Setting up database for Vercel deployment...');

try {
  // Generate Prisma client
  console.log('📦 Generating Prisma client...');
  execSync('npx prisma generate', { stdio: 'inherit' });

  // Push database schema
  console.log('🗄️ Pushing database schema...');
  execSync('npx prisma db push', { stdio: 'inherit' });

  // Seed database (if seed script exists)
  try {
    console.log('🌱 Seeding database...');
    execSync('npm run db:seed', { stdio: 'inherit' });
  } catch (error) {
    console.log('⚠️  Seeding failed or no seed script found:', error.message);
  }

  console.log('✅ Database setup completed successfully!');
} catch (error) {
  console.error('❌ Database setup failed:', error.message);
  process.exit(1);
}