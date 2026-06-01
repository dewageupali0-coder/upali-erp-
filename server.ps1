$root = $PSScriptRoot
$port = 3000
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$port/")
$listener.Start()
Write-Host "Serving at http://localhost:$port/"

$mime = @{ '.html'='text/html'; '.css'='text/css'; '.js'='application/javascript'; '.png'='image/png'; '.jpg'='image/jpeg'; '.svg'='image/svg+xml'; '.json'='application/json'; '.ico'='image/x-icon' }

while ($true) {
    $ctx = $listener.GetContext()
    $path = $ctx.Request.Url.LocalPath
    if ($path -eq '/') { $path = '/index.html' }
    $file = Join-Path $root ($path -replace '/', '\')
    $resp = $ctx.Response
    if (Test-Path $file) {
        $ext = [IO.Path]::GetExtension($file)
        $resp.ContentType = if ($mime[$ext]) { $mime[$ext] } else { 'application/octet-stream' }
        $bytes = [IO.File]::ReadAllBytes($file)
        $resp.ContentLength64 = $bytes.Length
        $resp.OutputStream.Write($bytes, 0, $bytes.Length)
    } else {
        $resp.StatusCode = 404
        $b = [Text.Encoding]::UTF8.GetBytes('Not Found')
        $resp.OutputStream.Write($b, 0, $b.Length)
    }
    $resp.Close()
}
