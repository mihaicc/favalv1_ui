import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchAuthorTraits, searchAuthors } from '../api'
import { toSlug } from '../utils'

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  )
}

function CompareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h12l-3-3M3 6l3 3" />
      <path d="M21 18H9l3 3M21 18l-3-3" />
    </svg>
  )
}

function Header() {
  return (
    <header className="site">
      <div className="shell row">
        <div className="brand">
          <img className="mark" src="/logo.svg" alt="" />
          <img className="wordmark" src="/faval-wordmark.svg" alt="Faval.ai" />
        </div>
        <nav className="primary">
          <a href="#" className="active">Ranking</a>
          <a href="#">Quote Stream</a>
          <a href="#">Donate &amp; Suggest</a>
          <a href="#">About</a>
        </nav>
        <div className="actions">
          <button className="btn"><CompareIcon /> Compare</button>
          <button className="icon-btn" aria-label="Search"><SearchIcon /></button>
        </div>
      </div>
    </header>
  )
}

function AuthorSearch({ fallbackAuthors = [] }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const navigate = useNavigate()
  const inputRef = useRef(null)
  const debounceRef = useRef(null)

  useEffect(() => {
    const q = query.trim()
    if (!q) { setResults([]); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      searchAuthors(q)
        .then(names => { setResults(names); setOpen(true) })
        .catch(() => {
          const local = fallbackAuthors
            .filter(a => a.toLowerCase().includes(q.toLowerCase()))
            .slice(0, 10)
          setResults(local)
          setOpen(true)
        })
    }, 200)
    return () => clearTimeout(debounceRef.current)
  }, [query, fallbackAuthors])

  function go(name) {
    navigate(`/authors/${toSlug(name)}`)
  }

  function handleKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && results[highlighted]) go(results[highlighted])
      else if (results.length > 0) go(results[0])
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  return (
    <div className="author-search">
      <div className="search-field">
        <SearchIcon />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search for an author…"
          value={query}
          onChange={e => { setQuery(e.target.value); setHighlighted(-1) }}
          onFocus={() => { if (results.length) setOpen(true) }}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKey}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button className="clear-btn" onClick={() => { setQuery(''); setResults([]); inputRef.current?.focus() }}>✕</button>
        )}
      </div>
      {open && results.length > 0 && (
        <ul className="search-dropdown">
          {results.map((name, i) => (
            <li
              key={name}
              className={i === highlighted ? 'active' : ''}
              onMouseDown={() => go(name)}
              onMouseEnter={() => setHighlighted(i)}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

function LatestAuthors({ latest, totalCount }) {
  return (
    <section className="latest-authors shell">
      <div className="section-head">
        <h2>Recently assessed</h2>
        <span className="count">{totalCount} authors total</span>
      </div>
      <div className="latest-list">
        {latest.map((a, i) => {
          return (
            <Link key={a.author} to={`/authors/${toSlug(a.author)}`} className="latest-row">
              <span className="latest-name">{a.author}</span>
            </Link>
          )
        })}
      </div>
    </section>
  )
}

export default function HomePage() {
  const [authorNames, setAuthorNames] = useState([])
  const [latest, setLatest] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAuthorTraits()
      .then(traits => {
        setAuthorNames(traits.map(t => t.author).sort())
        const sorted = [...traits]
          .sort((a, b) => new Date(b.assessed_at) - new Date(a.assessed_at))
          .slice(0, 5)
        setLatest(sorted)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <>
      <Header />
      <section className="home-hero shell">
        <div className="home-eyebrow">Factual Value</div>
        <h1 className="home-title">Explore author<br />credibility scores</h1>
        <p className="home-sub">
          Search any public intellectual, politician, or commentator to see how their statements hold up.
        </p>
        <AuthorSearch fallbackAuthors={authorNames} />
      </section>
      {!loading && latest.length > 0 && (
        <LatestAuthors latest={latest} totalCount={authorNames.length} />
      )}
    </>
  )
}
