import { useEffect, useState } from 'react';

export default function App() {
  const [links, setLinks] = useState([]);
  const [url, setUrl] = useState('');

  const load = () => fetch('/api/links').then((r) => r.json()).then(setLinks);
  useEffect(() => { load(); }, []);

  async function shorten(e) {
    e.preventDefault();
    await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });
    setUrl('');
    load();
  }

  return (
    <main>
      <h1>Shorty</h1>
      <form onSubmit={shorten}>
        <input type="url" value={url} onChange={(e) => setUrl(e.target.value)} required />
        <button>Raccourcir</button>
      </form>
      <ul>
        {links.map((l) => (
          <li key={l.code}>
            <a href={`/s/${l.code}`}>/s/{l.code}</a> → {l.url} ({l.clicks} clics)
          </li>
        ))}
      </ul>
    </main>
  );
}
