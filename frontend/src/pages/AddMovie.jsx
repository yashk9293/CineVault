import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

const genresList = ["Action", "Comedy", "Drama", "Horror", "Sci-Fi", "Thriller", "Romance", "Documentary"];

const genreIcons = {
  Action: "💥", Comedy: "😂", Drama: "🎭", Horror: "👻",
  "Sci-Fi": "🚀", Thriller: "🔪", Romance: "❤️", Documentary: "🎥",
};

export default function AddMovie() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    rating: "",
    genre: "Action",
    watched: false,
    releaseYear: new Date().getFullYear(),
  });

  const isRatingInvalid =
    formData.rating !== "" &&
    (Number(formData.rating) < 0 || Number(formData.rating) > 10);

  const handleTagKeyDown = (e) => {
    if ((e.key === "Enter" || e.key === ",") && tagInput.trim()) {
      e.preventDefault();
      const newTag = tagInput.trim().replace(/,$/, "");
      if (newTag && !tags.includes(newTag)) setTags([...tags, newTag]);
      setTagInput("");
    }
  };

  const removeTag = (t) => setTags(tags.filter((tag) => tag !== t));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!formData.title) { setError("Movie title is required."); return; }
    if (isRatingInvalid) { setError("Rating must be between 0 and 10."); return; }
    setLoading(true);
    try {
      const payload = {
        ...formData,
        rating: Number(formData.rating),
        releaseYear: Number(formData.releaseYear),
        tags,
        genre: [formData.genre],
      };
      await API.post("/movies", payload);
      navigate("/home");
    } catch (err) {
      setError("Failed to add movie. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f1117] px-4 py-10 relative overflow-hidden">

      {/* Ambient glows */}
      <div className="absolute top-[-100px] left-[-80px] w-[400px] h-[400px] bg-indigo-600/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-80px] right-[-60px] w-[350px] h-[350px] bg-violet-700/10 rounded-full blur-[100px] pointer-events-none" />

      {/* Grid overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: "linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)", backgroundSize: "40px 40px" }} />

      <div className="relative w-full max-w-xl mx-auto">

        {/* Back button */}
        <button
          onClick={() => navigate("/home")}
          className="flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-6 transition-colors group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Home
        </button>

        {/* Top accent bar */}
        <div className="h-[3px] w-full rounded-t-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-500" />

        <div className="bg-[#161b27] border border-white/[0.07] rounded-b-2xl shadow-2xl shadow-black/50 px-8 py-10">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 shrink-0">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>Add New Movie</h1>
              <p className="text-sm text-slate-400">Fill in the details to add to your vault</p>
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 flex items-center gap-2.5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Title */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Title *</label>
              <div className="relative">
                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                  </svg>
                </div>
                <input
                  placeholder="e.g. Interstellar"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-[#1e2535] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 hover:border-white/[0.14]"
                  required
                />
              </div>
            </div>

            {/* Description */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Description</label>
              <textarea
                placeholder="Brief synopsis or your thoughts..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full bg-[#1e2535] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 hover:border-white/[0.14] resize-none"
              />
            </div>

            {/* Rating + Year row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="group">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Rating (0–10)</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    placeholder="8.5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className={`w-full bg-[#1e2535] border text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none transition-all duration-200 hover:border-white/[0.14] focus:ring-1 ${
                      isRatingInvalid
                        ? "border-red-500/50 focus:border-red-500/70 focus:ring-red-500/20"
                        : "border-white/[0.08] focus:border-indigo-500/60 focus:ring-indigo-500/30"
                    }`}
                  />
                </div>
                {isRatingInvalid && (
                  <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01" />
                    </svg>
                    Must be between 0 and 10
                  </p>
                )}
              </div>

              <div className="group">
                <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Release Year</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-indigo-400 transition-colors">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <input
                    type="number"
                    value={formData.releaseYear}
                    onChange={(e) => setFormData({ ...formData, releaseYear: e.target.value })}
                    className="w-full bg-[#1e2535] border border-white/[0.08] text-white placeholder-slate-600 rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-indigo-500/60 focus:ring-1 focus:ring-indigo-500/30 transition-all duration-200 hover:border-white/[0.14]"
                  />
                </div>
              </div>
            </div>

            {/* Genre */}
            <div>
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Genre</label>
              <div className="flex flex-wrap gap-2">
                {genresList.map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setFormData({ ...formData, genre: g })}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border transition-all duration-200 ${
                      formData.genre === g
                        ? "bg-indigo-600/30 border-indigo-500/60 text-indigo-300 shadow-sm shadow-indigo-500/20"
                        : "bg-[#1e2535] border-white/[0.08] text-slate-400 hover:border-white/[0.18] hover:text-slate-200"
                    }`}
                  >
                    <span>{genreIcons[g]}</span>
                    {g}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            <div className="group">
              <label className="block text-xs font-semibold text-slate-400 uppercase tracking-widest mb-2">Tags</label>
              <div className={`bg-[#1e2535] border rounded-xl px-3 py-2.5 transition-all duration-200 hover:border-white/[0.14] focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 ${tags.length > 0 ? "border-white/[0.08]" : "border-white/[0.08]"}`}>
                <div className="flex flex-wrap gap-1.5 mb-1.5">
                  {tags.map((tag) => (
                    <span key={tag} className="flex items-center gap-1 bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 text-xs px-2.5 py-1 rounded-lg font-medium">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="text-indigo-400 hover:text-white transition-colors ml-0.5">
                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  placeholder={tags.length === 0 ? "Type a tag and press Enter or comma..." : "Add more tags..."}
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  className="w-full bg-transparent text-white placeholder-slate-600 text-sm outline-none"
                />
              </div>
              <p className="text-xs text-slate-600 mt-1.5">Press Enter or comma to add a tag</p>
            </div>

            {/* Watched toggle */}
            <div
              onClick={() => setFormData({ ...formData, watched: !formData.watched })}
              className={`flex items-center justify-between px-4 py-3.5 rounded-xl border cursor-pointer transition-all duration-200 ${
                formData.watched
                  ? "bg-emerald-500/10 border-emerald-500/30"
                  : "bg-[#1e2535] border-white/[0.08] hover:border-white/[0.14]"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${formData.watched ? "bg-emerald-500/20" : "bg-white/[0.05]"}`}>
                  <svg className={`w-4 h-4 transition-colors ${formData.watched ? "text-emerald-400" : "text-slate-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <div>
                  <p className={`text-sm font-semibold transition-colors ${formData.watched ? "text-emerald-300" : "text-slate-300"}`}>
                    Already Watched
                  </p>
                  <p className="text-xs text-slate-500">Mark if you've seen this film</p>
                </div>
              </div>
              {/* Toggle pill */}
              <div className={`w-11 h-6 rounded-full transition-all duration-300 relative ${formData.watched ? "bg-emerald-500" : "bg-white/[0.1]"}`}>
                <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all duration-300 ${formData.watched ? "left-5" : "left-0.5"}`} />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/home")}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-slate-300 bg-white/[0.05] border border-white/[0.08] hover:bg-white/[0.09] hover:text-white active:scale-[0.98] transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading || isRatingInvalid}
                className="flex-1 py-3 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-indigo-600/25 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Adding...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                    Add to Vault
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <p className="text-center text-xs text-slate-700 mt-4">© 2025 CineVault · All rights reserved</p>
      </div>
    </div>
  );
}
