@echo off
echo Installing dependencies...
call npm run install-all

echo.
echo Starting development server...
echo Frontend and Backend will run on http://localhost:5000
echo.

call npm run dev