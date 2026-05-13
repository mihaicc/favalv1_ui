import { useEffect, useState, useCallback } from 'react'
import { useParams, Link } from 'react-router-dom'
import { fetchQuotes, fetchAuthorTraits } from '../api'
import { toSlug, matchAuthor, parseAssessment } from '../utils'

// ── Icons ──────────────────────────────────────────────────────────────
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

// ── Site header ─────────────────────────────────────────────────────────
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

// ── Breadcrumb ─────────────────────────────────────────────────────────
function Breadcrumb({ authorName }) {
  return (
    <nav className="breadcrumb shell" aria-label="breadcrumb">
      <Link to="/">Home</Link>
      <span className="sep">/</span>
      <a href="#">Ranking</a>
      <span className="sep">/</span>
      <span>{authorName ?? 'Author'}</span>
    </nav>
  )
}

// ── Trait scorecard ────────────────────────────────────────────────────
const SKELETON_ROWS = [
  { n: '1', skel: 'w-90' },
  { n: '2', skel: 'w-75' },
  { n: '3', skel: 'w-90' },
  { n: '4', skel: 'w-60' },
  { n: '5', skel: 'w-75' },
  { n: 'NR', skel: 'w-50', nr: true },
]

function TraitScorecard({ traits, avgScore, loading }) {
  return (
    <aside className="scorecard">
      <div className="card-head">
        <div className="card-title">Trait scores</div>
        <div className="status">
          {loading && <><span className="pulse" />&nbsp;Loading</>}
          {!loading && avgScore != null && (
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12 }}>
              avg&nbsp;
              <strong style={{ color: avgScore >= 0 ? 'var(--green-700)' : '#c0392b' }}>
                {avgScore > 0 ? '+' : ''}{avgScore.toFixed(1)}
              </strong>
            </span>
          )}
        </div>
      </div>
      {loading
        ? SKELETON_ROWS.map((r, i) => (
            <div key={i} className="trait-row">
              <span className={`num${r.nr ? ' nr' : ''}`}>{r.n}</span>
              <span className={`skel ${r.skel}`} />
              <span className="skel score" />
            </div>
          ))
        : traits.map((t, i) => (
            <div key={i} className="trait-row">
              <span className={`num${t.rank === 'NR' ? ' nr' : ''}`}>{t.rank}</span>
              <span className="trait-name">{t.name}</span>
              <span
                className="trait-score"
                style={{ color: t.score < 0 ? '#c0392b' : 'var(--green-900)' }}
              >
                {t.score > 0 ? '+' : ''}{t.score}
              </span>
            </div>
          ))
      }
    </aside>
  )
}

// ── Hero ───────────────────────────────────────────────────────────────
function Hero({ author, traitData, quotesTotal, loading }) {
  return (
    <section className="hero shell">
      <div>
        <div className="eyebrow">Author · Ranked #—</div>
        <h1>{author ?? <span className="skel w-75" style={{ height: 60, display: 'block', marginBottom: 4 }} />}</h1>
        <p className="epithet">
          {loading
            ? <span className="skel w-90" style={{ height: 20, display: 'block' }} />
            : (traitData?.raw
                ? traitData.raw.split('\n')[0].replace(/\*\*/g, '').trim() || '—'
                : '—'
              )
          }
        </p>
        <div className="meta">
          <span className="item"><strong>Quotes</strong>{quotesTotal ?? '—'}</span>
          {traitData?.avgScore != null && (
            <>
              <span className="dot" aria-hidden />
              <span className="item">
                <strong>Avg score</strong>
                <span style={{ color: traitData.avgScore >= 0 ? 'var(--green-700)' : '#c0392b' }}>
                  {traitData.avgScore > 0 ? '+' : ''}{traitData.avgScore.toFixed(1)}
                </span>
              </span>
            </>
          )}
        </div>
      </div>
      <TraitScorecard
        traits={traitData?.traits ?? []}
        avgScore={traitData?.avgScore ?? null}
        loading={loading}
      />
    </section>
  )
}

// ── Quote skeleton ─────────────────────────────────────────────────────
const QUOTE_SKELETONS = [
  ['w-90', 'w-75', 'w-60'],
  ['w-90', 'w-50'],
  ['w-75', 'w-90', 'w-60'],
  ['w-90', 'w-75'],
  ['w-60', 'w-90', 'w-50'],
]

function QuoteSkeleton({ rank, lines }) {
  return (
    <article className="quote">
      <div className="rank">№{String(rank).padStart(2, '0')}</div>
      <div className="body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {lines.map((w, i) => (
            <span key={i} className={`skel ${w}`} style={{ height: 22, borderRadius: 6 }} />
          ))}
        </div>
        <div className="source">
          <span className="skel w-50" style={{ height: 14, width: 140, borderRadius: 4 }} />
          <span className="skel" style={{ height: 14, width: 56, borderRadius: 4 }} />
        </div>
      </div>
      <div className="vote">
        <div className="vote-row">
          <span className="lbl">Score</span>
          <span className="skel score" />
        </div>
        <div className="vote-row">
          <span className="lbl">Votes</span>
          <span className="skel score" style={{ width: 40 }} />
        </div>
        <div className="vote-actions">
          <button disabled>▲ For</button>
          <button disabled>▼ Against</button>
        </div>
      </div>
    </article>
  )
}

