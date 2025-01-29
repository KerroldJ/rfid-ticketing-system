@echo off

:: Set base directory for the project
set BASE_DIR=%USERPROFILE%\Desktop\Private Files\Coding System Projects\TFCI Ticket System - RFID\rfid-ticketing-system


echo Starting Django backend and React frontend in the same CMD window...

:: Start Django backend
echo Starting Django Backend Server on http://127.0.0.1:8000
cd %BASE_DIR%\backend
start /B python manage.py runserver

:: Start React frontend
echo Starting React Frontend on http://localhost:3000
cd %BASE_DIR%\rfid_ticketing_system
start /B set PORT=3000 && npm start

:: Keep the CMD window open
echo Both servers have been started. Backend is running on http://127.0.0.1:8000 and frontend on http://localhost:3000.
pause
