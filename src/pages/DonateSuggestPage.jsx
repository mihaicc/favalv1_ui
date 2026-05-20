import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { fetchAuthorFeeds, voteForAuthorFeed } from '../api'

function Header() {
  return (
    <header className="site">
      <div className="shell row">
        <div className="brand">
          <Link to="/">
            <img className="mark" src="/logo.svg" alt="" />
          </Link>
          <Link to="/">
            <img className="wordmark" src="/faval-wordmark.svg" alt="Faval.AI" />
          </Link>
        </div>
        <nav className="primary">
          <Link to="/">Ranking</Link>
          <a href="#">Quote Stream <span style={{fontSize:'9px',fontWeight:600,letterSpacing:'.4px',textTransform:'uppercase',background:'#e8f5f0',color:'#0F6E56',border:'1px solid #b6ddd1',borderRadius:'20px',padding:'1px 6px',verticalAlign:'middle',whiteSpace:'nowrap'}}>to come</span></a>
          <Link to="/donate-suggest" className="active">Donate &amp; Suggest</Link>
          <a href="#">About</a>
        </nav>
      </div>
    </header>
  )
}

function CoinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M14.5 9a2.5 2.5 0 0 0-5 0v6a2.5 2.5 0 0 0 5 0" />
    </svg>
  )
}

function VoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  )
}

