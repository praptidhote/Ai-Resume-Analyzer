"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Search } from "lucide-react";

export default function KeywordChips({ matched = [], missing = [] }) {
  const [filter, setFilter] = useState("all"); // 'all', 'matched', 'missing'
  const [searchQuery, setSearchQuery] = useState("");

  const filteredMatched = matched.filter((k) =>
    k.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredMissing = missing.filter((k) =>
    k.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search and Filter toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-100/60 p-1 dark:border-zinc-800 dark:bg-zinc-900">
          <button
            onClick={() => setFilter("all")}
            className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "all"
                ? "bg-white text-zinc-900 shadow-sm dark:bg-zinc-800 dark:text-zinc-100"
                : "text-zinc-600 hover:text-zinc-900 dark:text-zinc-400"
            }`}
          >
            All ({matched.length + missing.length})
          </button>
          <button
            onClick={() => setFilter("matched")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "matched"
                ? "bg-white text-emerald-700 shadow-sm dark:bg-zinc-800 dark:text-emerald-400"
                : "text-zinc-600 hover:text-emerald-600 dark:text-zinc-400"
            }`}
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Matched ({matched.length})
          </button>
          <button
            onClick={() => setFilter("missing")}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition-all ${
              filter === "missing"
                ? "bg-white text-rose-700 shadow-sm dark:bg-zinc-800 dark:text-rose-400"
                : "text-zinc-600 hover:text-rose-600 dark:text-zinc-400"
            }`}
          >
            <XCircle className="h-3.5 w-3.5" />
            Missing ({missing.length})
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search keywords..."
            className="w-full sm:w-48 rounded-xl border border-zinc-200 bg-white py-1.5 pl-8 pr-3 text-xs placeholder:text-zinc-400 focus:border-indigo-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900"
          />
        </div>
      </div>

      {/* Matched Keywords Grid */}
      {(filter === "all" || filter === "matched") && (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400">
              Matched in Resume ({filteredMatched.length})
            </h4>
          </div>
          {filteredMatched.length === 0 ? (
            <p className="text-xs italic text-zinc-400">No matched keywords found</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredMatched.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-800 dark:border-emerald-900/50 dark:bg-emerald-950/40 dark:text-emerald-300"
                >
                  <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-600 dark:text-emerald-400" />
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Missing Keywords Grid */}
      {(filter === "all" || filter === "missing") && (
        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-rose-500" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-rose-700 dark:text-rose-400">
              Missing from Resume ({filteredMissing.length})
            </h4>
          </div>
          {filteredMissing.length === 0 ? (
            <p className="text-xs italic text-zinc-400">
              Great job! All identified required keywords are present.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {filteredMissing.map((kw, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-medium text-rose-800 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300"
                >
                  <XCircle className="h-3 w-3 shrink-0 text-rose-500 dark:text-rose-400" />
                  {kw}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
