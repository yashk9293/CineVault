import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid
} from "recharts";

const WATCH_COLORS = ["#6366f1", "#8b5cf6"];
const GENRE_COLORS = [
  "#6366f1", "#8b5cf6", "#a78bfa", "#7c3aed",
  "#4f46e5", "#c4b5fd", "#ddd6fe", "#818cf8"
];

/* ── Custom Tooltip ── */
const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#1e2535] border border-white/[0.1] rounded-xl px-4 py-2.5 shadow-xl shadow-black/40 text-sm">
        <p className="text-slate-300 font-medium">{payload[0].name}</p>
        <p className="text-indigo-400 font-bold text-base">{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

/* ── Stat Card ── */
function StatCard({ icon, label, value, sub, accent = "indigo" }) {
  const accents = {
    indigo: "from-indigo-500 to-violet-600 shadow-indigo-500/30",
    violet: "from-violet-500 to-purple-600 shadow-violet-500/30",
    emerald: "from-emerald-500 to-teal-600 shadow-emerald-500/30",
    amber:  "from-amber-500 to-orange-500 shadow-amber-500/30",
  };
  return (
    <div className="bg-[#161b27] border border-white/[0.07] rounded-2xl px-6 py-5 flex items-center gap-4 shadow-lg shadow-black/30 hover:border-white/[0.12] transition-colors duration-200">
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${accents[accent]} flex items-center justify-center shadow-lg shrink-0`}>
        {icon}
      </div>
      <div>
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-0.5">{label}</p>
        <p className="text-2xl font-bold text-white leading-none">{value}</p>
        {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
      </div>
    </div>
  );
}

/* ── Chart Card wrapper ── */
function ChartCard({ title, subtitle, icon, children, empty }) {
  return (
    <div className="bg-[#161b27] border border-white/[0.07] rounded-2xl shadow-xl shadow-black/40 overflow-hidden">
      {/* Top accent bar */}
      <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
      <div className="px-6 pt-5 pb-2 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30 shrink-0">
          {icon}
        </div>
        <div>
          <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{title}</h3>
          {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
        </div>
      </div>
      <div className="px-4 pb-6 pt-2">
        {empty ? (
          <div className="flex flex-col items-center justify-center h-64 gap-3">
            <div className="w-14 h-14 rounded-full bg-white/[0.04] flex items-center justify-center">
              <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
            </div>
            <p className="text-slate-600 text-sm font-medium">No data yet</p>
            <p className="text-slate-700 text-xs">Add some movies to see analytics</p>
          </div>
        ) : children}
      </div>
    </div>
  );
}

/* ── Loading skeleton ── */
function Skeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-[#161b27] border border-white/[0.07] rounded-2xl h-24" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#161b27] border border-white/[0.07] rounded-2xl h-80" />
        <div className="bg-[#161b27] border border-white/[0.07] rounded-2xl h-80" />
      </div>
    </div>
  );
}

/* ── Custom Legend ── */
const renderLegend = (props) => {
  const { payload } = props;
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-2">
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-xs text-slate-400 font-medium">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

/* ══════════════════════════════════════════ */
export default function Dashboard() {
  const [watchStats, setWatchStats] = useState([]);
  const [genreStats, setGenreStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [watchRes, genreRes] = await Promise.all([
          API.get("/dashboard/watch-stats"),
          API.get("/dashboard/genre-stats"),
        ]);

        setWatchStats(
          watchRes.data.data.map((item) => ({
            name: item._id ? "Watched" : "Pending",
            value: item.count,
          }))
        );
        setGenreStats(
          genreRes.data.data.map((item) => ({
            name: item._id || "Unknown",
            value: item.count,
          }))
        );
      } catch (err) {
        console.error("Dashboard error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  /* derived summary stats */
  const totalMovies  = watchStats.reduce((s, i) => s + i.value, 0);
  const watched      = watchStats.find((i) => i.name === "Watched")?.value ?? 0;
  const pending      = watchStats.find((i) => i.name === "Pending")?.value ?? 0;
  const topGenre     = genreStats.reduce((a, b) => (b.value > (a?.value ?? 0) ? b : a), null);

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 py-10 relative overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-[-120px] left-[-80px] w-[500px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[420px] h-[420px] bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[160px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative max-w-6xl mx-auto space-y-8">

        {/* ── Page Header ── */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
                  Movie Analytics
                </h1>
                {/* <p className="text-sm text-slate-400">Your CineVault at a glance</p> */}
              </div>
            </div>
          </div>

          {/* Live badge */}
          {!loading && (
            <div className="flex items-center gap-2 bg-[#161b27] border border-white/[0.07] rounded-xl px-4 py-2 self-start sm:self-auto">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
              </span>
              <span className="text-xs text-slate-400 font-medium">Live stats</span>
            </div>
          )}
        </div>

        {loading ? (
          <Skeleton />
        ) : (
          <>
            {/* ── Summary Cards ── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                accent="indigo"
                label="Total Movies"
                value={totalMovies}
                sub="In your vault"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                }
              />
              <StatCard
                accent="emerald"
                label="Watched"
                value={watched}
                sub={totalMovies ? `${Math.round((watched / totalMovies) * 100)}% complete` : "—"}
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                accent="amber"
                label="Pending"
                value={pending}
                sub="Yet to watch"
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                }
              />
              <StatCard
                accent="violet"
                label="Top Genre"
                value={topGenre?.name ?? "—"}
                sub={topGenre ? `${topGenre.value} movies` : "No data"}
                icon={
                  <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 3l14 9-14 9V3z" />
                  </svg>
                }
              />
            </div>

            {/* ── Charts Row ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

              {/* Pie — Watch Progress */}
              <ChartCard
                title="Watch Progress"
                subtitle="Watched vs pending breakdown"
                empty={watchStats.length === 0}
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
                  </svg>
                }
              >
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={watchStats}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="45%"
                      outerRadius={95}
                      innerRadius={50}
                      paddingAngle={4}
                      strokeWidth={0}
                    >
                      {watchStats.map((_, i) => (
                        <Cell key={i} fill={WATCH_COLORS[i % WATCH_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomTooltip />} />
                    <Legend content={renderLegend} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Bar — Genre Stats */}
              <ChartCard
                title="Movies by Genre"
                subtitle="Distribution across genres"
                empty={genreStats.length === 0}
                icon={
                  <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              >
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={genreStats} margin={{ top: 8, right: 8, bottom: 0, left: -16 }} barSize={22}>
                    <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.04)" />
                    <XAxis
                      dataKey="name"
                      tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: "#64748b", fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      allowDecimals={false}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)", radius: 6 }} />
                    <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                      {genreStats.map((_, i) => (
                        <Cell key={i} fill={GENRE_COLORS[i % GENRE_COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* ── Genre breakdown table ── */}
            {genreStats.length > 0 && (
              <div className="bg-[#161b27] border border-white/[0.07] rounded-2xl shadow-xl shadow-black/40 overflow-hidden">
                <div className="h-[2px] w-full bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />
                <div className="px-6 pt-5 pb-4 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-md shadow-indigo-500/30">
                    <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Genre Breakdown</h3>
                    <p className="text-xs text-slate-500">Detailed view per category</p>
                  </div>
                </div>
                <div className="px-6 pb-6 space-y-3">
                  {genreStats
                    .sort((a, b) => b.value - a.value)
                    .map((g, i) => {
                      const pct = totalMovies ? Math.round((g.value / totalMovies) * 100) : 0;
                      return (
                        <div key={g.name} className="flex items-center gap-4">
                          <span className="text-xs text-slate-500 w-4 shrink-0 font-mono">#{i + 1}</span>
                          <span className="text-sm text-slate-300 font-medium w-24 shrink-0">{g.name}</span>
                          <div className="flex-1 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full transition-all duration-700"
                              style={{
                                width: `${pct}%`,
                                background: `linear-gradient(90deg, ${GENRE_COLORS[i % GENRE_COLORS.length]}, ${GENRE_COLORS[(i + 1) % GENRE_COLORS.length]})`,
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className="text-sm font-bold text-white">{g.value}</span>
                            <span className="text-xs text-slate-600">({pct}%)</span>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </>
        )}

        <p className="text-center text-xs text-slate-700 pt-2">© 2025 CineVault · All rights reserved</p>
      </div>
    </div>
  );
}