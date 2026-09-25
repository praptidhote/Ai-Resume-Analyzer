"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import HistoryChart from "../../components/HistoryChart";
import {
  Sparkles,
  FileText,
  Trash2,
  ExternalLink,
  Download,
  Plus,
  Clock,
  Building,
  TrendingUp,
  Award,
  AlertCircle,
  Loader2,
} from "lucide-react";

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  const [analyses, setAnalyses] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analysesRes, resumesRes] = await Promise.all([
        api.getAnalyses().catch(() => ({ analyses: [] })),
        api.getResumes().catch(() => ({ resumes: [] })),
      ]);

      if (analysesRes.analyses) setAnalyses(analysesRes.analyses);
      if (resumesRes.resumes) setResumes(resumesRes.resumes);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      fetchData();
    }
  }, [isAuthenticated, authLoading, router]);

  const handleDeleteAnalysis = async (id) => {
    if (!confirm("Are you sure you want to delete this analysis report?")) return;
    try {
      await api.deleteAnalysis(id);
      setAnalyses((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      alert("Failed to delete analysis: " + err.message);
    }
  };

  const handleDeleteResume = async (id) => {
    if (!confirm("Are you sure you want to delete this resume?")) return;
    try {
      await api.deleteResume(id);
      setResumes((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Failed to delete resume: " + err.message);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex flex-1 items-center justify-center p-16">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  const averageScore =
    analyses.length > 0
      ? Math.round(
          analyses.reduce((acc, curr) => acc + (curr.scores?.overall || 0), 0) /
            analyses.length
        )
      : 0;

  const highestScore =
    analyses.length > 0
      ? Math.max(...analyses.map((a) => a.scores?.overall || 0))
      : 0;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
      {/* Welcome & CTA banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            Welcome back, {user?.name || "Candidate"}
          </h1>
          <p className="text-xs text-zinc-500 mt-1">
            Track your ATS score progress, review keyword gaps, and optimize for new job postings.
          </p>
        </div>

        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-colors"
        >
          <Sparkles className="h-4 w-4" />
          Analyze New Job Description
        </Link>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs text-rose-700">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Total Analyses</span>
            <span className="rounded-lg bg-indigo-50 p-2 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
              <Clock className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {analyses.length}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Average ATS Score</span>
            <span className="rounded-lg bg-emerald-50 p-2 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <TrendingUp className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {averageScore}
            <span className="text-xs font-normal text-zinc-400"> / 100</span>
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-500">Top Match Score</span>
            <span className="rounded-lg bg-amber-50 p-2 text-amber-600 dark:bg-amber-950 dark:text-amber-400">
              <Award className="h-4 w-4" />
            </span>
          </div>
          <p className="mt-2 text-2xl font-bold text-zinc-900 dark:text-zinc-100">
            {highestScore}
            <span className="text-xs font-normal text-zinc-400"> / 100</span>
          </p>
        </div>
      </div>

      {/* Score Over Time Trend Chart */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
          ATS Score Progression Over Time
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5 mb-4">
          Tracking Overall, Keyword Match, and Semantic Relevance
        </p>
        <HistoryChart data={analyses} />
      </div>

      {/* Analysis History Table */}
      <div className="rounded-2xl border border-zinc-200 bg-white shadow-sm dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden">
        <div className="p-5 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200">
            Recent Analysis Reports ({analyses.length})
          </h3>
        </div>

        {analyses.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-500">
            No analyses run yet.{" "}
            <Link href="/analyze" className="text-indigo-600 font-semibold hover:underline">
              Analyze your first resume now
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-50 text-zinc-500 dark:bg-zinc-800/50 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="px-5 py-3">Target Role & Company</th>
                  <th className="px-5 py-3">Resume Used</th>
                  <th className="px-5 py-3">ATS Score</th>
                  <th className="px-5 py-3">Date</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {analyses.map((item) => {
                  const score = item.scores?.overall || 0;
                  const scoreBadgeColor =
                    score >= 80
                      ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                      : score >= 60
                      ? "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                      : "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300";

                  return (
                    <tr key={item._id} className="hover:bg-zinc-50/60 dark:hover:bg-zinc-800/30">
                      <td className="px-5 py-3.5">
                        <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                          {item.jobTitle || "Job Analysis"}
                        </p>
                        {item.companyName && (
                          <p className="text-[11px] text-zinc-400">{item.companyName}</p>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-zinc-600 dark:text-zinc-300">
                        {item.resumeId?.fileName || "Uploaded Resume"}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex rounded-md px-2 py-0.5 text-xs font-bold ${scoreBadgeColor}`}>
                          {score} / 100
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-zinc-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-3.5 text-right space-x-2">
                        <Link
                          href={`/analysis/${item._id}`}
                          className="inline-flex items-center gap-1 text-indigo-600 hover:text-indigo-500 font-semibold"
                        >
                          View Report
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                        <button
                          onClick={() => window.open(api.downloadReportUrl(item._id), "_blank")}
                          className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200"
                          title="Download PDF"
                        >
                          <Download className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteAnalysis(item._id)}
                          className="p-1 text-rose-500 hover:text-rose-700"
                          title="Delete Analysis"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Uploaded Resumes Vault */}
      <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-800 dark:text-zinc-200 mb-3">
          Saved Resumes ({resumes.length})
        </h3>
        {resumes.length === 0 ? (
          <p className="text-xs text-zinc-400">No resumes stored yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {resumes.map((res) => (
              <div
                key={res._id || res.id}
                className="flex items-center justify-between rounded-xl border border-zinc-200 p-3 dark:border-zinc-800 dark:bg-zinc-800/30"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <FileText className="h-4 w-4 shrink-0 text-indigo-600" />
                  <div className="truncate">
                    <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {res.fileName}
                    </p>
                    <p className="text-[10px] text-zinc-400">
                      {new Date(res.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => handleDeleteResume(res._id || res.id)}
                  className="p-1 text-zinc-400 hover:text-rose-600 transition-colors"
                  title="Delete resume"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
