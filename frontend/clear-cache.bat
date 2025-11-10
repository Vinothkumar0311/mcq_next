@echo off
echo Clearing Vite cache and node_modules...
rmdir /s /q node_modules 2>nul
rmdir /s /q .vite 2>nul
del package-lock.json 2>nul
echo Installing dependencies...
npm install
echo Done! Now run: npm run dev