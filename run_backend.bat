@echo off
echo ==============================================
echo  Starting Django Backend Server (Port 8001)...
echo ==============================================
cd /d "%~dp0"
call "venv\Scripts\activate.bat"
cd backend
python manage.py runserver 8001
pause

