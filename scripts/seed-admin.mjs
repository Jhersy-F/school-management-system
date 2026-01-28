import fs from 'fs';
import postgres from 'postgres';
import { hash } from 'bcryptjs';

// Read .env manually
let url;
try {
  const env = fs.readFileSync('.env', 'utf-8');
  const match = env.match(/DATABASE_URL=(.*)/);
  if (match) {
    url = match[1].trim();
  }
} catch (e) {
  console.error('Could not read .env file:', e);
  process.exit(1);
}

if (!url) {
  console.error('DATABASE_URL not found in .env');
  process.exit(1);
}

const sql = postgres(url);

async function main() {
  try {
    const password = await hash('admin123', 10);
    
    await sql`
      INSERT INTO admins (username, password, created_at)
      VALUES ('admin', ${password}, NOW())
      ON CONFLICT (username) DO NOTHING
    `;
    
    console.log('Admin user seeded successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
  } catch (e) {
    console.error('Failed to seed admin:', e);
  } finally {
    await sql.end();
  }
}

main();
