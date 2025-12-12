@echo off
echo ========================================
echo MANUAL FRONTEND FIX
echo ========================================

cd frontend

echo Step 1: Backup and replace package.json...
copy package.json package.json.backup
copy package-clean.json package.json

echo Step 2: Remove all corrupted files...
if exist node_modules rmdir /s /q node_modules
if exist package-lock.json del package-lock.json
if exist yarn.lock del yarn.lock
if exist bun.lockb del bun.lockb

echo Step 3: Clear npm cache...
npm cache clean --force

echo Step 4: Create proper vite.config.ts...
(
echo import { defineConfig } from 'vite';
echo import react from '@vitejs/plugin-react';
echo import path from 'path';
echo.
echo export default defineConfig^(^{
echo   plugins: [react^(^)],
echo   server: {
echo     host: '::',
echo     port: 8080,
echo   },
echo   resolve: {
echo     alias: {
echo       '@': path.resolve^(__dirname, './src'^),
echo     },
echo   },
echo }^);
) > vite.config.ts

echo Step 5: Install dependencies...
npm install

echo Step 6: Test the server...
echo ========================================
echo Testing dev server...
echo ========================================
npm run dev

pause