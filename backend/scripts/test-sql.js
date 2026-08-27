const env = require('../src/config/env');

async function checkSqlApi() {
  const sql = `SELECT version();`;
  try {
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/rpc`, {
      method: 'POST',
      headers: {
        'apikey': env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query: sql })
    });
    console.log('rpc status:', res.status);
    const text = await res.text();
    console.log('rpc response:', text);
  } catch (err) {
    console.error('rpc error:', err.message);
  }
}

checkSqlApi();
