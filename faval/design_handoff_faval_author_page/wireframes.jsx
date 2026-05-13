const { useState } = React;

// Reusable slot — the yellow dashed label representing editable data
function Slot({ children, size, muted, style }) {
  const cls = `slot ${size === 'lg' ? 'lg' : size === 'sm' ? 'sm' : ''} ${muted ? 'muted' : ''}`;
  return <span className={cls.trim()} style={style}>{children}</span>;
}

function Annotation({ x, y, w, color, children, rotate }) {
  return (
    <div
      className={`annotation ${color === 'blue' ? 'blue' : ''}`}
      style={{
        left: x, top: y,
        width: w || 'auto',
        transform: rotate ? `rotate(${rotate}deg)` : 'none',
      }}
    >
      {children}
    </div>
  );
}

// SVG arrow connecting an annotation to a region
function Arrow({ from, to, curve = 0.3, color }) {
  const [x1, y1] = from;
  const [x2, y2] = to;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1, dy = y2 - y1;
  // perpendicular offset for curve
  const len = Math.hypot(dx, dy);
  const ox = -dy / len * 30 * curve;
  const oy = dx / len * 30 * curve;
  const cx = mx + ox, cy = my + oy;
  const stroke = color === 'blue' ? '#3e6dbd' : '#d65a2a';
  // arrowhead direction
  const ang = Math.atan2(y2 - cy, x2 - cx);
  const ah = 9;
  const ax1 = x2 - Math.cos(ang - 0.4) * ah;
  const ay1 = y2 - Math.sin(ang - 0.4) * ah;
  const ax2 = x2 - Math.cos(ang + 0.4) * ah;
  const ay2 = y2 - Math.sin(ang + 0.4) * ah;
  return (
    <svg className="arrow" style={{ left: 0, top: 0, width: '100%', height: '100%' }}>
      <path d={`M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`} stroke={stroke} strokeWidth="1.5" fill="none" strokeDasharray="0" />
      <polyline points={`${ax1},${ay1} ${x2},${y2} ${ax2},${ay2}`} stroke={stroke} strokeWidth="1.5" fill="none" />
    </svg>
  );
}

