@echo off
echo ===================================================
echo  Starting Student Management Application...
echo ===================================================
echo.
cd /d "%~dp0"

echo Starting Backend on http://localhost:8001...
start "Backend - Django Server" run_backend.bat

echo Starting Frontend on http://localhost:5173...
start "Frontend - Vite Dev Server" run_frontend.bat

echo.
echo Waiting 3 seconds for servers to initialize...
ping 127.0.0.1 -n 4 >nul

echo Opening application in browser...
start http://localhost:5173

echo.
echo ===================================================
echo  Both servers have been launched!
echo  Backend:  http://localhost:8001
echo  Frontend: http://localhost:5173
echo.
echo  Default Login:
echo    Username: admin
echo    Password: admin123
echo ===================================================
