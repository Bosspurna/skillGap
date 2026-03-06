# SkillGap (CareerDNA) - AI Career Analysis Platform

## Overview
SkillGap is a full-stack platform designed to help students and professionals identify their career readiness. By analyzing skills, interests, and academic performance, it provides a compatibility score and a personalized AI-generated roadmap to bridge the gap between current skills and target roles.

## Tech Stack
- **Frontend**: React, Vite, TailwindCSS, Recharts, Framer Motion, Zustand
- **Backend**: Node.js, Express, SQLite (for preview) / PostgreSQL (for production)
- **AI**: Google Gemini API

## Getting Started

### Local Development
1. Install dependencies: `npm install`
2. Set up environment variables in `.env` (see `.env.example`)
3. Run the development server: `npm run dev`

### Docker Setup
1. Build and run: `docker-compose up --build`

## API Endpoints
- `POST /api/auth/signup`: Create a new account
- `POST /api/auth/login`: Authenticate and get JWT
- `POST /api/assessment/submit`: Submit career profile
- `GET /api/career/result`: Get analysis results
- `GET /api/user/profile`: Get user details

## Database Schema
- **Users**: id, name, email, password_hash, created_at
- **Assessments**: id, user_id, skills, interests, personality, cgpa, target_career, score, strengths, gaps, roadmap, created_at
