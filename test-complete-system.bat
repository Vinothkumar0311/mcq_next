@echo off
echo ========================================
echo    COMPLETE MODULE TEST SYSTEM CHECK
echo ========================================
echo.

echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm run dev"

echo Waiting for server to start...
timeout /t 10 /nobreak > nul

echo.
echo Testing system health...
curl -s http://localhost:5000/api/health
if %errorlevel% neq 0 (
    echo ❌ Backend server not responding
    echo Please check the backend server window for errors
    pause
    exit /b 1
)

echo.
echo ✅ Backend server is running
echo.

echo Running complete system diagnostic...
node test-module-system-complete.js

echo.
echo Test completed! Check results above.
pause