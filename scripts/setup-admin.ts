/**
 * Setup Admin User Script
 * 
 * Run with: npx tsx scripts/setup-admin.ts
 * 
 * This script creates the default admin user with the specified credentials.
 */

import { Pool } from 'pg';
import bcrypt from 'bcryptjs';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://whatsapp:whatsapp123@localhost:5432/whatsapp_dashboard',
});

async function setupAdmin() {
  const client = await pool.connect();
  
  try {
    console.log('🔧 Setting up admin user...\n');
    
    // Admin credentials
    const email = 'cc@siwaht.com';
    const password = 'Hola173!';
    const name = 'System Administrator';
    
    // Hash the password
    console.log('🔐 Hashing password...');
    const passwordHash = await bcrypt.hash(password, 10);
    
    // Check if user already exists
    const existingUser = await client.query(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );
    
    if (existingUser.rows.length > 0) {
      console.log('⚠️  Admin user already exists. Updating password...');
      await client.query(
        'UPDATE users SET password_hash = $1, name = $2 WHERE email = $3',
        [passwordHash, name, email]
      );
      console.log('✅ Admin password updated!\n');
    } else {
      // Get super_admin role ID
      const roleResult = await client.query(
        "SELECT id FROM roles WHERE name = 'super_admin'"
      );
      
      if (roleResult.rows.length === 0) {
        throw new Error('super_admin role not found. Run the user-management-schema.sql first.');
      }
      
      const roleId = roleResult.rows[0].id;
      
      // Create admin user
      await client.query(
        `INSERT INTO users (email, password_hash, name, role_id, is_active, is_verified)
         VALUES ($1, $2, $3, $4, TRUE, TRUE)`,
        [email, passwordHash, name, roleId]
      );
      console.log('✅ Admin user created!\n');
    }
    
    console.log('📧 Email:', email);
    console.log('🔑 Password:', password);
    console.log('\n⚠️  Please change this password after first login!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  } finally {
    client.release();
    await pool.end();
  }
}

setupAdmin();

