import fs from 'fs';
import postgres from 'postgres';

// Read .env manually to find DATABASE_URL
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

// Connect to 'postgres' database instead of the target one to run the CREATE command
// This regex replaces the last path segment (database name) with 'postgres'
// Handles postgres://u:p@h:p/dbname
const rootUrl = url.replace(/\/[^/?]+(\?.*)?$/, '/postgres$1');

console.log('Connecting to root database...'); // Don't log URL to avoid leaking password

const sql = postgres(rootUrl);

async function main() {
  try {
    console.log('Attempting to create database "school_management_system"...');
    await sql`CREATE DATABASE school_management_system`;
    console.log('Database "school_management_system" created successfully!');
  } catch (e) {
    if (e.code === '42P04') { // duplicate_database
        console.log('Database "school_management_system" already exists.');
    } else {
        console.error('Failed to create database:', e);
        process.exit(1);
    }
  } finally {
    await sql.end();
  }
}

main();
