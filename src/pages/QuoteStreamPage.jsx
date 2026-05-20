import { useState, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { fetchQuotes } from '../api'
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
          <img className="wordmark" src="/faval-wordmark.svg" alt="Faval.AI" />
        </div>
        <nav className="primary">
          <Link to="/">Ranking</Link>
          <Link to="/quote-stream" className="active">Quote Stream</Link>
          <Link to="/donate-suggest">Donate &amp; Suggest</Link>
          <Link to="/about">About</Link>
        </nav>
        <div className="actions">
          <button className="btn"><CompareIcon /> Compare</button>
          <button className="icon-btn" aria-label="Search"><SearchIcon /></button>
        </div>
      </div>
    </header>
  )
}

function formatArticleDate(dateStr) {
  if (!dateStr) return null
  const d = new Date(dateStr + 'T00:00:00')
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

const SKELETONS = [
  { lines: ['w-90', 'w-75', 'w-60'] },
  { lines: ['w-75', 'w-90'] },
  { lines: ['w-90', 'w-50', 'w-75'] },
  { lines: ['w-60', 'w-90'] },
  { lines: ['w-75', 'w-60', 'w-90'] },
]

function StreamSkeleton() {
  return (
    <article className="stream-card">
      <div className="stream-card-top">
        <span className="skel" style={{ height: 16, width: 140, borderRadius: 4 }} />
        <span className="skel" style={{ height: 20, width: 80, borderRadius: 4 }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <span className="skel w-90" style={{ height: 24, borderRadius: 6 }} />
        <span className="skel w-75" style={{ height: 24, borderRadius: 6 }} />
        <span className="skel w-60" style={{ height: 24, borderRadius: 6 }} />
      </div>
      <span className="skel" style={{ height: 14, width: 100, borderRadius: 4 }} />
    </article>
  )
}

function StreamCard({ quote }) {
  const dateLabel = formatArticleDate(quote.article_date)

  return (
    <article className="stream-card">
      <div className="stream-card-top">
        <Link to={`/authors/${toSlug(quote.author)}`} className="stream-author">
          {quote.author}
        </Link>
        {dateLabel && <span className="stream-date-badge">{dateLabel}</span>}
      </div>
      <blockquote className="stream-quote">{quote.quote}</blockquote>
      {quote.article_url && (
        <div className="stream-card-footer">
          <a
            href={quote.article_url}
            className="stream-source"
            target="_blank"
            rel="noopener noreferrer"
          >
            Source article ↗
          </a>
        </div>
      )}
    </article>
  )
}

export default function QuoteStreamPage() {
  const [quotes, setQuotes] = useState([])
  const [status, setStatus] = useState('loading')

  const load = useCallback(async () => {
    try {
      const data = await fetchQuotes()
      const sorted = [...data].sort((a, b) =>
        (b.article_date ?? '').localeCompare(a.article_date ?? '')
      )
      setQuotes(sorted)
      setStatus('idle')
    } catch {
      setStatus('error')
    }
  }, [])

  useEffect(() => {
    load()
    const id = setInterval(load, 60_000)
    return () => clearInterval(id)
  }, [load])

  const loading = status === 'loading'

  return (
    <>
      <Header />
      <section className="stream-hero shell">
        <div className="eyebrow">Live Feed</div>
        <h1 className="stream-title">Quote Stream</h1>
        <p className="stream-sub">Latest quotes from public figures, ordered by article date</p>
        <div className="stream-live-bar">
          <span className="pulse" />
          <span className="stream-live-text">
            {loading ? 'Loading…' : `${quotes.length} quotes · refreshes automatically`}
          </span>
        </div>
      </section>

      <section className="stream-feed shell">
        <div className="section-head">
          <h2>All quotes</h2>
          <span className="count">
            {loading
              ? <><span className="pulse" />&nbsp;Loading</>
              : `${quotes.length} total · newest first`}
          </span>
        </div>
        <div className="quote-list">
          {loading
            ? SKELETONS.map((_, i) => <StreamSkeleton key={i} />)
            : quotes.map(q => <StreamCard key={q.id} quote={q} />)
          }
        </div>
      </section>
    </>
  )
}
