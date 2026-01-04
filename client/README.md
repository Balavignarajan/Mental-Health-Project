# Mental Health Assessment Platform - Frontend

React frontend application for the Mental Health Assessment Platform.

## Tech Stack
- React 19.2.0
- Vite 7.2.4
- Tailwind CSS 3.4.0
- React Router DOM 7.11.0
- Axios for API calls

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment:**
   - Update `.env` with your API endpoint and other frontend variables

3. **Run development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on: http://localhost:3000

4. **Build for production:**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in this directory:

```
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Mental Health Assessment Platform
VITE_RAZORPAY_KEY_ID=your_razorpay_key
```

## Available Scripts

- `npm run dev` - Start development server on port 3000
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
src/
├── api/          # API service layers
├── assets/       # Images, icons, static files
├── components/   # Reusable React components
├── pages/        # Page components
├── utils/        # Helper utilities
└── App.jsx       # Main React app
```