"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../../hooks/useAuth";
import { api } from "../../lib/api";
import UploadDropzone from "../../components/UploadDropzone";
import {
  Sparkles,
  ArrowRight,
  FileText,
  Briefcase,
  Building,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PlusCircle,
} from "lucide-react";
import Link from "next/link";

export default function AnalyzePage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");

  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [error, setError] = useState("");

  // Fetch user's existing resumes if authenticated
  useEffect(() => {
    async function loadResumes() {
      if (isAuthenticated) {
        try {
          const res = await api.getResumes();
          if (res.success && res.resumes) {
            setResumes(res.resumes);
            if (res.resumes.length > 0) {
              setSelectedResumeId(res.resumes[0]._id);
            }
          }
        } catch (err) {
          console.warn("Could not load resumes:", err);
        }
      }
    }
    loadResumes();
  }, [isAuthenticated]);

  const handleFileSelected = async (file) => {
    setUploadedFile(file);
    setError("");

    if (!file) {
      return;
    }

    if (!isAuthenticated) {
      setError("Please sign in or create an account to upload and analyze your resume.");
      return;
    }

    // Proactively upload and parse the file
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("resume", file);

      const res = await api.uploadResume(formData);
      if (res.success && res.resume) {
        setResumes((prev) => [res.resume, ...prev]);
        setSelectedResumeId(res.resume.id || res.resume._id);
      }
    } catch (err) {
      setError(err.message || "Failed to upload and parse resume file");
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    let resumeIdToUse = selectedResumeId;

    if (!resumeIdToUse) {
      setError("Please upload or select a resume first.");
      return;
    }

    if (!jobDescription || jobDescription.trim().length < 50) {
      setError("Please paste a comprehensive job description (at least 50 characters).");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(1);

    // Multi-step animated progress simulation
    const timer1 = setTimeout(() => setAnalysisStep(2), 800);
    const timer2 = setTimeout(() => setAnalysisStep(3), 1800);

    try {
      const res = await api.createAnalysis({
        resumeId: resumeIdToUse,
        jobDescription,
        jobTitle: jobTitle || "Target Role",
        companyName: companyName || "",
      });

      if (res.success && res.analysis) {
        router.push(`/analysis/${res.analysis._id}`);
      }
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
      setIsAnalyzing(false);
      clearTimeout(timer1);
      clearTimeout(timer2);
    }
  };

  if (authLoading) {
    return (
      <div className="flex flex-1 items-center justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Title */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-100">
          Analyze Resume vs Job Description
        </h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
          Upload your resume and paste the job posting to compute your ATS match score, keyword gaps, and actionable fixes.
        </p>
      </div>

      {!isAuthenticated && (
        <div className="mb-8 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-5 dark:border-indigo-900/60 dark:bg-indigo-950/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-indigo-950 dark:text-indigo-200">
                Sign in to save and analyze your resumes
              </h3>
              <p className="text-xs text-indigo-800 dark:text-indigo-300 mt-0.5">
                Create a free account to track your ATS score improvement over time.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/login"
                className="rounded-xl border border-indigo-300 bg-white px-4 py-2 text-xs font-semibold text-indigo-700 shadow-sm hover:bg-indigo-50"
              >
                Log In
              </Link>
              <Link
                href="/register"
                className="rounded-xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500"
              >
                Register Free
              </Link>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          <AlertCircle className="h-5 w-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleAnalyze} className="space-y-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left Column: Resume Selection or Upload */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
                <FileText className="h-4 w-4 text-indigo-600" />
                Step 1: Resume File
              </label>
              {resumes.length > 0 && (
                <span className="text-xs text-zinc-500">
                  {resumes.length} saved resume{resumes.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {resumes.length > 0 && (
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-zinc-500">
                  Select previously uploaded resume:
                </label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full rounded-xl border border-zinc-300 bg-white p-2.5 text-xs text-zinc-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                >
                  {resumes.map((r) => (
                    <option key={r._id || r.id} value={r._id || r.id}>
                      {r.fileName} ({new Date(r.createdAt).toLocaleDateString()})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <div className="pt-1">
              <label className="block text-xs font-semibold text-zinc-500 mb-2">
                {resumes.length > 0 ? "Or upload a new version:" : "Upload your resume (PDF or DOCX):"}
              </label>
              <UploadDropzone
                onFileSelected={handleFileSelected}
                isUploading={isUploading}
              />
            </div>
          </div>

          {/* Right Column: Job Posting Details */}
          <div className="space-y-4">
            <label className="text-sm font-bold uppercase tracking-wider text-zinc-700 dark:text-zinc-300 flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-indigo-600" />
              Step 2: Target Job Details
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Job Title
                </label>
                <div className="relative mt-1">
                  <Briefcase className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={(e) => setJobTitle(e.target.value)}
                    placeholder="e.g. Senior Frontend Engineer"
                    className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                  Company Name (Optional)
                </label>
                <div className="relative mt-1">
                  <Building className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Google, Stripe"
                    className="w-full rounded-xl border border-zinc-300 bg-white py-2 pl-9 pr-3 text-xs text-zinc-900 focus:border-indigo-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400">
                Job Description Requirements & Responsibilities *
              </label>
              <textarea
                rows={9}
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste the full job description here (requirements, qualifications, technologies)..."
                className="mt-1 w-full rounded-xl border border-zinc-300 bg-white p-3 text-xs text-zinc-900 placeholder:text-zinc-400 focus:border-indigo-600 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* Submit / Progress Bar */}
        <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
          {isAnalyzing ? (
            <div className="space-y-4 rounded-2xl border border-indigo-200 bg-indigo-50/50 p-6 text-center dark:border-indigo-900/50 dark:bg-indigo-950/20">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-500/30">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>

              <div className="space-y-1">
                <h3 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
                  {analysisStep === 1 && "Extracting & Cleaning Resume Text..."}
                  {analysisStep === 2 && "Running Deterministic Keyword & ATS Format Checks..."}
                  {analysisStep >= 3 && "Running Gemini AI Semantic Evaluation & Bullet Rewriter..."}
                </h3>
                <p className="text-xs text-zinc-500">
                  Processing hybrid scoring formula. This takes just a few seconds...
                </p>
              </div>

              <div className="mx-auto max-w-xs h-2 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
                <div
                  className="h-full bg-indigo-600 transition-all duration-700 ease-out"
                  style={{ width: `${analysisStep * 33}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4">
              <button
                type="submit"
                disabled={isUploading}
                className="flex h-12 w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-indigo-600 px-8 text-sm font-semibold text-white shadow-lg shadow-indigo-500/25 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 disabled:opacity-50 transition-all cursor-pointer"
              >
                <Sparkles className="h-4 w-4" />
                Run ATS Match Analysis
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
