import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { fetchAuthorTraits } from '../api'
import { toSlug, parseAssessment } from '../utils'

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

function AuthorSearch({ authors }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [highlighted, setHighlighted] = useState(-1)
  const navigate = useNavigate()
  const inputRef = useRef(null)

  const filtered = query.trim().length > 0
    ? authors.filter(a => a.toLowerCase().includes(query.toLowerCase())).slice(0, 8)
    : []

  function go(name) {
    navigate(`/authors/${toSlug(name)}`)
  }

  function handleKey(e) {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setHighlighted(h => Math.min(h + 1, filtered.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setHighlighted(h => Math.max(h - 1, 0))
    } else if (e.key === 'Enter') {
      e.preventDefault()
      if (highlighted >= 0 && filtered[highlighted]) go(filtered[highlighted])
      else if (filtered.length > 0) go(filtered[0])
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
          onChange={e => { setQuery(e.target.value); setOpen(true); setHighlighted(-1) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKey}
          autoComplete="off"
          spellCheck={false}
        />
        {query && (
          <button className="clear-btn" onClick={() => { setQuery(''); inputRef.current?.focus() }}>✕</button>
        )}
      </div>
      {open && filtered.length > 0 && (
        <ul className="search-dropdown">
          {filtered.map((name, i) => (
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
          const parsed = parseAssessment(a.assessment)
          const date = a.assessed_at
            ? new Date(a.assessed_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
            : null
          return (
            <Link key={a.author} to={`/authors/${toSlug(a.author)}`} className="latest-row">
              <span className="latest-num">{String(i + 1).padStart(2, '0')}</span>
              <span className="latest-name">{a.author}</span>
              {parsed.avgScore != null && (
                <span className="latest-score" style={{ color: parsed.avgScore >= 0 ? 'var(--green-700)' : '#c0392b' }}>
                  {parsed.avgScore > 0 ? '+' : ''}{parsed.avgScore.toFixed(1)}
                </span>
              )}
              {date && <span className="latest-date">{date}</span>}
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
        {loading
          ? (
            <div className="author-search">
              <div className="search-field">
                <span className="pulse" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: 15, color: 'var(--muted)' }}>Loading authors…</span>
              </div>
            </div>
          )
          : <AuthorSearch authors={authorNames} />
        }
      </section>
      {!loading && latest.length > 0 && (
        <LatestAuthors latest={latest} totalCount={authorNames.length} />
      )}
    </>
  )
}
