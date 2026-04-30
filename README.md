# Habit Tracker

A minimal web app for building and maintaining daily habits. Track your streaks, visualize completion history on a calendar grid, and stay consistent.

## Features

- Add, rename, and delete habits
- Mark habits complete or incomplete for any past day
- Visual calendar showing up to 24 months of history
- Per-habit stats: current streak, longest streak, and 30-day completion rate
- Daily progress summary in the header
- Data persists locally in the browser (no account required)

## Tech Stack

- **React 19** — UI framework
- **Vite** — dev server and build tool
- **ESLint** — linting with React Hooks rules

No backend. All data is stored in `localStorage`.

## Getting Started

**Prerequisites:** Node.js 18+

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Build for production |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |
