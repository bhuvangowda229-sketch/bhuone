# Launch the 3D Interior showcase in your default browser
$indexPath = "file:///" + ($PSScriptRoot.Replace('\', '/') + "/index.html")
Write-Host "Opening AI Interior Studio in your browser: $indexPath" -ForegroundColor Green
Start-Process $indexPath
