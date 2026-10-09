Set WshShell = CreateObject("WScript.Shell")
' Instantly start MongoDB (or just wait for it if it's already starting)
WshShell.Run "cmd /c net start MongoDB", 0, True
' Run backend and frontend completely invisibly (the 0 means hide window)
WshShell.Run "cmd /c cd /d d:\codih\notes-web\backend && node server.js", 0, False
WshShell.Run "cmd /c cd /d d:\codih\notes-web && npm run dev -- --port 3002", 0, False
