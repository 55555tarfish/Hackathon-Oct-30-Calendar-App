@echo off
title DayPlan Calendar App
cd /d "%~dp0"
echo ==========================================
echo Starting DayPlan Calendar App...
echo ==========================================
echo Once loaded, open your browser at:
echo http://localhost:3000
echo ==========================================
call npm.cmd run dev
pause
