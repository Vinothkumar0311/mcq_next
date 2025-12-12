@echo off
echo Fixing Vite SWC error...

cd frontend

echo Step 1: Removing problematic packages...
npm uninstall @vitejs/plugin-react-swc @swc/core --save-dev

echo Step 2: Installing correct React plugin...
npm install @vitejs/plugin-react --save-dev

echo Step 3: Clearing npm cache...
npm cache clean --force

echo Step 4: Starting development server...
npm run dev

pause