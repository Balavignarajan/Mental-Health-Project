# Mental Health Assessment Platform

A comprehensive mental health assessment platform with React frontend and Node.js backend.

## Features
- User authentication & authorization
- Dynamic mental health tests
- Payment processing with Razorpay
- PDF report generation
- Admin dashboard
- Consent management

## Quick Start

1. **Install all dependencies:**
   ```bash
   npm run install-all
   ```

2. **Set up MongoDB:**
   - Install MongoDB locally or use MongoDB Atlas
   - Update `MONGO_URI` in `.env`

3. **Configure environment:**
   - Update `.env` with your credentials
   - Set up email, Razorpay, and other services

4. **Run the application:**
   ```bash
   npm run dev
   ```
   This will start both frontend and backend on http://localhost:5000
   
   **Alternative:** Double-click `start-dev.bat` on Windows

## Project Structure
- `/client` - React frontend with Vite and Tailwind CSS
- `/Server` - Node.js/Express backend with MongoDB
- Root level configs for Vite, Tailwind, and PostCSS

## API Endpoints
- `/api/auth` - Authentication
- `/api/tests` - Mental health tests
- `/api/attempts` - Test attempts
- `/api/results` - Test results
- `/api/payments` - Payment processing
- `/api/reports` - Report generation

## Tech Stack
**Frontend:** React, Vite, Tailwind CSS
**Backend:** Node.js, Express, MongoDB, JWT
**Payments:** Razorpay
**Email:** Nodemailer

## Development Notes
- Tailwind CSS is configured at the root level for proper integration
- Vite dev server runs in middleware mode through Express
- Both frontend and backend serve from port 5000 in development
- Hot module replacement (HMR) is enabled for React components