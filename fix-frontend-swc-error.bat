@echo off
echo Fixing SWC native binding error...

cd frontend

echo Removing node_modules and package-lock.json...
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul

echo Installing dependencies with regular React plugin...
npm install

echo Frontend SWC error fixed!
echo You can now run: npm run dev
pause