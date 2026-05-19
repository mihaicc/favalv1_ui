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
