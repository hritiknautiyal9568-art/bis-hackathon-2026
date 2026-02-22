@echo off
title BIS Smart Portal - Setup
echo.
echo ============================================
echo   BIS Smart Portal - One-Click Setup
echo   Hackathon 2026
echo ============================================
echo.

:: Check Node.js
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    echo Download the LTS version and run this script again.
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VER=%%i
echo [OK] Node.js found: %NODE_VER%

:: Check npm
where npm >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VER=%%i
echo [OK] npm found: v%NPM_VER%
echo.

:: Install dependencies
echo [1/3] Installing dependencies (this may take 1-2 minutes)...
echo.
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] npm install failed!
    pause
    exit /b 1
)
echo.
echo [OK] Dependencies installed successfully!
echo.

:: Create .env.local if not exists
if not exist ".env.local" (
    echo [2/3] Creating .env.local file...
    set /p API_KEY="Enter your Gemini API Key (get one at https://aistudio.google.com/apikey): "
    (
        echo GEMINI_API_KEY=%API_KEY%
        echo JWT_SECRET=bis-portal-secret-key-2026
    ) > .env.local
    echo [OK] .env.local created!
) else (
    echo [2/3] .env.local already exists - skipping
)
echo.

:: Start the server
echo [3/3] Starting BIS Smart Portal...
echo.
echo ============================================
echo   Server starting at http://localhost:3000
echo   Press Ctrl+C to stop
echo ============================================
echo.
call npm run dev
