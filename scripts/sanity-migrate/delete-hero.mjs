// Quick script to delete heroSection singleton
const TOKEN = process.env.SANITY_API_WRITE_TOKEN;
const PID = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const DATASET = 'production';

async function del() {
  const url = `https://${PID}.api.sanity.io/v2024-01-01/data/mutate/${DATASET}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${TOKEN}` },
    body: JSON.stringify({ mutations: [{ delete: { id: 'heroSection' } }] }),
  });
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

del();
