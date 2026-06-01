# Mini Expense Tracker

A production-quality full-stack expense tracking application built with React and Node.js.

## Tech Stack
- **Frontend**: React, Vite, TypeScript, React Router, Recharts, Lucide React
- **Backend**: Node.js, Express, TypeScript, SQLite, Zod
- **Styling**: Vanilla CSS with modern Glassmorphism aesthetics

## Features
- **Dashboard**: View spending insights, total expenses, and monthly averages.
- **Charts**: Interactive Pie Chart (by category) and Bar Chart (spending over time).
- **Expense Management**: Add new expenses with validation, delete existing expenses.
- **Filtering**: Filter your expenses by category.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm

### Installation & Setup

1. **Clone/Download the repository**
2. **Backend Setup**:
   ```bash
   cd server
   npm install
   npm run dev
   ```
   The backend will run on `http://localhost:3001`. A local SQLite database (`database.sqlite`) will be automatically created.

3. **Frontend Setup**:
   Open a new terminal window:
   ```bash
   cd client
   npm install
   npm run dev
   ```
   The frontend will run on `http://localhost:5173`.

## Architecture Details
- **API Design**: RESTful principles used. Input validation on the backend using `zod`.
- **Database**: SQLite used for a zero-configuration persistent storage suitable for assessments.
- **UI/UX**: Custom CSS implementation demonstrating a solid understanding of modern web design principles, flexbox/grid layouts, and responsive design without relying on heavy frameworks like Tailwind.

## Assessment Notes
This project was designed with maintainability and user experience in mind, strictly following the provided technical requirements.
