# Campaign Tracker MVP

A full-stack application for tracking advertising campaigns.

## Technologies
- Frontend: React + TypeScript + Vite
- Backend: Node.js + Express + TypeScript
- Database: SQLite

## Project Structure
```text
.
├── client/                  # React app
│   ├── public/
│   └── src/
│       ├── components/
│       ├── api.ts
│       ├── types.ts
│       ├── App.tsx
│       ├── index.css
│       └── main.tsx
├── server/                  # Express API
│   ├── data/                # Local sqlite runtime data (ignored by git)
│   └── src/
│       ├── controllers/
│       ├── db/
│       ├── routes/
│       ├── services/
│       ├── types/
│       └── index.ts
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

1. Install dependencies:
   ```bash
   npm run install:all
   ```

2. Start frontend and backend:
   ```bash
   npm run dev
   ```

The application will start the React interface on `http://localhost:5173` and the backend Express API on `http://localhost:3000`.

## Features
- Create ad campaigns
- Track event clicks and impressions
- Real-time statistics tracking including CTR calculations

## API Endpoints
- `POST /api/campaigns` - Create a campaign (`{ name: string }`)
- `GET /api/campaigns` - Retrieve all campaigns
- `POST /api/events` - Track an event (`{ campaignId: number, type: 'click' | 'impression' }`)
- `GET /api/stats` - Retrieve stats for all campaigns
