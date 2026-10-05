# AI Resume Analyzer & ATS Scorer

An intelligent, full-stack ATS (Applicant Tracking System) resume analyzer and scoring engine built with Next.js, Express, MongoDB, Natural NLP, and Google Gemini AI.

![ATS Scorer Architecture](https://img.shields.io/badge/Next.js-16-black?style=flat&logo=next.js)
![Node.js](https://img.shields.io/badge/Node.js-20+-green?style=flat&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?style=flat&logo=mongodb)
![Google Gemini](https://img.shields.io/badge/AI-Google%20Gemini-blue?style=flat&logo=google)
[![Live Demo](https://img.shields.io/badge/Live_Demo-Vercel-success?style=flat&logo=vercel)](https://ai-resume-analyzer-eosin-delta.vercel.app)

---

## 🚀 Key Features

- **Hybrid ATS Scoring Algorithm**: Rather than relying on an opaque, single AI prompt, scores are calculated using a transparent 4-pillar weighted model combining deterministic TF-IDF NLP with semantic LLM evaluation.
- **Automated Resume Parsing**: Extracts and normalizes text from PDF (`pdf-parse`) and Word (`mammoth`) documents with scanned document detection.
- **Keyword & Skill Gap Detection**: Cross-references job descriptions against a 300+ tech skill dictionary with synonym resolution (e.g. `JS` ↔ `JavaScript`, `K8s` ↔ `Kubernetes`).
- **Google XYZ Bullet Rewriter**: Transforms weak, passive statements into high-impact, quantified achievement bullets.
- **Recruiter-Ready PDF Reports**: Generates downloadable ATS analysis reports using PDFKit.
- **Score Progression Dashboard**: Visualizes candidate ATS score improvements over time using Recharts.
- **Secure Authentication**: HTTP-only JWT cookies, bcrypt password hashing, and rate limiting.

---

## 🧮 How the Scoring Formula Works

| Component | Weight | Engine | Description |
| :--- | :--- | :--- | :--- |
| **Keyword Match** | **40%** | Deterministic (TF-IDF + Skills Dictionary) | Checks job description requirements against resume text with synonym resolution. |
| **Experience Relevance** | **30%** | Semantic (Google Gemini LLM) | Evaluates contextual depth, seniority match, and domain alignment. |
| **Formatting & Structure** | **15%** | Deterministic ATS Checks | Validates standard sections (Summary, Skills, Experience, Education), contact info, word count, and bullet formatting. |
| **Impact & Quantification** | **15%** | Semantic (Google Gemini LLM) | Measures metrics, percentages, throughput numbers, and the Google XYZ formula. |

$$\text{Overall Score} = \text{round}(0.40 \cdot K + 0.30 \cdot R + 0.15 \cdot F + 0.15 \cdot I)$$

---

## 📂 Project Structure

```
ai-resume-analyzer/
├── client/                         # Next.js App Router (Frontend)
│   ├── app/
│   │   ├── (auth)/login/page.jsx   # Login page
│   │   ├── (auth)/register/page.jsx# Register page
│   │   ├── dashboard/page.jsx      # Analytics & history
│   │   ├── analyze/page.jsx        # Resume upload & JD input
│   │   ├── analysis/[id]/page.jsx  # Detailed results & PDF export
│   │   ├── layout.jsx              # Root layout & AuthProvider
│   │   └── page.js                 # Landing page
│   ├── components/
│   │   ├── UploadDropzone.jsx      # Drag-and-drop resume uploader
│   │   ├── ScoreGauge.jsx          # SVG radial score gauge
│   │   ├── KeywordChips.jsx        # Matched/Missing interactive chips
│   │   ├── SuggestionList.jsx      # Actionable recommendations & rewriter
│   │   ├── HistoryChart.jsx        # Score progression over time (Recharts)
│   │   └── Navbar.jsx              # Responsive navigation
│   ├── lib/api.js                  # Unified API client
│   └── hooks/useAuth.js            # Auth state hook
│
└── server/                         # Express API (Backend)
    ├── src/
    │   ├── config/db.js            # MongoDB Mongoose connection
    │   ├── models/                 # User, Resume, Analysis models
    │   ├── routes/                 # Auth, Resume, Analysis routes
    │   ├── controllers/            # Route controllers
    │   ├── middleware/             # Auth, upload, errorHandler, rateLimit
    │   ├── services/
    │   │   ├── parser.service.js   # PDF & DOCX text extraction
    │   │   ├── keyword.service.js  # TF-IDF keyword & formatting engine
    │   │   ├── scoring.service.js  # Hybrid weighted scoring formula
    │   │   ├── llm.service.js      # Google Gemini integration & bullet rewriter
    │   │   └── report.service.js   # PDF report generator (PDFKit)
    │   └── utils/
    │       ├── skillsDictionary.json # 300+ skills with synonym mappings
    │       └── textCleaner.js      # Text normalization and section extraction
    ├── tests/
    │   └── scoring.test.js         # Automated scoring test suite
    └── server.js                   # Server entry point
```

---

## 🛠️ Quickstart & Setup

### 1. Backend Setup

```bash
cd server
npm install
```

Configure your `server/.env` file:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=gemini-2.5-flash
```

> **Note on MongoDB Atlas**: Ensure your IP address is whitelisted in MongoDB Atlas under **Network Access** (`0.0.0.0/0` for development).

Run unit tests:
```bash
npm test
```

Start the backend server:
```bash
npm run dev
```

### 2. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` — Register user & issue JWT cookie
- `POST /api/auth/login` — Login user & issue JWT cookie
- `POST /api/auth/logout` — Clear JWT cookie
- `GET /api/auth/me` — Get authenticated user profile

### Resumes
- `POST /api/resumes/upload` — Upload and parse PDF/DOCX file
- `GET /api/resumes` — List current user's uploaded resumes
- `GET /api/resumes/:id` — Get single resume with parsed sections
- `DELETE /api/resumes/:id` — Delete resume

### Analysis
- `POST /api/analysis` — Run hybrid ATS scoring on resume vs job description
- `GET /api/analysis` — Retrieve user analysis history
- `GET /api/analysis/:id` — View full analysis report breakdown
- `DELETE /api/analysis/:id` — Delete analysis record
- `POST /api/analysis/:id/rewrite` — AI bullet point rewriter
- `GET /api/analysis/:id/report` — Download branded PDF report

---

## 💼 Resume Bullets Earned

- *Built a full-stack AI Resume Analyzer (Next.js, Node.js, MongoDB) that scores resumes against job descriptions using a hybrid keyword and LLM scoring engine.*
- *Designed a weighted ATS scoring algorithm combining TF-IDF keyword matching with LLM-based semantic analysis.*
- *Implemented secure JWT authentication, file parsing pipeline (PDF/DOCX), and rate-limited REST APIs.*
