@echo off
echo ========================================
echo    Enhanced Module System Test
echo ========================================
echo.

echo Checking if backend server is running...
curl -s http://localhost:5000/api/health > nul
if %errorlevel% neq 0 (
    echo ❌ Backend server is not running!
    echo Please start the backend server first:
    echo    cd backend
    echo    npm run dev
    echo.
    pause
    exit /b 1
)

echo ✅ Backend server is running
echo.

echo Installing test dependencies...
npm install axios form-data

echo.
echo Running enhanced module tests...
node test-enhanced-modules.js

echo.
echo Test completed!
pause