import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Header from '../components/Header'
import { fetchAuthorFeeds, voteForAuthorFeed, createDonationCheckout, fetchDonationSession } from '../api'


function VoteIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="m18 15-6-6-6 6"/>
    </svg>
  )
}

const AMOUNTS = [1, 5, 10, 20]

// ── Post-payment panel ────────────────────────────────────────────────

function VotePanel({ sessionId, feeds, setFeeds }) {
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [suggestion, setSuggestion] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchDonationSession(sessionId)
      .then(setSession)
      .catch(() => setError('Could not load your donation session.'))
      .finally(() => setLoading(false))
  }, [sessionId])

  async function handleVote(authorName) {
    if (!authorName.trim()) return
    setSubmitting(true)
    setError(null)
    try {
      const updated = await voteForAuthorFeed(authorName.trim(), sessionId)
      setFeeds(prev => {
        const idx = prev.findIndex(f => f.author_name === updated.author_name)
        const next = idx >= 0
          ? prev.map((f, i) => i === idx ? updated : f)
          : [updated, ...prev]
        return next.sort((a, b) => b.total_votes - a.total_votes)
      })
      setSession(s => ({ ...s, votes_remaining: s.votes_remaining - 1, votes_used: s.votes_used + 1 }))
      setSuggestion('')
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div style={{padding:'24px 0', color:'var(--ink-3)'}}>Loading your votes…</div>
  if (error && !session) return <div style={{padding:'24px 0', color:'var(--gold)'}}>{error}</div>

  return (
    <div style={{background:'var(--surface)', border:'1px solid var(--green-500)', borderRadius:'14px', padding:'28px 32px', marginBottom:'48px', maxWidth:'600px'}}>
      <p className="home-eyebrow" style={{marginBottom:'8px'}}>Thank you for donating!</p>
      <h2 style={{fontFamily:"'Source Serif 4', serif", fontSize:'26px', fontWeight:600, color:'var(--green-900)', marginBottom:'6px'}}>
        You have {session.votes_remaining} vote{session.votes_remaining !== 1 ? 's' : ''} remaining
      </h2>
      <p style={{fontSize:'14px', color:'var(--ink-3)', marginBottom:'24px'}}>
        {session.votes_used} of {session.votes_total} used · Nominate a public figure below or upvote one from the list.
      </p>

      {session.votes_remaining > 0 ? (
        <form
          onSubmit={e => { e.preventDefault(); handleVote(suggestion) }}
          style={{display:'flex', gap:'10px'}}
        >
          <div className="search-field" style={{flex:1, borderRadius:'10px'}}>
            <input
              type="text"
              placeholder="Name a public figure to track…"
              value={suggestion}
              onChange={e => setSuggestion(e.target.value)}
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            className="btn"
            disabled={!suggestion.trim() || submitting}
            style={{
              borderRadius:'10px', padding:'0 22px',
              background: suggestion.trim() ? 'var(--green-700)' : undefined,
              color: suggestion.trim() ? '#fff' : undefined,
              borderColor: suggestion.trim() ? 'var(--green-700)' : undefined,
            }}
          >
            {submitting ? 'Voting…' : 'Cast vote'}
          </button>
        </form>
      ) : (
        <p style={{fontSize:'14px', color:'var(--ink-3)'}}>All votes used — donate again to get more.</p>
      )}

      {error && <p style={{marginTop:'10px', fontSize:'13px', color:'var(--gold)'}}>{error}</p>}
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────

export default function DonateSuggestPage() {
  const [searchParams] = useSearchParams()
  const sessionId = searchParams.get('session_id')

  const [feeds, setFeeds] = useState([])
  const [feedsLoading, setFeedsLoading] = useState(true)

  const [amount, setAmount] = useState(5)
  const [customAmount, setCustomAmount] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)

  const [votingId, setVotingId] = useState(null)

  const effectiveAmount = customAmount ? parseInt(customAmount, 10) : amount

  useEffect(() => {
    fetchAuthorFeeds()
      .then(setFeeds)
      .catch(() => {})
      .finally(() => setFeedsLoading(false))
  }, [])

  async function handleDonate() {
    if (!effectiveAmount || effectiveAmount < 1) return
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const { checkout_url } = await createDonationCheckout(effectiveAmount)
      window.location.href = checkout_url
    } catch (e) {
      setCheckoutError('Could not start checkout. Please try again.')
      setCheckoutLoading(false)
    }
  }

  async function handleLeaderboardVote(authorName, feedId) {
    // Free upvote from the leaderboard (no session required)
    setVotingId(feedId)
    try {
      const updated = await voteForAuthorFeed(authorName)
      setFeeds(prev =>
        prev.map(f => f.author_name === updated.author_name ? updated : f)
            .sort((a, b) => b.total_votes - a.total_votes)
      )
    } catch {
      // silently ignore
    } finally {
      setVotingId(null)
    }
  }

  return (
    <>
      <Header />
      <main>
        <div className="shell">

          {/* ── Success: vote panel ── */}
          {sessionId && (
            <div style={{paddingTop:'48px'}}>
              <VotePanel sessionId={sessionId} feeds={feeds} setFeeds={setFeeds} />
            </div>
          )}

          {/* ── Hero + donation form ── */}
          {!sessionId && (
            <section style={{paddingTop:'72px', paddingBottom:'64px', maxWidth:'680px'}}>
              <p className="home-eyebrow">Community</p>
              <h1 style={{fontFamily:"'Source Serif 4', serif", fontSize:'clamp(40px, 5vw, 64px)', fontWeight:600, lineHeight:1.06, letterSpacing:'-0.015em', color:'var(--green-900)', marginBottom:'20px', textWrap:'balance'}}>
                Help us track the next public figure
              </h1>
              <p style={{fontSize:'18px', lineHeight:1.6, color:'var(--ink-3)', marginBottom:'40px', maxWidth:'560px'}}>
                Every €1 donated gives you one weighted vote. The figures with the most votes get added to the ranking next.
              </p>

              {/* Amount picker */}
              <div style={{marginBottom:'16px'}}>
                <p style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'11px', textTransform:'uppercase', letterSpacing:'.1em', color:'var(--green-700)', marginBottom:'12px'}}>Choose amount</p>
                <div style={{display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px'}}>
                  {AMOUNTS.map(a => (
                    <button
                      key={a}
                      onClick={() => { setAmount(a); setCustomAmount('') }}
                      className="btn"
                      style={{
                        minWidth:'64px',
                        background: amount === a && !customAmount ? 'var(--green-700)' : undefined,
                        color: amount === a && !customAmount ? '#fff' : undefined,
                        borderColor: amount === a && !customAmount ? 'var(--green-700)' : undefined,
                      }}
                    >
                      €{a}
                    </button>
                  ))}
                  <div className="search-field" style={{borderRadius:'10px', padding:'7px 14px', width:'120px'}}>
                    <span style={{color:'var(--ink-3)', fontSize:'14px'}}>€</span>
                    <input
                      type="number"
                      min="1"
                      placeholder="Other"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      style={{width:'100%'}}
                    />
                  </div>
                </div>

                {effectiveAmount >= 1 && (
                  <p style={{fontSize:'13px', color:'var(--ink-3)', marginBottom:'20px'}}>
                    €{effectiveAmount} = <strong style={{color:'var(--green-700)'}}>{effectiveAmount} vote{effectiveAmount !== 1 ? 's' : ''}</strong> to allocate after payment
                  </p>
                )}

                <button
                  className="btn"
                  onClick={handleDonate}
                  disabled={!effectiveAmount || effectiveAmount < 1 || checkoutLoading}
                  style={{
                    borderRadius:'10px', padding:'12px 28px', fontSize:'15px',
                    background:'var(--green-700)', color:'#fff', borderColor:'var(--green-700)',
                  }}
                >
                  {checkoutLoading ? 'Redirecting…' : `Donate €${effectiveAmount || '—'} with Stripe Link`}
                </button>

                {checkoutError && (
                  <p style={{marginTop:'10px', fontSize:'13px', color:'var(--gold)'}}>{checkoutError}</p>
                )}
              </div>

              {/* How it works */}
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:'14px', marginTop:'40px'}}>
                {[
                  { step:'01', label:'Donate', desc:'Pay via Stripe Link — card or saved wallet, one click.' },
                  { step:'02', label:'Nominate', desc:'After payment you\'re redirected back with votes to spend.' },
                  { step:'03', label:'We track', desc:'Top-voted figures are added to the ranking feed.' },
                ].map(({ step, label, desc }) => (
                  <div key={step} style={{background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'20px'}}>
                    <span style={{fontFamily:"'JetBrains Mono', monospace", fontSize:'10px', textTransform:'uppercase', letterSpacing:'.1em', color:'var(--green-500)', display:'block', marginBottom:'8px'}}>{step}</span>
                    <strong style={{fontSize:'15px', color:'var(--ink)', display:'block', marginBottom:'6px'}}>{label}</strong>
                    <p style={{fontSize:'13px', color:'var(--ink-3)', lineHeight:1.5}}>{desc}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* ── Leaderboard ── */}
          <section style={{paddingBottom:'96px'}}>
            <div className="section-head">
              <h2>{sessionId ? 'Or upvote an existing suggestion' : 'Current suggestions'}</h2>
              <span className="count">
                <span className="pulse" />
                {feedsLoading ? '—' : feeds.length} nominated
              </span>
            </div>

            {feedsLoading && (
              <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'8px'}}>
                {[1,2,3].map(i => <span key={i} className="skel w-90" style={{height:'60px', borderRadius:'10px'}} />)}
              </div>
            )}

            {!feedsLoading && feeds.length === 0 && (
              <p style={{color:'var(--ink-3)', fontSize:'15px', paddingTop:'8px'}}>No suggestions yet — be the first.</p>
            )}

            {!feedsLoading && feeds.length > 0 && (
              <div style={{display:'flex', flexDirection:'column', gap:'10px', marginTop:'8px'}}>
                {feeds.map((feed, idx) => (
                  <div
                    key={feed.id ?? feed.author_name}
                    style={{display:'grid', gridTemplateColumns:'40px 1fr auto', gap:'20px', alignItems:'center', background:'var(--surface)', border:'1px solid var(--line)', borderRadius:'12px', padding:'18px 24px'}}
                  >
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
                        onClick={() => handleLeaderboardVote(feed.author_name, feed.id ?? feed.author_name)}
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
