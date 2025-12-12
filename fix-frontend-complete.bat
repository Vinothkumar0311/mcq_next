@echo off
echo ========================================
echo COMPLETE FRONTEND FIX - Starting...
echo ========================================

cd frontend

echo Step 1: Removing corrupted files...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
del yarn.lock 2>nul
del bun.lockb 2>nul
del vite.config.js 2>nul

echo Step 2: Clearing npm cache...
npm cache clean --force

echo Step 3: Creating clean vite.config.ts...
echo import { defineConfig } from 'vite'; > vite.config.ts
echo import react from '@vitejs/plugin-react'; >> vite.config.ts
echo import path from 'path'; >> vite.config.ts
echo. >> vite.config.ts
echo export default defineConfig({ >> vite.config.ts
echo   plugins: [react()], >> vite.config.ts
echo   server: { >> vite.config.ts
echo     host: '::', >> vite.config.ts
echo     port: 8080, >> vite.config.ts
echo   }, >> vite.config.ts
echo   resolve: { >> vite.config.ts
echo     alias: { >> vite.config.ts
echo       '@': path.resolve(__dirname, './src'), >> vite.config.ts
echo     }, >> vite.config.ts
echo   }, >> vite.config.ts
echo }); >> vite.config.ts

echo Step 4: Installing core dependencies...
npm install vite@^5.4.1 --save-dev
npm install @vitejs/plugin-react@^4.3.1 --save-dev
npm install react@^18.3.1 react-dom@^18.3.1
npm install typescript@^5.5.3 --save-dev
npm install @types/react@^18.3.3 @types/react-dom@^18.3.0 --save-dev

echo Step 5: Installing remaining dependencies...
npm install

echo Step 6: Testing dev server...
echo ========================================
echo FRONTEND FIX COMPLETE - Testing...
echo ========================================
npm run dev