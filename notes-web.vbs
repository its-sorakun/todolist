Set WshShell = CreateObject("WScript.Shell")
' Run the backend server silently (0 = hide window, False = don't wait)
WshShell.Run "cmd /c cd /d ""d:\codih\notes-web\backend"" && node server.js", 0, False
' Run the Vite frontend server silently
WshShell.Run "cmd /c cd /d ""d:\codih\notes-web"" && npm run dev", 0, False
