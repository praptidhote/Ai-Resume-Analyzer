"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "../../../lib/api";
import ScoreGauge from "../../../components/ScoreGauge";
import KeywordChips from "../../../components/KeywordChips";
import SuggestionList from "../../../components/SuggestionList";
import {
  Download,
  ArrowLeft,
  Sparkles,
  FileText,
  Briefcase,
  CheckCircle,
  AlertTriangle,
  Layers,
  ChevronRight,
  Loader2,
  Calendar,
  Building,
} from "lucide-react";

export default function AnalysisResultPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("overview"); // 'overview', 'keywords', 'feedback', 'bullets'

  useEffect(() => {
    async function fetchAnalysis() {
      if (!id) return;
      try {
        const res = await api.getAnalysisById(id);
        if (res.success && res.analysis) {
          setAnalysis(res.analysis);
        }
      } catch (err) {
        setError(err.message || "Failed to load analysis details");
      } finally {
        setLoading(false);
      }
    }
    fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="mx-auto max-w-xl px-4 py-16 text-center">
        <AlertTriangle className="mx-auto h-12 w-12 text-rose-500" />
        <h2 className="mt-4 text-xl font-bold">Analysis Not Found</h2>
        <p className="mt-2 text-sm text-zinc-500">{error || "Could not retrieve the requested record."}</p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Link>
      </div>
    );
  }

  const { scores = {}, keywords = {}, sectionFeedback = {}, suggestions = [], rewrittenBullets = [] } = analysis;

  const handleDownloadPdf = () => {
    window.open(api.downloadReportUrl(id), "_blank");
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Top Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <div className="space-y-1">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
              {analysis.jobTitle || "ATS Analysis Result"}
            </h1>
            {analysis.companyName && (
              <span className="inline-flex items-center gap-1 rounded-md bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <Building className="h-3 w-3" />
                {analysis.companyName}
              </span>
            )}
          </div>
          <p className="text-xs text-zinc-500 flex items-center gap-2">
            <span>Resume: {analysis.resumeId?.fileName || "Uploaded Resume"}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {new Date(analysis.createdAt).toLocaleDateString()}
            </span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200 transition-colors cursor-pointer"
          >
            <Download className="h-4 w-4" />
            Download PDF Report
          </button>
          <Link
            href="/analyze"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
          >
            <Sparkles className="h-4 w-4" />
            Analyze Another Job
          </Link>
        </div>
      </div>

      {/* Main Score & Component Cards */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Score Gauge */}
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col items-center justify-center">
          <ScoreGauge score={scores.overall || 0} size={190} />
          <p className="mt-2 text-center text-xs text-zinc-500 dark:text-zinc-400">
            Weighted composite score based on keywords, experience relevance, format hygiene, and quantified impact.
          </p>
        </div>

        {/* Right: 4-Component Score Breakdown */}
        <div className="lg:col-span-2 rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
              Scoring Component Breakdown
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">
              Targeted weights aligned with modern ATS parsing standards
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {/* Keyword Match (40%) */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-700 dark:text-zinc-300">Keyword Match (40%)</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-bold">{scores.keywordMatch || 0}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full bg-indigo-600 transition-all duration-700"
                  style={{ width: `${scores.keywordMatch || 0}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-400">
                {keywords.matched?.length || 0} matched vs {keywords.missing?.length || 0} missing
              </p>
            </div>

            {/* Experience Relevance (30%) */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-700 dark:text-zinc-300">Experience Relevance (30%)</span>
                <span className="text-violet-600 dark:text-violet-400 font-bold">{scores.relevance || 0}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full bg-violet-600 transition-all duration-700"
                  style={{ width: `${scores.relevance || 0}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-400">
                AI semantic depth evaluation
              </p>
            </div>

            {/* Formatting & Completeness (15%) */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-700 dark:text-zinc-300">Formatting & Layout (15%)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{scores.formatting || 0}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full bg-emerald-600 transition-all duration-700"
                  style={{ width: `${scores.formatting || 0}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-400">
                ATS parser readability & section headers
              </p>
            </div>

            {/* Impact & Quantification (15%) */}
            <div className="rounded-xl border border-zinc-100 bg-zinc-50/70 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-zinc-700 dark:text-zinc-300">Impact & Metrics (15%)</span>
                <span className="text-amber-600 dark:text-amber-400 font-bold">{scores.impact || 0}%</span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-700">
                <div
                  className="h-full bg-amber-600 transition-all duration-700"
                  style={{ width: `${scores.impact || 0}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-zinc-400">
                Google XYZ formula & metric quantification
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-zinc-200 dark:border-zinc-800">
        <nav className="flex space-x-6">
          <button
            onClick={() => setActiveTab("overview")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "overview"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            Overview & Fixes
          </button>
          <button
            onClick={() => setActiveTab("keywords")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "keywords"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            Keywords ({keywords.matched?.length || 0} / {(keywords.matched?.length || 0) + (keywords.missing?.length || 0)})
          </button>
          <button
            onClick={() => setActiveTab("sections")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "sections"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            Section Feedback
          </button>
          <button
            onClick={() => setActiveTab("rewriter")}
            className={`pb-3 text-sm font-semibold border-b-2 transition-colors ${
              activeTab === "rewriter"
                ? "border-indigo-600 text-indigo-600 dark:border-indigo-400 dark:text-indigo-400"
                : "border-transparent text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-300"
            }`}
          >
            Bullet Rewriter
          </button>
        </nav>
      </div>

      {/* Tab Panels */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Priority Action Items
            </h3>
            <div className="space-y-3">
              {suggestions.map((item, idx) => (
                <div key={idx} className="rounded-xl border border-zinc-100 bg-zinc-50 p-4 dark:border-zinc-800 dark:bg-zinc-800/40">
                  <p className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                    {idx + 1}. {item.issue}
                  </p>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                    <span className="font-semibold text-indigo-600 dark:text-indigo-400">Fix: </span>
                    {item.fix}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100 mb-4">
              Missing High-Impact Skills
            </h3>
            <KeywordChips matched={keywords.matched || []} missing={keywords.missing || []} />
          </div>
        </div>
      )}

      {activeTab === "keywords" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <KeywordChips matched={keywords.matched || []} missing={keywords.missing || []} />
        </div>
      )}

      {activeTab === "sections" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Professional Summary
            </h4>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {sectionFeedback.summary || "Summary section meets standard expectations."}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Technical Skills Section
            </h4>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {sectionFeedback.skills || "Skills section effectively lists recognized technologies."}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Work Experience Section
            </h4>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {sectionFeedback.experience || "Experience section demonstrates relevant responsibilities."}
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Education & Certifications
            </h4>
            <p className="mt-2 text-xs text-zinc-600 dark:text-zinc-300 leading-relaxed">
              {sectionFeedback.education || "Education details are clearly presented."}
            </p>
          </div>
        </div>
      )}

      {activeTab === "rewriter" && (
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <SuggestionList
            suggestions={suggestions}
            rewrittenBullets={rewrittenBullets}
            analysisId={id}
            targetRole={analysis.jobTitle || "Software Engineer"}
          />
        </div>
      )}
    </div>
  );
}
