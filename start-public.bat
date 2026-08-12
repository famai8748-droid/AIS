@echo off
set NGROK="C:\Users\DMI\AppData\Local\Microsoft\WinGet\Packages\Ngrok.Ngrok_Microsoft.Winget.Source_8wekyb3d8bbwe\ngrok.exe"

echo.
echo =====================================================
echo   FindSelf Class (by AIS) - Public Share Mode
echo =====================================================
echo.

netstat -ano | find ":8000" | find "LISTENING" >nul 2>&1
if %errorlevel%==0 (
    echo [1/2] Backend already running on port 8000
) else (
    echo [1/2] Starting backend server...
    start "FindSelf Backend" cmd /k "cd /d d:\AIS && python backend\main.py"
    echo       Waiting for server to start...
    timeout /t 4 /nobreak >nul
)

echo.
echo [2/2] Starting ngrok tunnel...
echo.
echo =====================================================
echo   Copy the Forwarding URL and share with others!
echo   Press Ctrl+C to stop.
echo =====================================================
echo.

%NGROK% http 8000

pause
