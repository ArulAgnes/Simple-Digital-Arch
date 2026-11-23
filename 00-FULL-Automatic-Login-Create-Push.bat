@echo off
title 00-FULL-Automatic-Login-Create-Push
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp000-FULL-Automatic-Login-Create-Push.ps1"
if errorlevel 1 pause
