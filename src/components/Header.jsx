import { NavLink } from 'react-router-dom'

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

export default function Header() {
  return (
    <header className="site">
      <div className="shell row">
        <div className="brand">
          <img className="mark" src="/logo.svg" alt="" />
          <img className="wordmark" src="/faval-wordmark.svg" alt="Faval.AI" />
        </div>
        <nav className="primary">
          <NavLink to="/" end>Ranking</NavLink>
          <NavLink to="/quote-stream">Quote Stream</NavLink>
          <NavLink to="/donate-suggest">Donate &amp; Suggest</NavLink>
          <NavLink to="/about">About</NavLink>
        </nav>
        <div className="actions">
          <button className="btn">
            <CompareIcon /> Compare
            <span style={{fontSize:'9px',fontWeight:600,letterSpacing:'.4px',textTransform:'uppercase',background:'#e8f5f0',color:'#0F6E56',border:'1px solid #b6ddd1',borderRadius:'20px',padding:'1px 6px',whiteSpace:'nowrap'}}>to come</span>
          </button>
          <button className="icon-btn" aria-label="Search"><SearchIcon /></button>
        </div>
      </div>
    </header>
  )
}
