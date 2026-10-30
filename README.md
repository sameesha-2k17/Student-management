# Student Management Application

This application consists of a **Django REST Framework** backend and a **React (Vite)** frontend.

## Quick Start (One-Click)

Double-click `run_all.bat` in this folder. It will:
1. Start the Django backend on `http://localhost:8001`
2. Start the React frontend on `http://localhost:5173`
3. Automatically launch your browser at `http://localhost:5173`

---

## Manual Start

### 1. Start the Backend
Open a command prompt / PowerShell window:
```powershell
.\run_backend.bat
```
Or manually:
```powershell
.\venv\Scripts\activate
cd backend
python manage.py runserver 8001
```

### 2. Start the Frontend
Open another command prompt / PowerShell window:
```powershell
.\run_frontend.bat
```
Or manually:
```powershell
cd frontend
npm run dev
```

---

## Default Login Credentials
- **Username:** `admin`
- **Password:** `admin123`

