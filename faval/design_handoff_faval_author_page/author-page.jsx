// Author Page — hi-fi
// Trait scorecard is in blank/skeleton state (data fed by API).

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

function CompareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h12l-3-3M3 6l3 3" />
      <path d="M21 18H9l3 3M21 18l-3-3" />
    </svg>
  );
}

function Header() {
  return (
    <header className="site">
      <div className="shell row">
        <div className="brand">
          <img className="mark" src="logo.svg" alt="" />
          <img className="wordmark" src="faval-wordmark.svg" alt="Faval" />
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
  );
}

function Breadcrumb() {
  return (
    <div className="breadcrumb shell">
      <a href="#">Home</a>
      <span className="sep">/</span>
      <a href="#">Ranking</a>
      <span className="sep">/</span>
      <span>Author</span>
    </div>
  );
}

function TraitScorecard() {
  // Blank state — data populated from API
  const rows = [
    { n: '1', skel: 'w-90' },
    { n: '2', skel: 'w-75' },
    { n: '3', skel: 'w-90' },
    { n: '4', skel: 'w-60' },
    { n: '5', skel: 'w-75' },
    { n: 'NR', skel: 'w-50', nr: true },
  ];
  return (
    <aside className="scorecard">
      <header className="card">
        <div className="card-title">Trait scores</div>
        <div className="status">
          <span className="pulse"></span>
          Loading
        </div>
      </header>
      {rows.map((r, i) => (
        <div key={i} className="trait-row">
          <span className={'num' + (r.nr ? ' nr' : '')}>{r.n}</span>
          <div className={'skel ' + r.skel}></div>
          <div className="skel score"></div>
        </div>
      ))}
    </aside>
  );
}

function Hero() {
  return (
    <section className="hero shell">
      <div>
        <div className="eyebrow" style={{ marginBottom: 18 }}>Author · Ranked #—</div>
        <h1>Author name</h1>
        <p className="epithet">A short epithet or one-line description of the author goes here — pulled from the source biography.</p>
        <div className="meta">
          <span className="item"><strong>Born</strong> <span>—</span></span>
          <span className="dot" aria-hidden></span>
          <span className="item"><strong>Era</strong> <span>—</span></span>
          <span className="dot" aria-hidden></span>
          <span className="item"><strong>Language</strong> <span>—</span></span>
          <span className="dot" aria-hidden></span>
          <span className="item"><strong>Quotes</strong> <span>148</span></span>
        </div>
      </div>
      <TraitScorecard />
    </section>
  );
}

function Quote({ rank, text, work, year, score, votes }) {
  return (
    <article className="quote">
      <div className="rank">№{String(rank).padStart(2, '0')}</div>
      <div className="body">
        <blockquote>{text}</blockquote>
        <div className="source">
          <span className="work">{work}</span>
          <span className="year">{year}</span>
        </div>
      </div>
      <div className="vote">
        <div className="vote-row">
          <span className="lbl">Score</span>
          <span className="score">{score}</span>
        </div>
        <div className="vote-row">
          <span className="lbl">Votes</span>
          <span className="score" style={{ fontSize: 14, color: 'var(--ink-3)' }}>{votes}</span>
        </div>
        <div className="vote-actions">
          <button>▲ For</button>
          <button>▼ Against</button>
        </div>
      </div>
    </article>
  );
}

const QUOTE_SKELETONS = [
  { lines: ['w-90', 'w-75', 'w-60'] },
  { lines: ['w-90', 'w-50'] },
  { lines: ['w-75', 'w-90', 'w-60'] },
  { lines: ['w-90', 'w-75'] },
  { lines: ['w-60', 'w-90', 'w-50'] },
];

function QuoteSkeleton({ rank, lines }) {
  return (
    <article className="quote">
      <div className="rank">№{String(rank).padStart(2, '0')}</div>
      <div className="body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {lines.map((w, i) => (
            <div key={i} className={'skel ' + w} style={{ height: 22, borderRadius: 6 }}></div>
          ))}
        </div>
        <div className="source">
          <div className="skel w-50" style={{ height: 14, width: 140, borderRadius: 4 }}></div>
          <div className="skel" style={{ height: 14, width: 56, borderRadius: 4 }}></div>
        </div>
      </div>
      <div className="vote">
        <div className="vote-row">
          <span className="lbl">Score</span>
          <div className="skel score"></div>
        </div>
        <div className="vote-row">
          <span className="lbl">Votes</span>
          <div className="skel score" style={{ width: 40 }}></div>
        </div>
        <div className="vote-actions">
          <button disabled>▲ For</button>
          <button disabled>▼ Against</button>
        </div>
      </div>
    </article>
  );
}

function Quotes() {
  return (
    <section className="quotes shell">
      <div className="section-head">
        <h2>Quotes</h2>
        <span className="count">
          <span className="pulse" style={{ display: 'inline-block', marginRight: 8, verticalAlign: 'middle' }}></span>
          Loading from source
        </span>
      </div>
      <div className="filter-strip">
        <button className="chip active">Top rated <span className="caret"></span></button>
        <button className="chip">By trait <span className="caret"></span></button>
        <button className="chip">Sorted by time <span className="caret"></span></button>
      </div>
      <div className="quote-list">
        {QUOTE_SKELETONS.map((q, i) => <QuoteSkeleton key={i} rank={i + 1} lines={q.lines} />)}
      </div>
    </section>
  );
}

function App() {
  return (
    <>
      <Header />
      <Breadcrumb />
      <Hero />
      <Quotes />
    </>
  );
}

ReactDOM.createRoot(document.body.appendChild(document.createElement('div'))).render(<App />);