// =====================================================
// VARIATION A — Main layout (mirrors reference closely)
// =====================================================
function VariationA() {
  return (
    <div className="wf" style={{ width: 1280, height: 1700, padding: 0 }}>
      {/* HEADER */}
      <div style={{ background: '#e6ecf6', borderBottom: '1.5px solid #2a2a2a', padding: '20px 48px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <img src="logo.svg" alt="Faval logo" style={{ width: 64, height: 50, objectFit: 'contain', display: 'block' }} />
          <img src="faval-wordmark.svg" alt="Faval" style={{ height: 36, display: 'block' }} />
        </div>
        <div style={{ display: 'flex', gap: 28, marginLeft: 40 }}>
          <Slot muted>{'Ranking'}</Slot>
          <Slot muted>{'Quote Stream'}</Slot>
          <Slot muted>{'Donate and Suggest'}</Slot>
          <Slot muted>{'About '}</Slot>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12 }}>
          <div className="pill">⇄ <Slot sm>Compare</Slot></div>
          <div className="box" style={{ width: 40, height: 40, borderRadius: 999, display:'flex', alignItems:'center', justifyContent:'center' }}>🔍</div>
        </div>
      </div>

      {/* HERO BAND */}
      <div style={{ background: '#e6ecf6', padding: '20px 48px 40px' }}>
        {/* breadcrumb */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 24, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a5a' }}>
          <Slot sm>root</Slot> <span>›</span>
          <Slot sm>section</Slot> <span>›</span>
          <Slot sm>{'\n'}</Slot>
        </div>

        <div style={{ display: 'flex', gap: 48 }}>
          {/* Title column */}
          <div style={{ flex: 1.2 }}>
            <div className="wire-title" style={{ fontSize: 44, marginBottom: 12 }}>
              <Slot size="lg">{'{ Author name }'}</Slot>
            </div>
            <div style={{ marginTop: 16, fontFamily: 'Caveat', fontSize: 18, color: '#7a7a7a' }}>
              ↑ this is your H1 — what does this page describe?
            </div>
          </div>

          {/* Ratings legend column */}
          <div style={{ flex: 1, borderLeft: '1.5px solid #2a2a2a', paddingLeft: 24 }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#3e6dbd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
              <Slot sm>legend / rating scale heading</Slot>
            </div>
            {[
              ['1', '', 'dark'],
              ['2', '', 'dark'],
              ['3', '', 'dark'],
              ['4', '', 'gray'],
              ['5', '', 'gray'],
              ['NR', '', 'outline'],
            ].map(([n, lbl, kind], i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <span className={`num-badge ${kind === 'gray' ? 'gray' : kind === 'outline' ? 'outline' : ''}`}>{n}</span>
                <div style={{ flex: 1, height: 14, borderRadius: 3, background: 'repeating-linear-gradient(90deg, #d8d6cf 0 6px, transparent 6px 10px)', maxWidth: 200 }} aria-label="loading"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* BODY */}
      <div style={{ display: 'flex', padding: '36px 48px', gap: 48 }}>
        {/* Main */}
        <div style={{ flex: 1 }}>
          {/* Section: Definition */}
          <div style={{ marginBottom: 36 }}>
          </div>

          {/* Section: Programs (list of items) */}
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#3e6dbd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
              <Slot>list section heading</Slot>
            </div>

            {/* Item cards */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="box" style={{ display: 'flex', marginBottom: 16, background: '#fff', overflow: 'hidden' }}>
                {/* compare checkbox */}
                <div style={{ padding: '20px 18px', borderRight: '1.5px solid #2a2a2a', display: 'flex', alignItems: 'flex-start' }}>
                  <div className="pill" style={{ padding: '4px 10px', fontSize: 12 }}>
                    <Slot sm>compare</Slot>
                    <span style={{ width: 14, height: 14, border: '1.5px solid #2a2a2a', borderRadius: 3, display: 'inline-block' }}></span>
                  </div>
                </div>
                {/* title + desc */}
                <div style={{ flex: 1, padding: '20px 24px' }}>
                  <div style={{ marginBottom: 10 }}>
                    <Slot size="lg">{'item title — name of the thing'}</Slot>
                  </div>
                  <div>
                    <Slot muted>{'short description — who it is for, what it covers (1-2 lines)'}</Slot>
                  </div>
                </div>
                {/* rating */}
                <div style={{ width: 160, background: '#e6ecf6', borderLeft: '1.5px solid #2a2a2a', padding: '20px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#3e6dbd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>rating label</div>
                  <span className="num-badge" style={{ width: 32, height: 32, fontSize: 14 }}>{i}</span>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 14, fontFamily: 'Caveat', fontSize: 18, color: '#7a7a7a' }}>
              + repeat for each item in the list…
            </div>
          </div>
        </div>
      </div>

      {/* ANNOTATIONS — orange callouts */}
      <Annotation x={48} y={88} w={180} rotate={-2}>
        ← brand mark<br/>+ Home
      </Annotation>
      <Annotation x={530} y={88} w={200}>
        primary nav —<br/>what are your top-level sections?
      </Annotation>
      <Annotation x={1080} y={88} w={180}>
        utility actions:<br/>compare + search
      </Annotation>

      <Annotation x={780} y={245} w={220} color="blue">
        rating legend lives in the<br/>hero so the badges below<br/>are self-explanatory
      </Annotation>

      <Annotation x={1090} y={620} w={170} rotate={1}>
        
      </Annotation>

      <Annotation x={1090} y={920} w={170} color="blue">
        
      </Annotation>

      <Annotation x={1090} y={1380} w={170}>
        each card = one item<br/>in this topic's list
      </Annotation>

      <div className="legend">
        VARIATION A · faithful to ref
      </div>
    </div>
  );
}

// =====================================================
// VARIATION B — Tabbed nav instead of side-nav
// =====================================================
function VariationB() {
  return (
    <div className="wf" style={{ width: 1280, height: 1500 }}>
      {/* HEADER */}
      <div style={{ background: '#fbfaf7', borderBottom: '1.5px solid #2a2a2a', padding: '20px 48px', display: 'flex', alignItems: 'center', gap: 32 }}>
        <div className="box" style={{ width: 44, height: 44, background: '#1a1a1a', color: '#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono, monospace', fontSize:10 }}>LOGO</div>
        <Slot>{'{brand name}'}</Slot>
        <div style={{ display: 'flex', gap: 28, marginLeft: 40 }}>
          <Slot muted>nav 1</Slot>
          <Slot muted>nav 2</Slot>
          <Slot muted>nav 3</Slot>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="box" style={{ padding: '6px 14px', background: '#fff', minWidth: 220, display: 'flex', alignItems: 'center', gap: 8 }}>
            🔍 <Slot sm>global search bar</Slot>
          </div>
          <div className="pill dark"><Slot sm style={{ background: 'transparent', border: 'none', color: '#fff' }}>account</Slot></div>
        </div>
      </div>

      {/* TITLE BLOCK — left-aligned big */}
      <div style={{ padding: '40px 48px 0' }}>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a5a' }}>
          <Slot sm>root</Slot> › <Slot sm>section</Slot> › <Slot sm>page</Slot>
        </div>
        <div className="wire-title" style={{ fontSize: 52, marginBottom: 22, maxWidth: 900 }}>
          <Slot size="lg">{'{ topic / page title }'}</Slot>
        </div>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 26 }}>
          <Slot>category tag</Slot>
          <Slot>another tag</Slot>
          <Slot muted>+ tag</Slot>
        </div>
      </div>

      {/* TABS — replaces side nav */}
      <div style={{ padding: '0 48px', borderBottom: '1.5px solid #2a2a2a', display: 'flex', gap: 0 }}>
        {['tab 1 (active)', 'tab 2', 'tab 3', 'tab 4', 'tab 5'].map((t, i) => (
          <div
            key={i}
            style={{
              padding: '14px 22px',
              borderBottom: i === 0 ? '3px solid #d65a2a' : '3px solid transparent',
              marginBottom: -1.5,
              fontWeight: i === 0 ? 700 : 400,
            }}
          >
            <Slot muted={i !== 0}>{t}</Slot>
          </div>
        ))}
      </div>

      {/* TWO-COL: definition + side ratings card */}
      <div style={{ padding: '36px 48px', display: 'flex', gap: 36 }}>
        <div style={{ flex: 1.4 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#3e6dbd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            <Slot>section heading</Slot>
          </div>
          <div style={{ marginBottom: 18 }}>
            <Slot>{'intro paragraph copy'}</Slot>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginLeft: 20 }}>
            {['attr A', 'attr B', 'attr C', 'attr D'].map((lbl, i) => (
              <div key={i} style={{ display: 'flex', gap: 10 }}>
                <span>•</span>
                <Slot>{lbl}:</Slot>
                <Slot muted>{'value'}</Slot>
              </div>
            ))}
          </div>
        </div>
        {/* ratings card */}
        <div className="box" style={{ width: 320, padding: 20, background: '#fff' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#3e6dbd', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 14 }}>
            <Slot sm>rating scale</Slot>
          </div>
          {[1,2,3,4,5,'NR'].map((n, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
              <span className={`num-badge ${i >= 3 && i < 5 ? 'gray' : i === 5 ? 'outline' : ''}`}>{n}</span>
              <Slot>tier label</Slot>
            </div>
          ))}
        </div>
      </div>

      {/* LIST — denser cards */}
      <div style={{ padding: '0 48px 48px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, color: '#3e6dbd', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            <Slot>list section heading</Slot>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <Slot muted>sort by ▾</Slot>
            <Slot muted>filter ▾</Slot>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[1,2,3,4].map((i) => (
            <div key={i} className="box" style={{ background: '#fff', padding: 18, display: 'flex', gap: 14 }}>
              <span className="num-badge" style={{ width: 34, height: 34, fontSize: 14 }}>{i}</span>
              <div style={{ flex: 1 }}>
                <div style={{ marginBottom: 8 }}>
                  <Slot>item title</Slot>
                </div>
                <div style={{ marginBottom: 10 }}>
                  <Slot muted size="sm">short description / audience</Slot>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <Slot sm>tag</Slot>
                  <Slot sm muted>tag</Slot>
                </div>
              </div>
              <div style={{ width: 16, height: 16, border: '1.5px solid #2a2a2a', borderRadius: 3 }}></div>
            </div>
          ))}
        </div>
      </div>

      {/* annotations */}
      <Annotation x={48} y={250} w={210} rotate={-2}>
        bigger title, tags<br/>inline → quick scan
      </Annotation>
      <Annotation x={760} y={350} w={200} color="blue">
        tabs replace side-nav<br/>(good for ≤6 sections)
      </Annotation>
      <Annotation x={48} y={770} w={220}>
        rating card stays<br/>sticky on right while<br/>user scrolls definition
      </Annotation>
      <Annotation x={48} y={1080} w={230} color="blue">
        2-up dense card grid +<br/>sort/filter — fits more items<br/>above the fold
      </Annotation>

      <div className="legend">VARIATION B · tabs + 2-up grid</div>
    </div>
  );
}

// =====================================================
// VARIATION C — Table / spreadsheet view
// =====================================================
function VariationC() {
  return (
    <div className="wf" style={{ width: 1280, height: 1400 }}>
      {/* compact header */}
      <div style={{ borderBottom: '1.5px solid #2a2a2a', padding: '16px 48px', display: 'flex', alignItems: 'center', gap: 24 }}>
        <div className="box" style={{ width: 36, height: 36, background: '#1a1a1a', color: '#fff', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'JetBrains Mono, monospace', fontSize:9 }}>LOGO</div>
        <Slot sm>brand</Slot>
        <div style={{ display: 'flex', gap: 20, marginLeft: 24 }}>
          <Slot muted size="sm">nav</Slot>
          <Slot muted size="sm">nav</Slot>
          <Slot muted size="sm">nav</Slot>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <div className="box" style={{ padding: '5px 12px', background: '#fff', minWidth: 220 }}>🔍 <Slot sm>search</Slot></div>
        </div>
      </div>

      {/* title + filters band */}
      <div style={{ padding: '32px 48px 20px' }}>
        <div style={{ display: 'flex', gap: 10, marginBottom: 12, fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a5a' }}>
          <Slot sm>breadcrumb</Slot>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 32 }}>
          <div>
            <div className="wire-title" style={{ fontSize: 38, marginBottom: 8 }}>
              <Slot size="lg">{'topic / page title'}</Slot>
            </div>
            <Slot muted>{'one-line subhead — short topic summary'}</Slot>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <div className="pill"><Slot sm>↓ download</Slot></div>
            <div className="pill dark"><Slot sm style={{background:'transparent', border:'none', color:'#fff'}}>compare selected</Slot></div>
          </div>
        </div>
      </div>

      {/* filter strip */}
      <div style={{ padding: '14px 48px', background: '#f1efe8', borderTop: '1.5px solid #2a2a2a', borderBottom: '1.5px solid #2a2a2a', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a5a', textTransform: 'uppercase', letterSpacing: '0.06em' }}>filters:</span>
        <Slot>rating ▾</Slot>
        <Slot>audience ▾</Slot>
        <Slot>delivery format ▾</Slot>
        <Slot muted>+ filter</Slot>
        <div style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a5a' }}>
          <Slot sm>n results</Slot>
        </div>
      </div>

      {/* TABLE */}
      <div style={{ padding: '24px 48px' }}>
        <div className="box" style={{ background: '#fff', overflow: 'hidden', padding: 0 }}>
          {/* header row */}
          <div style={{ display: 'grid', gridTemplateColumns: '40px 2fr 2fr 1fr 1fr 0.6fr', padding: '14px 18px', borderBottom: '1.5px solid #2a2a2a', background: '#e6ecf6', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 16, height: 16, border: '1.5px solid #2a2a2a', borderRadius: 3 }}></div>
            <Slot sm>column: name</Slot>
            <Slot sm>column: audience / description</Slot>
            <Slot sm>column: category</Slot>
            <Slot sm>column: rating</Slot>
            <Slot sm>actions</Slot>
          </div>
          {/* rows */}
          {[1,2,3,4,5,6,1,2].map((n, i) => (
            <div key={i} style={{
              display: 'grid',
              gridTemplateColumns: '40px 2fr 2fr 1fr 1fr 0.6fr',
              padding: '16px 18px',
              borderBottom: i < 7 ? '1px dashed #cfcdc6' : 'none',
              alignItems: 'center',
              gap: 12,
            }}>
              <div style={{ width: 16, height: 16, border: '1.5px solid #2a2a2a', borderRadius: 3 }}></div>
              <Slot>item name</Slot>
              <Slot muted size="sm">{'short audience / description text'}</Slot>
              <Slot sm>category</Slot>
              <span className={`num-badge ${n >= 4 ? 'gray' : ''}`}>{n}</span>
              <Slot sm muted>→ open</Slot>
            </div>
          ))}
          {/* footer */}
          <div style={{ padding: '14px 18px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fbfaf7' }}>
            <Slot sm muted>showing 1–8 of n</Slot>
            <div style={{ display: 'flex', gap: 8 }}>
              <div className="pill" style={{ padding: '4px 10px' }}><Slot sm>← prev</Slot></div>
              <div className="pill" style={{ padding: '4px 10px' }}><Slot sm>next →</Slot></div>
            </div>
          </div>
        </div>
      </div>

      {/* annotations */}
      <Annotation x={48} y={300} w={220} rotate={-2}>
        title + utility actions<br/>on same row (compact)
      </Annotation>
      <Annotation x={48} y={450} w={230} color="blue">
        filter strip → users<br/>narrow down before scanning
      </Annotation>
      <Annotation x={1010} y={680} w={210}>
        table = power-user view:<br/>compare ratings at a glance,<br/>sort by any column
      </Annotation>
      <Annotation x={48} y={1180} w={230} color="blue">
        bulk-select checkbox column<br/>feeds the "compare selected" CTA
      </Annotation>

      <div className="legend">VARIATION C · table view</div>
    </div>
  );
}

// =====================================================
// LEGEND ARTBOARD — explains the slot vocabulary
// =====================================================
function LegendArtboard() {
  return (
    <div className="wf" style={{ width: 720, height: 540, padding: 36 }}>
      <div style={{ fontFamily: 'Caveat', fontSize: 32, color: '#1a1a1a', marginBottom: 6 }}>How to read these wireframes</div>
      <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 11, color: '#5a5a5a', marginBottom: 24 }}>EDIT THE YELLOW SLOTS TO DEFINE YOUR DATA MODEL</div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <Slot size="lg">{'{ data slot }'}</Slot>
          <div style={{ flex: 1, fontFamily: 'Kalam', fontSize: 16, color: '#3a3a3a', paddingTop: 8 }}>
            Yellow dashed = an editable label. Click and rewrite to define what field/data goes in this spot.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <Slot muted>placeholder / value</Slot>
          <div style={{ flex: 1, fontFamily: 'Kalam', fontSize: 16, color: '#3a3a3a', paddingTop: 4 }}>
            Gray dashed = an example value or filler — replace with sample content or notes about format.
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <div className="annotation" style={{ position: 'static', fontSize: 18 }}>orange annotation ↗</div>
          <div style={{ flex: 1, fontFamily: 'Kalam', fontSize: 16, color: '#3a3a3a' }}>
            Orange handwriting = my note about that region (why it's there, what it does).
          </div>
        </div>

        <div style={{ display: 'flex', gap: 18, alignItems: 'flex-start' }}>
          <div className="annotation blue" style={{ position: 'static', fontSize: 18 }}>blue annotation ↗</div>
          <div style={{ flex: 1, fontFamily: 'Kalam', fontSize: 16, color: '#3a3a3a' }}>
            Blue handwriting = a design decision or alternative worth discussing.
          </div>
        </div>

        <div style={{ marginTop: 12, padding: 16, background: '#fff8e1', border: '1.5px dashed #b58a1a', borderRadius: 6, fontFamily: 'Kalam', fontSize: 15, color: '#5a4400' }}>
          <strong>How to use:</strong> open the canvas, focus any artboard fullscreen, and edit slot labels inline. Each artboard is one layout option for the same page.
        </div>
      </div>
    </div>
  );
}

// =====================================================
// CANVAS
// =====================================================
function App() {
  const { DesignCanvas, DCSection, DCArtboard } = window;
  return (
    <DesignCanvas title="faval · data-mapping wireframes" subtitle="Edit the yellow slot labels to define what data goes where">
      <DCSection id="intro" title="Start here">
        <DCArtboard id="legend" label="Legend — how to read these" width={720} height={540}>
          <LegendArtboard />
        </DCArtboard>
      </DCSection>

      <DCSection id="variations" title="Faval · wireframe">
        <DCArtboard id="a" label="Author page · wireframe" width={1280} height={1700}>
          <VariationA />
        </DCArtboard>
      </DCSection>
    </DesignCanvas>
  );
}

ReactDOM.createRoot(document.body.appendChild(document.createElement('div'))).render(<App />);
