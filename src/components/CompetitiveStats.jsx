import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Legend
} from 'recharts';

// ─── constants & helpers ─────────────────────────────────────────────────────

const C = {
  easy: '#22c55e',
  medium: '#f59e0b',
  hard: '#ef4444',
  lc: '#fbbf24',
  cc: '#a855f7',
  cf: '#3b82f6',
  cdz: '#00ffcc',
};
const safe = (v) => (typeof v === 'number' && !isNaN(v) && v > 0 ? v : 0);

const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-2 text-sm shadow-2xl">
      {label && <p className="text-text-secondary mb-1 text-xs">{label}</p>}
      {payload.map(p => (
        <p key={p.name} style={{ color: p.fill || p.color || '#fff' }} className="font-bold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
};

// Thin animated arc (SVG, no dep)
function Arc({ value, label, sublabel, color, size = 96, stroke = 9 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke="rgba(255,255,255,0.06)" strokeWidth={stroke} />
          <circle cx={size / 2} cy={size / 2} r={r} fill="none"
            stroke={color} strokeWidth={stroke} strokeLinecap="round"
            strokeDasharray={`${circ} ${circ}`}
            style={{
              strokeDashoffset: circ,
              animation: `arcDraw 1s ease forwards`,
            }} />
        </svg>
        {/* Inject animation once globally */}
        <style>{`@keyframes arcDraw{to{stroke-dashoffset:0}}`}</style>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-lg font-black leading-none" style={{ color }}>{value}</span>
        </div>
      </div>
      <div className="text-center">
        <div className="text-xs font-semibold text-text">{label}</div>
        {sublabel && <div className="text-[10px] text-text-muted">{sublabel}</div>}
      </div>
    </div>
  );
}

// ─── main ────────────────────────────────────────────────────────────────────

export default function CompetitiveStats({ profiles, stats, onAddClick, codeduelzStats }) {
  const lc = stats?.leetCode || {};
  const cc = stats?.codeChef || {};
  const cf = stats?.codeforces || {};
  const cdz = codeduelzStats || {};

  const hasLC = !!profiles.leetcode;
  const hasCC = !!profiles.codechef;
  const hasCF = !!profiles.codeforces;
  const hasAny = hasLC || hasCC || hasCF;

  if (!hasAny) {
    return (
      <div className="card p-10 text-center">
        <div className="w-20 h-20 rounded-2xl bg-surface-elevated flex items-center justify-center mx-auto mb-5">
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" className="text-text-muted">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
        </div>
        <p className="text-xl font-bold mb-2">No platforms connected</p>
        <p className="text-text-secondary text-sm mb-6">Connect LeetCode, CodeChef or Codeforces to see your analytics</p>
        <button onClick={onAddClick} className="btn-primary">Connect Platforms</button>
      </div>
    );
  }

  // ── Overview hero metrics (all raw, meaningful) ──────────────────────────
  const heroMetrics = [
    hasLC && lc.contestRating && {
      value: lc.contestRating,
      label: 'LC Contest',
      sublabel: `${safe(lc.contestsAttended)} contests`,
      color: C.lc,
    },
    hasLC && {
      value: safe(lc.totalSolved),
      label: 'LC Solved',
      sublabel: `#${safe(lc.ranking).toLocaleString()} global`,
      color: '#e5e7eb',
    },
    hasCF && {
      value: safe(cf.rating),
      label: 'CF Rating',
      sublabel: cf.rank || '',
      color: C.cf,
    },
    hasCC && {
      value: safe(cc.currentRating),
      label: 'CC Rating',
      sublabel: cc.stars ? `${cc.stars} stars` : '',
      color: C.cc,
    },
    safe(cdz.matches) > 0 && {
      value: `${safe(cdz.wins)}W / ${safe(cdz.losses)}L`,
      label: 'CodeDuelZ',
      sublabel: `${safe(cdz.matches)} played`,
      color: C.cdz,
    },
  ].filter(Boolean);

  // ── Problems solved bar (cross-platform) ────────────────────────────────
  const solvedBar = [
    hasLC && lc.easySolved && { name: 'LC Easy', value: safe(lc.easySolved), fill: C.easy },
    hasLC && lc.mediumSolved && { name: 'LC Medium', value: safe(lc.mediumSolved), fill: C.medium },
    hasLC && lc.hardSolved && { name: 'LC Hard', value: safe(lc.hardSolved), fill: C.hard },
  ].filter(Boolean);

  // ── Radar (normalized 0–100) ─────────────────────────────────────────────
  const pct = (v, max) => (max > 0 ? Math.min(Math.round((v / max) * 100), 100) : 0);
  const radarData = [
    { axis: 'LC Solved', score: pct(safe(lc.totalSolved), 3000) },
    { axis: 'LC Contest', score: lc.contestRating ? pct(safe(lc.contestRating) - 1400, 1600) : 0 },
    { axis: 'CF Rating', score: pct(safe(cf.rating), 3500) },
    { axis: 'CC Rating', score: pct(safe(cc.currentRating), 2800) },
    { axis: 'CDZ Win%', score: safe(cdz.matches) > 0 ? pct(safe(cdz.wins), safe(cdz.matches)) : 0 },
  ];

  // ── LC difficulty donut ──────────────────────────────────────────────────
  const lcPie = [
    { name: 'Easy', value: safe(lc.easySolved), fill: C.easy },
    { name: 'Medium', value: safe(lc.mediumSolved), fill: C.medium },
    { name: 'Hard', value: safe(lc.hardSolved), fill: C.hard },
  ].filter(d => d.value > 0);

  return (
    <div className="space-y-6">

      {/* ── Overall Performance Banner ─────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-surface-elevated to-surface border border-border p-6">
        <div className="absolute top-0 right-0 w-56 h-56 bg-accent/5 rounded-full blur-[90px]" />
        <h3 className="text-xs font-bold text-text-muted mb-6 uppercase tracking-widest">Overall Performance</h3>

        <div className="flex flex-wrap gap-8 justify-around">
          {heroMetrics.map(m => (
            <div key={m.label} className="flex flex-col items-center gap-1 min-w-[80px]">
              <div className="text-3xl font-black" style={{ color: m.color }}>{m.value}</div>
              <div className="text-sm font-semibold text-text">{m.label}</div>
              {m.sublabel && <div className="text-xs text-text-muted">{m.sublabel}</div>}
            </div>
          ))}
        </div>
      </div>

      {/* ── Charts Row ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Skill Radar */}
        <div className="card p-5">
          <p className="text-sm font-semibold text-text-secondary mb-3">Skill Radar</p>
          <ResponsiveContainer width="100%" height={230}>
            <RadarChart data={radarData} margin={{ top: 0, right: 24, bottom: 0, left: 24 }}>
              <PolarGrid stroke="rgba(255,255,255,0.07)" />
              <PolarAngleAxis dataKey="axis" tick={{ fill: '#888', fontSize: 11 }} />
              <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
              <Radar name="Score" dataKey="score"
                stroke={C.cdz} fill={C.cdz} fillOpacity={0.15}
                strokeWidth={2} dot={{ r: 4, fill: C.cdz }} />
              <Tooltip content={<Tip />} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* LeetCode difficulty donut OR problems bar */}
        {hasLC && lcPie.length > 0 ? (
          <div className="card p-5">
            <p className="text-sm font-semibold text-text-secondary mb-1">LeetCode Difficulty Split</p>
            <p className="text-xs text-text-muted mb-3">Out of your {safe(lc.totalSolved)} solved problems</p>
            <ResponsiveContainer width="100%" height={190}>
              <PieChart>
                <Pie data={lcPie} cx="50%" cy="50%" innerRadius={52} outerRadius={78}
                  paddingAngle={4} dataKey="value">
                  {lcPie.map((e, i) => <Cell key={i} fill={e.fill} stroke="transparent" />)}
                </Pie>
                <Tooltip content={<Tip />} />
                <Legend iconType="circle" iconSize={8}
                  formatter={v => <span className="text-xs text-text-secondary">{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-around mt-2 text-center">
              {lcPie.map(e => (
                <div key={e.name}>
                  <div className="font-bold text-lg" style={{ color: e.fill }}>{e.value}</div>
                  <div className="text-xs text-text-muted">{e.name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Platform ratings bar when no LC */
          <div className="card p-5">
            <p className="text-sm font-semibold text-text-secondary mb-3">Platform Ratings</p>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={[
                hasCF && { name: 'Codeforces', value: safe(cf.rating), fill: C.cf },
                hasCC && { name: 'CodeChef', value: safe(cc.currentRating), fill: C.cc },
              ].filter(Boolean)} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                <XAxis dataKey="name" tick={{ fill: '#888', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip content={<Tip />} />
                <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={70}>
                  {[hasCF, hasCC].filter(Boolean).map((_, i) =>
                    <Cell key={i} fill={[C.cf, C.cc][i]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* ── LC Easy / Medium / Hard bar ─────────────────────────────────────── */}
      {hasLC && solvedBar.length > 0 && (
        <div className="card p-5">
          <p className="text-sm font-semibold text-text-secondary mb-1">Problems Solved by Difficulty</p>
          <p className="text-xs text-text-muted mb-3">LeetCode — how your {safe(lc.totalSolved)} solved problems break down</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={solvedBar} layout="vertical"
              margin={{ top: 0, right: 40, bottom: 0, left: 10 }}>
              <XAxis type="number" hide />
              <YAxis type="category" dataKey="name" tick={{ fill: '#888', fontSize: 12 }}
                axisLine={false} tickLine={false} width={70} />
              <Tooltip content={<Tip />} />
              <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={24}>
                {solvedBar.map((e, i) => <Cell key={i} fill={e.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* ── Platform Cards ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {hasLC && (
          <PCard icon="LC" label="LeetCode" color={C.lc} bg="from-yellow-400/20 to-yellow-600/10"
            link={`https://leetcode.com/${profiles.leetcode}`} username={profiles.leetcode}
            rows={[
              { l: 'Total Solved', v: safe(lc.totalSolved), max: 3500, color: '#e5e7eb' },
              { l: 'Easy', v: safe(lc.easySolved), max: safe(lc.totalEasy) || 900, color: C.easy },
              { l: 'Medium', v: safe(lc.mediumSolved), max: safe(lc.totalMedium) || 1900, color: C.medium },
              { l: 'Hard', v: safe(lc.hardSolved), max: safe(lc.totalHard) || 800, color: C.hard },
              ...(lc.contestRating ? [{ l: 'Contest Rating', v: lc.contestRating, noBar: true }] : []),
              { l: 'Global Rank', v: safe(lc.ranking) ? `#${safe(lc.ranking).toLocaleString()}` : '—', noBar: true },
            ]}
          />
        )}

        {hasCF && (
          <PCard icon="CF" label="Codeforces" color={C.cf} bg="from-blue-500/20 to-blue-700/10"
            link={`https://codeforces.com/profile/${profiles.codeforces}`} username={profiles.codeforces}
            rows={[
              { l: 'Rating', v: safe(cf.rating), max: 3500, color: C.cf },
              { l: 'Max Rating', v: safe(cf.maxRating), max: 3500, color: '#60a5fa' },
              { l: 'Rank', v: cf.rank || '—', noBar: true },
            ]}
          />
        )}

        {hasCC && (
          <PCard icon="CC" label="CodeChef" color={C.cc} bg="from-purple-500/20 to-purple-700/10"
            link={`https://www.codechef.com/users/${profiles.codechef}`} username={profiles.codechef}
            rows={[
              { l: 'Rating', v: safe(cc.currentRating), max: 2800, color: C.cc },
              { l: 'Stars', v: cc.stars || '—', noBar: true },
              { l: 'Global Rank', v: safe(cc.globalRank) ? `#${safe(cc.globalRank).toLocaleString()}` : '—', noBar: true },
            ]}
          />
        )}

        <button onClick={onAddClick}
          className="card p-6 border-dashed hover:border-accent/50 flex flex-col items-center justify-center min-h-[160px] group">
          <div className="w-12 h-12 rounded-xl bg-surface-elevated flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
              strokeLinejoin="round" className="text-text-muted group-hover:text-accent transition-colors">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
          <span className="text-text-muted group-hover:text-accent transition-colors text-sm">Add / Edit platforms</span>
        </button>
      </div>
    </div>
  );
}

// ─── Platform Card ────────────────────────────────────────────────────────────
function PCard({ icon, label, color, bg, link, username, rows }) {
  return (
    <div className="card p-5 hover:border-accent/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${bg} flex items-center justify-center font-bold`}
            style={{ color }}>
            {icon}
          </div>
          <div>
            <div className="font-bold">{label}</div>
            <div className="text-xs text-text-muted">@{username}</div>
          </div>
        </div>
        <a href={link} target="_blank" rel="noopener noreferrer"
          className="text-xs text-text-muted hover:text-accent transition-colors">↗ View</a>
      </div>
      <div className="space-y-3">
        {rows.map(({ l, v, max, color: c, noBar }) => (
          <div key={l}>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">{l}</span>
              <span className="font-semibold">{v}</span>
            </div>
            {!noBar && typeof v === 'number' && max > 0 && (
              <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${Math.min(Math.round(v / max * 100), 100)}%`, background: c || color }} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
