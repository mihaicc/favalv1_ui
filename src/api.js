const BASE = import.meta.env.VITE_API_URL ?? ''

async function get(path) {
  const res = await fetch(`${BASE}${path}`)
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}

export async function fetchQuotes() {
  return get('/api/quotes/')
}

export async function fetchAuthorTraits() {
  return get('/api/author-traits/')
}

export async function searchAuthors(q) {
  return get(`/api/authors/autocomplete/?q=${encodeURIComponent(q)}`)
}

export async function fetchAuthorFeeds() {
  return get('/api/author-feeds/')
}

export async function voteForAuthorFeed(authorName) {
  const res = await fetch(`${BASE}/api/author-feeds/vote/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ author_name: authorName }),
  })
  if (!res.ok) throw new Error(`${res.status} ${res.statusText}`)
  return res.json()
}
