"use client";

import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Cpu,
  FileCheck2,
  TrendingUp,
  Search,
  CheckCircle2,
  Target,
  BarChart3,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full overflow-hidden px-4 py-20 sm:px-6 lg:px-8 bg-gradient-to-b from-indigo-50/50 via-white to-zinc-50 dark:from-indigo-950/20 dark:via-zinc-950 dark:to-zinc-950">
        <div className="mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-4 py-1.5 text-xs font-semibold text-indigo-700 dark:border-indigo-900/60 dark:bg-indigo-950/60 dark:text-indigo-300">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Hybrid ATS Scoring Engine • TF-IDF + Google Gemini</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl text-zinc-900 dark:text-zinc-50">
            Pass the ATS Filter. <br />
            <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Land 3x More Interviews.
            </span>
          </h1>

          <p className="mx-auto max-w-2xl text-base sm:text-lg text-zinc-600 dark:text-zinc-400">
            Over 75% of resumes are discarded by automated Applicant Tracking Systems before a human ever reads them.
            Our dual-layer scoring engine combines deterministic keyword matching with Google Gemini AI to optimize your resume for any role.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={isAuthenticated ? "/analyze" : "/register"}
              className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-7 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 transition-all cursor-pointer"
            >
              Analyze Your Resume Now
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#how-it-works"
              className="flex h-12 w-full sm:w-auto items-center justify-center rounded-xl border border-zinc-300 bg-white px-6 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 transition-all"
            >
              Explore Scoring Formula
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Search className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
              Keyword Gap Analysis
            </h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Deterministic matching identifies missing technical skills, frameworks, and role-critical tools.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-400">
              <Cpu className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
              Semantic AI Relevance
            </h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Gemini LLM understands domain depth and context beyond shallow keyword stuffing.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <TrendingUp className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
              XYZ Bullet Rewriter
            </h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Upgrades weak, passive bullet points into quantified, action-oriented accomplishment statements.
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <FileCheck2 className="h-5 w-5" />
            </div>
            <h3 className="mt-4 text-base font-bold text-zinc-900 dark:text-zinc-100">
              Export PDF Report
            </h3>
            <p className="mt-2 text-xs text-zinc-500 dark:text-zinc-400">
              Download clean, recruiter-grade ATS reports with section-by-section checklists.
            </p>
          </div>
        </div>
      </section>

      {/* How Scoring Works Section */}
      <section id="how-it-works" className="w-full bg-zinc-100/70 dark:bg-zinc-900/40 py-16 px-4 sm:px-6 lg:px-8 border-y border-zinc-200 dark:border-zinc-800">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="text-center space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-900 dark:text-zinc-100">
              How the Hybrid Scoring Formula Works
            </h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 max-w-xl mx-auto">
              Real interviewers and ATS systems do not rely on an opaque single prompt. We use a transparent, weighted 4-pillar model.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold text-xs">
                  40%
                </span>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Keyword Match (Deterministic)
                  </h4>
                  <p className="text-xs text-zinc-500">Skills Dictionary + TF-IDF extraction</p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Extracts required technical skills from the job description and matches against your resume with full synonym support (e.g. &ldquo;JS&rdquo; ↔ &ldquo;JavaScript&rdquo;).
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white font-bold text-xs">
                  30%
                </span>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Experience Relevance (Gemini LLM)
                  </h4>
                  <p className="text-xs text-zinc-500">Semantic contextual comprehension</p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Evaluates your real career progression, responsibilities, and depth to assess whether you truly meet the seniority expectations of the role.
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white font-bold text-xs">
                  15%
                </span>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Formatting & Section Completeness
                  </h4>
                  <p className="text-xs text-zinc-500">ATS parser readability checks</p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Verifies standard headers (Summary, Skills, Experience, Education), contact data formatting, and word count hygiene.
              </p>
            </div>

            <div className="rounded-2xl bg-white dark:bg-zinc-900 p-6 border border-zinc-200 dark:border-zinc-800 space-y-4">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-600 text-white font-bold text-xs">
                  15%
                </span>
                <div>
                  <h4 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                    Impact & Quantification (Gemini LLM)
                  </h4>
                  <p className="text-xs text-zinc-500">Measurable metrics & business results</p>
                </div>
              </div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400">
                Checks for numerical proof, percentage gains, throughput improvements, and team leadership evidence across your bullet points.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
