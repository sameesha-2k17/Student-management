@echo off
echo ==============================================
echo  Starting Vite Frontend Server (Port 5173)...
echo ==============================================
cd /d "%~dp0\frontend"
npm run dev
pause

