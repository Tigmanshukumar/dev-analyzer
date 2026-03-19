# Dev Personality Analyzer

A full-stack application to analyze GitHub profiles and discover developer personalities based on repository data, languages, and activity.

## Project Structure

```text
dev-personality-analyzer/
├── client/           # Next.js Frontend (App Router, Tailwind CSS)
├── server/           # Node.js + Express Backend
└── README.md
```

## Getting Started

### Backend Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file and add your GitHub token (optional but recommended for higher rate limits):
   ```env
   PORT=5000
   GITHUB_TOKEN=your_github_token_here
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the client directory:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Tech Stack

- **Frontend:** Next.js 14+ (App Router), Tailwind CSS, Axios, TypeScript
- **Backend:** Node.js, Express, Axios, Dotenv, CORS
- **API:** GitHub REST API

## Features

- Analyze any public GitHub profile by username
- Visualize repository statistics (stars, forks, languages)
- Modern and responsive UI with dark mode support
- Clean and scalable architecture
