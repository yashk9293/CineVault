import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import useDebounce from "../hooks/useDebounce";

const genreColorMap = {
  Action: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Comedy: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  Drama: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Horror: "bg-red-500/20 text-red-300 border-red-500/30",
  "Sci-Fi": "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Thriller: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Romance: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Documentary: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
};

const StarRating = ({ rating }) => {
  const filled = Math.round((rating / 10) * 5);
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <svg
          key={i}
          className={`w-3.5 h-3.5 ${i <= filled ? "text-amber-400" : "text-slate-700"}`}
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ))}
    </div>
  );
};

export default function Home() {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await API.get(
        `/movies?search=${debouncedSearch}&page=${page}&limit=5`
      );
      setMovies(res.data.data.data || []);
    } catch (err) {
      console.error("Error fetching movies", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this movie from your vault?")) return;
    setDeletingId(id);
    try {
      await API.delete(`/movies/${id}`);
      setMovies((prev) => prev.filter((m) => (m.id || m._id) !== id));
    } catch {
      // handle silently
    } finally {
      setDeletingId(null);
    }
  };

  const toggleWatched = async (movie) => {
    const id = movie.id || movie._id;
    setTogglingId(id);
    try {
      await API.put(`/movies/${id}`, { ...movie, watched: !movie.watched });
      fetchMovies();
    } catch {
      console.error("Failed to update status");
    } finally {
      setTogglingId(null);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchMovies();
  }, [debouncedSearch, page]);

  return (
    <div className="min-h-screen bg-[#0f1117] relative overflow-x-hidden">

      {/* Ambient glows */}
      <div className="fixed top-[-120px] left-[-80px] w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="fixed bottom-[-100px] right-[-60px] w-[400px] h-[400px] bg-violet-700/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Grid overlay */}
      <div
        className="fixed inset-0 pointer-events-none opacity-[0.025]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0f1117]/80 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
              </svg>
            </div>
            <span className="text-white font-bold text-lg tracking-tight" style={{ fontFamily: "'Sora', sans-serif" }}>
              CineVault
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => navigate("/add-movie")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.97] transition-all duration-200 shadow-md shadow-indigo-600/25"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">Add Movie</span>
            </button>

            <button
              onClick={() => navigate("/dashboard")}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] hover:text-white active:scale-[0.97] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 hover:text-red-300 active:scale-[0.97] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">

        {/* Page heading */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
            My Movie Vault
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">Track, rate and manage your personal collection</p>
        </div>

        {/* Search bar */}
        <div className="relative mb-6 group">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            placeholder="Search by title, description, genre or tags..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#161b27] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 hover:border-white/[0.14]"
          />
        </div>

        {/* ── Movie List ── */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <svg className="w-8 h-8 text-indigo-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-slate-500 text-sm">Loading your vault...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.07] flex items-center justify-center text-3xl">
              🍿
            </div>
            <div className="text-center">
              <p className="text-white font-semibold">No movies found</p>
              <p className="text-slate-500 text-sm mt-1">
                {search ? "Try a different search term." : "Add your first movie to get started."}
              </p>
            </div>
            {!search && (
              <button
                onClick={() => navigate("/add-movie")}
                className="mt-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 transition-all duration-200 shadow-lg shadow-indigo-600/25"
              >
                Add First Movie
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {movies.map((m) => {
              const id = m.id || m._id;
              const genres = Array.isArray(m.genre) ? m.genre : [m.genre];
              const isDeleting = deletingId === id;
              const isToggling = togglingId === id;

              return (
                <div
                  key={id}
                  className="group relative bg-[#161b27] border border-white/[0.07] rounded-2xl overflow-hidden hover:border-white/[0.14] transition-all duration-300 hover:shadow-xl hover:shadow-black/30"
                >
                  {/* Left accent bar */}
                  <div
                    className={`absolute left-0 top-0 bottom-0 w-[3px] transition-colors duration-300 ${
                      m.watched ? "bg-emerald-500" : "bg-indigo-500/50"
                    }`}
                  />

                  <div className="pl-5 pr-5 py-5 flex flex-col sm:flex-row sm:items-start gap-4">

                    {/* Movie info */}
                    <div className="flex-1 min-w-0">
                      {/* Title row */}
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3
                          className="text-white font-bold text-base cursor-pointer hover:text-indigo-300 transition-colors"
                          onClick={() => navigate(`/movies/${id}`)}
                        >
                          {m.title}
                        </h3>
                        {m.releaseYear && (
                          <span className="text-xs text-slate-500 bg-white/[0.05] border border-white/[0.07] px-2 py-0.5 rounded-lg font-medium">
                            {m.releaseYear}
                          </span>
                        )}
                        {m.watched ? (
                          <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/25 px-2 py-0.5 rounded-lg">
                            ✓ Watched
                          </span>
                        ) : (
                          <span className="text-xs font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-lg">
                            ⏳ Pending
                          </span>
                        )}
                      </div>

                      {/* Description */}
                      {m.description && (
                        <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 mb-3">
                          {m.description}
                        </p>
                      )}

                      {/* Rating */}
                      <div className="flex items-center gap-2 mb-3">
                        <StarRating rating={m.rating || 0} />
                        <span className="text-amber-400 text-sm font-bold">{m.rating}</span>
                        <span className="text-slate-600 text-xs">/10</span>
                      </div>

                      {/* Genres + Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {genres.filter(Boolean).map((g, i) => (
                          <span
                            key={i}
                            className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${
                              genreColorMap[g] || "bg-slate-500/20 text-slate-300 border-slate-500/30"
                            }`}
                          >
                            {g}
                          </span>
                        ))}
                        {m.tags?.map((t, i) => (
                          <span key={i} className="text-xs text-indigo-400/80 font-medium">
                            #{t}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex sm:flex-col gap-2 shrink-0 sm:min-w-[110px]">

                      {/* Toggle watched */}
                      <button
                        onClick={() => toggleWatched(m)}
                        disabled={isToggling}
                        className={`flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 active:scale-[0.97] disabled:opacity-60 ${
                          m.watched
                            ? "bg-emerald-500/10 border-emerald-500/25 text-emerald-400 hover:bg-emerald-500/20"
                            : "bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20"
                        }`}
                      >
                        {isToggling ? (
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : m.watched ? (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                        {m.watched ? "Watched" : "Pending"}
                      </button>

                      {/* Edit */}
                      <button
                        onClick={() => navigate(`/edit-movie/${id}`)}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.10] hover:text-white active:scale-[0.97] transition-all duration-200"
                      >
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                        Edit
                      </button>

                      {/* Delete */}
                      <button
                        onClick={() => handleDelete(id)}
                        disabled={isDeleting}
                        className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-red-400 bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 active:scale-[0.97] transition-all duration-200 disabled:opacity-60"
                      >
                        {isDeleting ? (
                          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : (
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && movies.length > 0 && (
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.10] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
              Prev
            </button>

            <div className="px-4 py-2 rounded-xl bg-[#161b27] border border-white/[0.07] text-sm font-semibold text-white">
              Page {page}
            </div>

            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={movies.length < 5}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.10] hover:text-white disabled:opacity-40 disabled:cursor-not-allowed active:scale-[0.97] transition-all duration-200"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}

        <p className="text-center text-xs text-slate-700 mt-10">© 2025 CineVault · All rights reserved</p>
      </main>
    </div>
  );
}