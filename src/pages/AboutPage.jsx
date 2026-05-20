import { Link } from 'react-router-dom'
import Header from '../components/Header'

function StepCard({ number, title, body }) {
  return (
    <div style={{background:'var(--surface)',border:'1px solid var(--line)',borderRadius:14,padding:'28px 32px',display:'flex',gap:24,alignItems:'flex-start'}}>
      <div style={{flexShrink:0,width:36,height:36,borderRadius:'50%',background:'var(--green-700)',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'JetBrains Mono', monospace",fontSize:14,fontWeight:600}}>
        {number}
      </div>
      <div>
        <div style={{fontFamily:"'Source Serif 4', serif",fontSize:18,fontWeight:600,color:'var(--green-900)',marginBottom:8}}>{title}</div>
        <div style={{fontSize:15,lineHeight:1.6,color:'var(--ink-3)'}}>{body}</div>
      </div>
    </div>
  )
}

function PrincipleCard({ title, body }) {
  return (
    <div style={{background:'var(--surface)',border:'1px solid var(--line)',borderRadius:14,padding:'28px 32px'}}>
      <div style={{fontFamily:"'JetBrains Mono', monospace",fontSize:11,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.12em',color:'var(--green-700)',marginBottom:12}}>{title}</div>
      <div style={{fontSize:15,lineHeight:1.65,color:'var(--ink-3)'}}>{body}</div>
    </div>
  )
}

export default function AboutPage() {
  return (
    <>
      <Header />

      {/* Hero */}
      <section className="shell" style={{paddingTop:72,paddingBottom:64,maxWidth:780,textAlign:'center',marginInline:'auto'}}>
        <div className="home-eyebrow">About Faval.AI</div>
        <h1 style={{fontFamily:"'Source Serif 4', serif",fontSize:'clamp(40px, 5vw, 64px)',fontWeight:600,lineHeight:1.06,letterSpacing:'-0.015em',color:'var(--green-900)',textWrap:'balance',marginBottom:24}}>
          Holding public figures<br />accountable — automatically
        </h1>
        <p style={{fontSize:18,lineHeight:1.6,color:'var(--ink-3)',maxWidth:580,marginInline:'auto',marginBottom:36}}>
          Faval.AI is a non-profit initiative that uses independent, open-source AI to
          continuously track and rate the statements of politicians and public figures
          across Europe — so citizens don't have to.
        </p>
        <Link to="/donate-suggest" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'12px 28px',background:'var(--green-700)',color:'#fff',borderRadius:999,fontSize:15,fontWeight:500,transition:'background 140ms ease'}}
          onMouseEnter={e => e.currentTarget.style.background='var(--green-900)'}
          onMouseLeave={e => e.currentTarget.style.background='var(--green-700)'}
        >
          Support the mission
        </Link>
      </section>

      {/* Divider */}
      <div className="shell"><div style={{borderTop:'1px solid var(--line)'}} /></div>

      {/* Mission */}
      <section className="shell" style={{paddingTop:56,paddingBottom:64,maxWidth:780,marginInline:'auto'}}>
        <div className="home-eyebrow" style={{textAlign:'left'}}>The Problem</div>
        <h2 style={{fontFamily:"'Source Serif 4', serif",fontSize:'clamp(28px,3.5vw,42px)',fontWeight:600,letterSpacing:'-0.01em',color:'var(--green-900)',marginBottom:20,lineHeight:1.15}}>
          Keeping up is a full-time job
        </h2>
        <p style={{fontSize:16,lineHeight:1.7,color:'var(--ink-3)',marginBottom:16}}>
          European citizens are navigating an ever-growing volume of political discourse — speeches,
          interviews, press releases, social posts — across dozens of countries, languages, and
          institutions. No individual can reliably follow it all, let alone fact-check it.
        </p>
        <p style={{fontSize:16,lineHeight:1.7,color:'var(--ink-3)'}}>
          That information gap creates space for misleading narratives to spread unchallenged.
          Faval.AI exists to close it. We automatically collect public statements, feed them to
          unbiased third-party AI models, and publish credibility scores that anyone can inspect.
        </p>
      </section>

      {/* How it works */}
      <section style={{background:'var(--paper-soft)',borderTop:'1px solid var(--line)',borderBottom:'1px solid var(--line)',paddingTop:56,paddingBottom:64}}>
        <div className="shell" style={{maxWidth:780,marginInline:'auto'}}>
          <div className="home-eyebrow" style={{textAlign:'left'}}>How It Works</div>
          <h2 style={{fontFamily:"'Source Serif 4', serif",fontSize:'clamp(28px,3.5vw,42px)',fontWeight:600,letterSpacing:'-0.01em',color:'var(--green-900)',marginBottom:32,lineHeight:1.15}}>
            Automated, transparent, repeatable
          </h2>
          <div style={{display:'flex',flexDirection:'column',gap:16}}>
            <StepCard
              number="1"
              title="Collect public statements"
              body="Our pipeline continuously scans news sources, official records, and public feeds to surface quotes attributed to tracked public figures."
            />
            <StepCard
              number="2"
              title="Assess with independent AI"
              body="Each statement is evaluated by open-source language models — not proprietary black boxes. Models score statements across dimensions like consistency, factual grounding, and rhetoric quality."
            />
            <StepCard
              number="3"
              title="Publish transparent scores"
              body="Results are published openly. Every score links back to the source quote and the model's reasoning, so anyone can verify or challenge the assessment."
            />
          </div>
        </div>
      </section>

      {/* Principles */}
      <section className="shell" style={{paddingTop:56,paddingBottom:64,maxWidth:780,marginInline:'auto'}}>
        <div className="home-eyebrow" style={{textAlign:'left'}}>Our Principles</div>
        <h2 style={{fontFamily:"'Source Serif 4', serif",fontSize:'clamp(28px,3.5vw,42px)',fontWeight:600,letterSpacing:'-0.01em',color:'var(--green-900)',marginBottom:32,lineHeight:1.15}}>
          Built for trust
        </h2>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(280px, 1fr))',gap:16}}>
          <PrincipleCard
            title="Non-profit"
            body="Faval.AI is operated as a non-profit. We have no commercial interest in any political party, publication, or public figure we assess."
          />
          <PrincipleCard
            title="Model independence"
            body="We use third-party, open-source AI models with no affiliation to any political entity. Model versions and prompts are published openly."
          />
          <PrincipleCard
            title="No editorial layer"
            body="Scores are generated algorithmically. No human editor selects which statements pass or fail — the model output is published as-is."
          />
          <PrincipleCard
            title="Community-directed"
            body="The public figures we track are nominated by our community. Donors vote on who gets added next, keeping the agenda in citizens' hands."
          />
        </div>
      </section>

      {/* CTA */}
      <section style={{background:'var(--green-900)',paddingTop:64,paddingBottom:72}}>
        <div className="shell" style={{maxWidth:600,marginInline:'auto',textAlign:'center'}}>
          <div style={{fontFamily:"'JetBrains Mono', monospace",fontSize:11,fontWeight:500,textTransform:'uppercase',letterSpacing:'0.14em',color:'var(--green-200)',marginBottom:20}}>Get Involved</div>
          <h2 style={{fontFamily:"'Source Serif 4', serif",fontSize:'clamp(28px,3.5vw,42px)',fontWeight:600,letterSpacing:'-0.01em',color:'#fff',marginBottom:16,lineHeight:1.15}}>
            Help us grow the coverage
          </h2>
          <p style={{fontSize:16,lineHeight:1.6,color:'var(--green-200)',marginBottom:36}}>
            A small donation gets you votes to nominate the next public figure we track.
            Every euro goes toward infrastructure and model costs — nothing else.
          </p>
          <Link to="/donate-suggest" style={{display:'inline-flex',alignItems:'center',gap:8,padding:'13px 32px',background:'var(--green-500)',color:'#fff',borderRadius:999,fontSize:15,fontWeight:500,transition:'background 140ms ease'}}
            onMouseEnter={e => e.currentTarget.style.background='var(--green-300)'}
            onMouseLeave={e => e.currentTarget.style.background='var(--green-500)'}
          >
            Donate &amp; Suggest a public figure
          </Link>
        </div>
      </section>
    </>
  )
}
