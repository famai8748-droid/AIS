# FindSelf Class - Start with Public ngrok URL
# Run this script to share your app with others via the internet

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  FindSelf Class (by AIS) - Public Share Mode" -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Refresh PATH so ngrok is found
$env:Path = [System.Environment]::GetEnvironmentVariable("Path","Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path","User")

# Check if backend server is already running on port 8000
$portInUse = netstat -ano | Select-String ":8000 " | Select-String "LISTENING"
if (-not $portInUse) {
    Write-Host "[1/2] Starting FindSelf Class backend server..." -ForegroundColor Yellow
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'd:\AIS'; python backend\main.py" -WindowStyle Normal
    Write-Host "      Backend starting at http://localhost:8000" -ForegroundColor Green
    Write-Host "      Waiting 3 seconds for server to start..." -ForegroundColor Gray
    Start-Sleep -Seconds 3
} else {
    Write-Host "[1/2] Backend server already running on port 8000 ✓" -ForegroundColor Green
}

Write-Host ""
Write-Host "[2/2] Opening ngrok tunnel to port 8000..." -ForegroundColor Yellow
Write-Host "      (Your public URL will appear below)" -ForegroundColor Gray
Write-Host ""
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host "  Copy the 'Forwarding' URL and share it with others!" -ForegroundColor Green
Write-Host "  Press Ctrl+C to stop the tunnel when done." -ForegroundColor Yellow
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host ""

# Start ngrok tunnel
ngrok http 8000
