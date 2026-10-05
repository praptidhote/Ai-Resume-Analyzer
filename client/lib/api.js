function getBaseUrl() {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  if (typeof window !== "undefined" && window.location.hostname !== "localhost") {
    return "https://ai-resume-analyzer-55m7.onrender.com/api";
  }
  return "http://localhost:5000/api";
}

class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

async function request(endpoint, options = {}) {
  const url = `${getBaseUrl()}${endpoint}`;
  const headers = {
    ...options.headers,
  };

  // Only set application/json if body is not FormData
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
    credentials: "include", // Send and receive cookies
  };

  try {
    const res = await fetch(url, config);
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/pdf")) {
      return res.blob();
    }

    const data = await res.json().catch(() => ({}));

    if (!res.ok) {
      throw new ApiError(
        data.message || `Request failed with status ${res.status}`,
        res.status,
        data
      );
    }

    return data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error.message || "Network error. Please check your connection.",
      0
    );
  }
}

export const api = {
  // Auth
  register: (body) =>
    request("/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) =>
    request("/auth/login", { method: "POST", body: JSON.stringify(body) }),
  logout: () => request("/auth/logout", { method: "POST" }),
  getMe: () => request("/auth/me", { method: "GET" }),

  // Resumes
  uploadResume: (formData) =>
    request("/resumes/upload", { method: "POST", body: formData }),
  getResumes: () => request("/resumes", { method: "GET" }),
  getResumeById: (id) => request(`/resumes/${id}`, { method: "GET" }),
  deleteResume: (id) => request(`/resumes/${id}`, { method: "DELETE" }),

  // Analysis
  createAnalysis: (body) =>
    request("/analysis", { method: "POST", body: JSON.stringify(body) }),
  getAnalyses: () => request("/analysis", { method: "GET" }),
  getAnalysisById: (id) => request(`/analysis/${id}`, { method: "GET" }),
  deleteAnalysis: (id) => request(`/analysis/${id}`, { method: "DELETE" }),
  rewriteBullet: (id, body) =>
    request(`/analysis/${id}/rewrite`, {
      method: "POST",
      body: JSON.stringify(body),
    }),
  downloadReportUrl: (id) => `${getBaseUrl()}/analysis/${id}/report`,
};