// ── Quote card ─────────────────────────────────────────────────────────
function QuoteCard({ rank, quote }) {
  const [userVote, setUserVote] = useState(null)
  const [localVotes, setLocalVotes] = useState(0)

  function handleVote(dir) {
    if (userVote === dir) {
      setUserVote(null)
      setLocalVotes(v => v + (dir === 'for' ? -1 : 1))
    } else {
      const prev = userVote
      setUserVote(dir)
      setLocalVotes(v => {
        let delta = dir === 'for' ? 1 : -1
        if (prev) delta += dir === 'for' ? 1 : -1
        return v + delta
      })
    }
  }

  const year = quote.article_date ? quote.article_date.slice(0, 4) : null

  return (
    <article className="quote">
      <div className="rank">№{String(rank).padStart(2, '0')}</div>
      <div className="body">
        <blockquote>{quote.quote}</blockquote>
        <div className="source">
          {quote.article_url && (
            <a
              className="work"
              href={quote.article_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              Source article
            </a>
          )}
          {year && <span className="year">{year}</span>}
        </div>
      </div>
      <div className="vote">
        <div className="vote-row">
          <span className="lbl">Score</span>
          <span className="score-val">{localVotes >= 0 ? '+' : ''}{localVotes}</span>
        </div>
        <div className="vote-row">
          <span className="lbl">Votes</span>
          <span className="votes-val">{Math.abs(localVotes)}</span>
        </div>
        <div className="vote-actions">
          <button
            onClick={() => handleVote('for')}
            style={userVote === 'for' ? { borderColor: 'var(--green-500)', color: 'var(--green-700)', background: 'var(--green-50)' } : {}}
          >
            ▲ For
          </button>
          <button
            onClick={() => handleVote('against')}
            style={userVote === 'against' ? { borderColor: '#e74c3c', color: '#c0392b', background: '#fdf2f2' } : {}}
          >
            ▼ Against
          </button>
        </div>
      </div>
    </article>
  )
}

// ── Quotes section ─────────────────────────────────────────────────────
function Quotes({ quotes, status, activeFilter, sort, onFilterChange, onSortChange }) {
  const loading = status === 'loading'

  const sorted = quotes ? [...quotes].sort((a, b) => {
    if (sort === 'time') {
      return (b.article_date ?? '').localeCompare(a.article_date ?? '')
    }
    return 0
  }) : []

  return (
    <section className="quotes shell">
      <div className="section-head">
        <h2>Quotes</h2>
        <span className="count">
          {loading
            ? <><span className="pulse" /> Loading from source</>
            : `${quotes?.length ?? 0} attributed`
          }
        </span>
      </div>

      <div className="filter-strip">
        <button
          className={`chip${activeFilter === 'top-rated' ? ' active' : ''}`}
          onClick={() => onFilterChange('top-rated')}
        >
          Top rated <span className="caret">▾</span>
        </button>
        <button
          className={`chip${activeFilter === 'by-trait' ? ' active' : ''}`}
          onClick={() => onFilterChange('by-trait')}
        >
          By trait <span className="caret">▾</span>
        </button>
        <button
          className={`chip${sort === 'time' ? ' active' : ''}`}
          onClick={() => onSortChange(sort === 'time' ? 'score' : 'time')}
        >
          Sorted by time <span className="caret">▾</span>
        </button>
      </div>

      <div className="quote-list">
        {loading
          ? QUOTE_SKELETONS.map((q, i) => <QuoteSkeleton key={i} rank={i + 1} lines={q} />)
          : sorted.map((q, i) => <QuoteCard key={q.id} rank={i + 1} quote={q} />)
        }
      </div>
    </section>
  )
}

// ── AuthorPage ─────────────────────────────────────────────────────────
export default function AuthorPage() {
  const { slug } = useParams()

  const [authorName, setAuthorName]   = useState(null)
  const [traitData,  setTraitData]    = useState(null)
  const [quotes,     setQuotes]       = useState(null)
  const [quotesStatus, setQuotesStatus] = useState('loading')
  const [activeFilter, setActiveFilter] = useState('top-rated')
  const [sort, setSort] = useState('score')

  const loadData = useCallback(async () => {
    try {
      const [allTraits, allQuotes] = await Promise.all([
        fetchAuthorTraits(),
        fetchQuotes(),
      ])

      const allNames = allTraits.map(t => t.author)
      const name = matchAuthor(slug, allNames)
      setAuthorName(name)

      if (name) {
        const traitRow = allTraits.find(t => t.author === name)
        if (traitRow) {
          setTraitData(parseAssessment(traitRow.assessment))
        }

        const authorQuotes = allQuotes.filter(q => q.author === name)
        setQuotes(authorQuotes)
        setQuotesStatus('idle')
      } else {
        setQuotes([])
        setQuotesStatus('idle')
      }
    } catch (err) {
      console.error(err)
      setQuotesStatus('error')
    }
  }, [slug])

  useEffect(() => { loadData() }, [loadData])

  const traitLoading = quotesStatus === 'loading'

  if (quotesStatus === 'idle' && !authorName) {
    return (
      <div style={{ padding: '80px 40px', textAlign: 'center', color: 'var(--ink-3)', fontFamily: 'IBM Plex Sans' }}>
        Author not found.
      </div>
    )
  }

  return (
    <>
      <Header />
      <Breadcrumb authorName={authorName} />
      <Hero
        author={authorName}
        traitData={traitData}
        quotesTotal={quotes?.length ?? null}
        loading={traitLoading}
      />
      <Quotes
        quotes={quotes}
        status={quotesStatus}
        activeFilter={activeFilter}
        sort={sort}
        onFilterChange={setActiveFilter}
        onSortChange={setSort}
      />
    </>
  )
}
