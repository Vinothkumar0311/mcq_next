@echo off
echo ========================================
echo NUCLEAR FRONTEND FIX - COMPLETE REBUILD
echo ========================================

cd frontend

echo Step 1: Kill all Node processes...
taskkill /f /im node.exe 2>nul
taskkill /f /im npm.exe 2>nul

echo Step 2: Remove ALL corrupted files and folders...
for /d %%i in (node_modules*) do rmdir /s /q "%%i" 2>nul
del package-lock.json 2>nul
del yarn.lock 2>nul
del bun.lockb 2>nul
del .npmrc 2>nul

echo Step 3: Clear ALL npm caches...
npm cache clean --force
npm cache verify

echo Step 4: Create minimal working package.json...
(
echo {
echo   "name": "vite_react_shadcn_ts",
echo   "private": true,
echo   "version": "0.0.0",
echo   "type": "module",
echo   "scripts": {
echo     "dev": "vite",
echo     "build": "vite build",
echo     "preview": "vite preview"
echo   },
echo   "dependencies": {
echo     "react": "^18.3.1",
echo     "react-dom": "^18.3.1"
echo   },
echo   "devDependencies": {
echo     "@types/react": "^18.3.3",
echo     "@types/react-dom": "^18.3.0",
echo     "@vitejs/plugin-react": "^4.3.1",
echo     "typescript": "^5.5.3",
echo     "vite": "^5.4.1"
echo   }
echo }
) > package.json

echo Step 5: Create minimal vite.config.ts...
(
echo import { defineConfig } from 'vite';
echo import react from '@vitejs/plugin-react';
echo.
echo export default defineConfig^({
echo   plugins: [react^(^)],
echo   server: {
echo     port: 8080,
echo     host: true
echo   }
echo }^);
) > vite.config.ts

echo Step 6: Install ONLY core dependencies...
npm install

echo Step 7: Test basic setup...
echo ========================================
echo Testing basic Vite + React setup...
echo ========================================
timeout /t 3
npm run dev

pause