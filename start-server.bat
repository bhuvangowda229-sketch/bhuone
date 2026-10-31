@echo off
title AI Interior Studio Web Server
echo Starting AI Interior Studio server...
powershell -ExecutionPolicy Bypass -File "%~dp0start-server.ps1"
pause