export default function DonateSuggestPage() {
  const [feeds, setFeeds] = useState([])
  const [loading, setLoading] = useState(true)
  const [suggestion, setSuggestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(null)
  const [votingId, setVotingId] = useState(null)

  useEffect(() => {
    fetchAuthorFeeds()
      .then(setFeeds)
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  async function handleSuggest(e) {
    e.preventDefault()
    const name = suggestion.trim()
    if (!name) return
    setSubmitting(true)
    try {
      const updated = await voteForAuthorFeed(name)
      setFeeds(prev => {
        const idx = prev.findIndex(f => f.author_name === updated.author_name)
        if (idx >= 0) {
          const next = [...prev]
          next[idx] = updated
          return next.sort((a, b) => b.total_votes - a.total_votes)
        }
        return [updated, ...prev].sort((a, b) => b.total_votes - a.total_votes)
      })
      setSubmitted(name)
      setSuggestion('')
    } catch {
      // silently fail — vote endpoint not yet wired in this env
    } finally {
      setSubmitting(false)
    }
  }

  async function handleVote(authorName, feedId) {
    setVotingId(feedId)
    try {
      const updated = await voteForAuthorFeed(authorName)
      setFeeds(prev =>
        prev
          .map(f => (f.author_name === updated.author_name ? updated : f))
          .sort((a, b) => b.total_votes - a.total_votes)
      )
    } catch {
      // silently fail
    } finally {
      setVotingId(null)
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className="shell">

          {/* ── Hero ── */}
          <section style={{paddingTop:'72px', paddingBottom:'64px', maxWidth:'680px'}}>
            <p className="home-eyebrow">Community</p>
            <h1 style={{fontFamily:"'Source Serif 4', serif", fontSize:'clamp(40px, 5vw, 64px)', fontWeight:600, lineHeight:1.06, letterSpacing:'-0.015em', color:'var(--green-900)', marginBottom:'20px', textWrap:'balance'}}>
              Help us track the next public figure
            </h1>
            <p style={{fontSize:'18px', lineHeight:1.6, color:'var(--ink-3)', marginBottom:'36px', maxWidth:'560px'}}>
              For every euro donated, you receive one weighted vote to nominate a public figure for tracking. The figures with the most votes get added next.
            </p>

            {/* Mechanic cards */}
            <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'14px', marginBottom:'48px'}}>
              {[
                { step: '01', label: 'Donate', desc: '1 € = 1 vote. Payment integration coming soon.' },
                { step: '02', label: 'Nominate', desc: 'Submit any public figure below — or upvote one already suggested.' },
                { step: '03', label: 'We track', desc: 'Top-voted figures get added to the ranking feed.' },
              ].map(({ step, label, desc }) => (
                <div key={step} style={{background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'20px'}}>
                  <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'10px', textTransform:'uppercase', letterSpacing:'.1em', color:'var(--green-500)', display:'block', marginBottom:'8px'}}>{step}</span>
                  <strong style={{fontSize:'15px', color:'var(--ink)', display:'block', marginBottom:'6px'}}>{label}</strong>
                  <p style={{fontSize:'13px', color:'var(--ink-3)', lineHeight:1.5}}>{desc}</p>
                </div>
              ))}
            </div>

            {/* Suggest form */}
            <form onSubmit={handleSuggest} style={{display:'flex', gap:'10px', maxWidth:'520px'}}>
              <div className="search-field" style={{flex:1, borderRadius:'10px'}}>
                <CoinIcon />
                <input
                  type="text"
                  placeholder="Suggest a public figure…"
                  value={suggestion}
                  onChange={e => { setSuggestion(e.target.value); setSubmitted(null) }}
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                className="btn"
                disabled={!suggestion.trim() || submitting}
                style={{borderRadius:'10px', padding:'0 22px', background: suggestion.trim() ? 'var(--green-700)' : undefined, color: suggestion.trim() ? '#fff' : undefined, borderColor: suggestion.trim() ? 'var(--green-700)' : undefined}}
              >
                {submitting ? 'Submitting…' : 'Suggest'}
              </button>
            </form>
            {submitted && (
              <p style={{marginTop:'12px', fontSize:'13.5px', color:'var(--green-700)'}}>
                Suggestion recorded for <strong>{submitted}</strong>. Payment integration will link donations to votes shortly.
              </p>
            )}
          </section>

          {/* ── Leaderboard ── */}
          <section style={{paddingBottom:'96px'}}>
            <div className="section-head">
              <h2>Current suggestions</h2>
              <span className="count">
                <span className="pulse" />
                {loading ? '—' : feeds.length} nominated
              </span>
            </div>

            {loading && (
              <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'8px'}}>
                {[1,2,3].map(i => <span key={i} className="skel w-90" style={{height:'60px', borderRadius:'10px'}} />)}
              </div>
            )}

            {!loading && feeds.length === 0 && (
              <p style={{color:'var(--ink-3)', fontSize:'15px', paddingTop:'8px'}}>No suggestions yet — be the first.</p>
            )}

            {!loading && feeds.length > 0 && (
              <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'8px'}}>
                {feeds.map((feed, idx) => (
                  <div key={feed.id ?? feed.author_name} style={{display:'grid', gridTemplateColumns:'40px 1fr auto', gap:'20px', alignItems:'center', background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'18px 24px', transition:'border-color 160ms ease'}}>
                    <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'13px', color:'var(--ink-3)', letterSpacing:'.04em'}}>#{idx + 1}</span>
                    <div>
                      <span style={{fontSize:'15px', fontWeight:500, color:'var(--ink)'}}>{feed.author_name}</span>
                      {feed.active_feed && (
                        <span style={{marginLeft:'10px', fontSize:'9px', fontWeight:600, letterSpacing:'.4px', textTransform:'uppercase', background:'var(--surface-tint)', color:'var(--green-700)', border:'1px solid #b6ddd1', borderRadius:'20px', padding:'1px 6px', verticalAlign:'middle'}}>tracking</span>
                      )}
                    </div>
                    <div style={{display:'flex', alignItems:'center', gap:'12px'}}>
                      <span style={{fontFamily:"'Source Serif 4', serif", fontSize:'20px', fontWeight:600, color:'var(--green-900)', fontVariantNumeric:'tabular-nums'}}>{feed.total_votes}</span>
                      <span style={{fontSize:'12px', color:'var(--ink-3)'}}>vote{feed.total_votes !== 1 ? 's' : ''}</span>
                      <button
                        className="btn"
                        style={{padding:'5px 12px', fontSize:'12px', display:'flex', alignItems:'center', gap:'4px'}}
                        disabled={votingId === (feed.id ?? feed.author_name)}
                        onClick={() => handleVote(feed.author_name, feed.id ?? feed.author_name)}
                      >
                        <VoteIcon /> Vote
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </main>
    </>
  )
}
