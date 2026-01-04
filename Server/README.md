# Mental Health Assessment Platform - Backend

Node.js/Express backend API for the Mental Health Assessment Platform.

## Tech Stack
- Node.js + Express 5.2.1
- MongoDB + Mongoose 9.0.2
- JWT Authentication
- Razorpay Payment Integration
- PDF Generation with PDFKit
- Email with Nodemailer

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Update `.env` with your database, email, and payment credentials

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Backend will run on: http://localhost:5000

4. **Run production server:**
   ```bash
   npm start
   ```

## Environment Variables

Create a `.env` file in this directory:

```
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

JWT_ACCESS_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_refresh_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email
SMTP_PASS=your_email_password

RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```

## Available Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server

## API Endpoints

- `/api/auth` - Authentication endpoints
- `/api/tests` - Assessment management
- `/api/attempts` - Test session handling
- `/api/results` - Assessment results
- `/api/payments` - Payment processing
- `/api/admin` - Admin dashboard APIs

## Project Structure

```
src/
├── Config/       # Database, mail, payment configs
├── Controller/   # Route handlers
├── Middleware/   # Auth, validation, error handling
├── Model/        # MongoDB schemas
├── Routes/       # API route definitions
├── Services/     # Business logic services
└── Utils/        # Helper utilities
```