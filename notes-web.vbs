Set WshShell = CreateObject("WScript.Shell")
' Run the npm dev server silently (0 = hide window, False = don't wait for completion)
WshShell.Run "cmd /c cd /d ""d:\codih\notes-web"" && npm run dev", 0, False
