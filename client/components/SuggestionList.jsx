"use client";

import React, { useState } from "react";
import { Lightbulb, Check, Copy, Sparkles, ArrowRight, Wand2, Loader2 } from "lucide-react";
import { api } from "../lib/api";

export default function SuggestionList({
  suggestions = [],
  rewrittenBullets = [],
  analysisId = null,
  targetRole = "Software Engineer",
}) {
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [customBullet, setCustomBullet] = useState("");
  const [customResult, setCustomResult] = useState(null);
  const [rewriting, setRewriting] = useState(false);
  const [rewriteError, setRewriteError] = useState("");

  const handleCopy = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCustomRewrite = async (e) => {
    e.preventDefault();
    if (!customBullet.trim() || !analysisId) return;

    setRewriting(true);
    setRewriteError("");
    try {
      const data = await api.rewriteBullet(analysisId, {
        bulletText: customBullet,
        targetRole,
      });
      if (data.success && data.result) {
        setCustomResult(data.result);
      }
    } catch (err) {
      setRewriteError(err.message || "Failed to rewrite bullet point");
    } finally {
      setRewriting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Suggestions List */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            Targeted ATS Improvements
          </h3>
        </div>

        <div className="grid gap-3">
          {suggestions.map((item, idx) => (
            <div
              key={idx}
              className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                  {idx + 1}
                </span>
                <div className="space-y-1 text-sm">
                  <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                    {item.issue}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                      Recommendation:{" "}
                    </span>
                    {item.fix}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* High-Impact Bullet Rewriter Showcase */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <Wand2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
            High-Impact Bullet Rewrites (Google XYZ Formula)
          </h3>
        </div>

        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Transform passive statements into quantified results: &quot;Accomplished [X], as measured by [Y], by doing [Z]&quot;.
        </p>

        <div className="space-y-3">
          {rewrittenBullets.map((bullet, idx) => (
            <div
              key={idx}
              className="space-y-2 rounded-xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="rounded-lg bg-rose-50/60 p-2.5 text-xs text-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
                <span className="font-semibold">Before (Weak / Unquantified):</span>{" "}
                {bullet.original}
              </div>

              <div className="relative rounded-lg bg-emerald-50/60 p-2.5 pr-12 text-xs text-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-200">
                <span className="font-semibold">After (Quantified & Action-Oriented):</span>{" "}
                {bullet.improved}
                <button
                  onClick={() => handleCopy(bullet.improved, idx)}
                  className="absolute right-2 top-2 rounded-md p-1.5 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/60 transition-colors"
                  title="Copy improved bullet"
                >
                  {copiedIndex === idx ? (
                    <Check className="h-4 w-4 text-emerald-600" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Live custom bullet rewriter tool */}
        {analysisId && (
          <div className="mt-4 rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/40 to-violet-50/40 p-4 dark:border-indigo-950 dark:from-indigo-950/20 dark:to-violet-950/20">
            <h4 className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300">
              <Sparkles className="h-3.5 w-3.5" />
              Rewrite Any Custom Bullet Point
            </h4>
            <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
              Paste a weak bullet from your resume to enhance it with metrics and strong action verbs:
            </p>

            <form onSubmit={handleCustomRewrite} className="mt-3 space-y-2">
              <textarea
                rows={2}
                value={customBullet}
                onChange={(e) => setCustomBullet(e.target.value)}
                placeholder="e.g. Worked on frontend development and fixed bugs in user interface..."
                className="w-full rounded-xl border border-zinc-200 bg-white p-2.5 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-600 focus:outline-none dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={rewriting || !customBullet.trim()}
                  className="flex items-center gap-1.5 rounded-lg bg-indigo-600 px-3 py-1.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-50 transition-colors cursor-pointer"
                >
                  {rewriting ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      Rewriting...
                    </>
                  ) : (
                    <>
                      Rewrite with AI
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>

            {rewriteError && (
              <p className="mt-2 text-xs text-rose-600">{rewriteError}</p>
            )}

            {customResult && (
              <div className="mt-3 space-y-1.5 rounded-lg bg-white p-3 shadow-sm dark:bg-zinc-900">
                <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  Enhanced Version:
                </p>
                <p className="text-xs text-zinc-800 dark:text-zinc-200">
                  {customResult.improved}
                </p>
                {customResult.explanation && (
                  <p className="text-[11px] italic text-zinc-500 dark:text-zinc-400">
                    Why: {customResult.explanation}
                  </p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
