# 🤖 Autonomous AI SDR Control Platform

## 📖 Project Overview
The Autonomous AI SDR Platform is an end-to-end automated sales development application designed to discover, enrich, qualify, and contact prospects with zero human intervention. Built for a hackathon, the platform utilizes a robust background engine that continuously evaluates leads against customized Ideal Customer Profiles (ICPs).

When a campaign is marked as "Live," the background engine wakes up on a set interval, pulls undiscovered prospects from the database, and orchestrates a pipeline of specialized AI agents (via DronaHQ) to enrich company data, evaluate ICP fit, and draft hyper-personalized outreach. The system features a togglable "Human-in-the-Loop" (HITL) approval queue, allowing users to review and manually approve drafted emails before they are dispatched via the Resend API, or seamlessly bypass the queue for fully autonomous execution.

## 🛠 Tech Stack
*   **Frontend:** React (Vite), Tailwind CSS, Shadcn UI (for accessible, styled components), React Router, Axios.
*   **Backend:** Node.js, Express.js.
*   **Database:** Supabase (PostgreSQL) using `pg-pool` for connection management.
*   **AI & Agents:** DronaHQ (Webhooks connecting to specialized LLM prompts).
*   **Email Infrastructure:** Resend API (bypassing restrictive SMTP/IPv6 issues).
*   **Deployment:** Vercel (Frontend) & Render (Backend).

## 🏗 Architecture Overview
The application follows a decoupled client-server architecture with a specialized background worker:

1.  **Frontend App (Vercel):** Acts as the command center. Users create campaigns, define ICPs, configure AI agent parameters, and manage the approval queue. It communicates exclusively with the Node.js REST API.
2.  **REST API (Render):** Handles CRUD operations for campaigns, prospects, and approval queues. It directly queries the Supabase database to keep state synchronized.
3.  **Autonomous Engine (Background Loop):** Initialized on server startup, this engine runs a `setInterval` loop independent of API requests. It:
    *   Scans Supabase for "Live" campaigns with prospects in the "Discovered" stage.
    *   Calls the **Enrichment Agent** to normalize missing data.
    *   Calls the **ICP Fitment Agent** to qualify the prospect against campaign rules.
    *   Calls the **Personalisation Agent** to draft context-aware emails.
    *   Routes the draft to either the database (Approval Queue) or directly to the Resend API based on the HITL toggle.

## 📂 File and Folder Structure (What lives where and why)

### Frontend (`/frontend`)
*   `/src/components/dashboard/`: Contains the core UI modules.
    *   `ApprovalQueue.jsx`: Manages the Human-in-the-Loop review process.
    *   `CampaignList.jsx` & `CampaignDetail.jsx`: Renders the data visualizations and active campaign metrics.
    *   `CampaignForm.jsx`: Captures complex user inputs for ICP and agent tuning.
*   `/src/utils/`: 
    *   `axios.js`: Centralized Axios instance with automatic JWT injection and base URL configuration.
    *   `authServices.js`: Handles login and cookie management.

### Backend (`/backend`)
*   `/controllers/`: Maps to API routes to handle incoming HTTP requests.
    *   `campaignController.js`: Manages campaign creation and analytics fetching.
    *   `approvalController.js`: Handles HITL queue updates and database state changes.
*   `/utils/`: The core logic and AI orchestration layer.
    *   `autonomousEngine.js`: The heartbeat of the app. Contains the `setInterval` loop that triggers agent chains without user input.
    *   `agentCaller.js`: Wrapper utility for securely calling DronaHQ APIs with retry logic.
    *   `enrichmentToIcp.js`: A strict data normalizer that validates AI outputs and formats them for the database to prevent hallucinations.
    *   `emailSender.js`: Integrates the Resend SDK to dispatch finalized outreach.
*   `server.js`: The entry point. Initializes Express, binds routes, and crucially, calls `startEngine()` to kick off the autonomous loop.

## 🔐 Required Environment Variables

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:5000/api  # Your backend URL (Local or Render)
```

### Backend (`.env`)
```env
PORT=5000
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# AI Agent API Endpoints & Keys (DronaHQ)
AGENT_URL_ENRICH=https://your-dronahq-webhook-url/enrich
AGENT_KEY_ENRICH=your_agent_api_key
AGENT_URL_ICP=https://your-dronahq-webhook-url/icp
AGENT_KEY_ICP=your_agent_api_key
AGENT_URL_PERSONALISE=https://your-dronahq-webhook-url/personalise
AGENT_KEY_PERSONALISE=your_agent_api_key

# Email Infrastructure
RESEND_API_KEY=re_your_resend_api_key
EMAIL_USER=your_verified_resend_email@example.com
```

## 🚀 Setup and Run Instructions

### 1. Database Setup
1. Create a new Supabase project.
2. Execute the provided SQL schema file in the Supabase SQL Editor to generate the required tables (`campaigns`, `prospects`, `campaign_prospects`, `pending_drafts`, `agent_logs`, `app_settings`).

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Run `npm install` to download dependencies (Express, pg-pool, axios, resend).
3. Create a `.env` file in the root of the backend folder using the variables listed above.
4. Run `npm run dev` (or `node server.js`) to start the server. You should see `🚀 Autonomous AI SDR Engine Initialized` in the console.

### 3. Frontend Setup
1. Open a new terminal window and navigate to the `frontend` directory.
2. Run `npm install` to download dependencies (React, Vite, Tailwind, Shadcn).
3. Create a `.env` file with your `VITE_API_URL`.
4. Run `npm run dev` to start the Vite development server.
5. Open `http://localhost:5173` in your browser to access the dashboard.