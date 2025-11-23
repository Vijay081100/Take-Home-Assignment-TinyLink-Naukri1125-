const { Pool } = require('pg');
require('dotenv').config();


const pool = new Pool({ connectionString: process.env.DATABASE_URL });


async function migrate() {
const client = await pool.connect();
try {
await client.query(`
CREATE TABLE IF NOT EXISTS links (
code VARCHAR(8) PRIMARY KEY,
target TEXT NOT NULL,
created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
total_clicks BIGINT DEFAULT 0,
last_clicked TIMESTAMP WITH TIME ZONE
);
`);
console.log('Migration ran successfully');
} catch (err) {
console.error('Migration failed', err);
} finally {
client.release();
process.exit(0);
}
}


migrate();