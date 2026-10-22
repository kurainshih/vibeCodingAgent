# 2>NUL & @cls & chcp 65001 >NUL & pushd "%~dp0" & powershell.exe -ExecutionPolicy Bypass -NoProfile -Command "Invoke-Command -ScriptBlock ([scriptblock]::Create((Get-Content -LiteralPath '%~f0' -Raw -Encoding UTF8)))" & popd & pause & exit /b

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$ErrorActionPreference = "Continue"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  影片損壞檢測工具 v2.0 (ffprobe 極速掃描)" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan

# 確認改用 ffprobe
if (!(Get-Command ffprobe -ErrorAction SilentlyContinue)) {
    Write-Host "[錯誤] 找不到 ffprobe。請先安裝 ffmpeg 並加入系統 PATH。" -ForegroundColor Red
    return
}

$FAIL = "FAIL"
if (!(Test-Path $FAIL)) {
    New-Item -ItemType Directory -Path $FAIL | Out-Null
}

$exts = '\.(mp4|mkv|avi|mov|flv|wmv|webm|m4v)$'
$files = Get-ChildItem -Path . -File -ErrorAction SilentlyContinue | Where-Object { $_.Extension -match $exts }

if (!$files -or $files.Count -eq 0) {
    Write-Host "目前目錄中沒有找到支援的影片檔案。" -ForegroundColor Yellow
    return
}

$total = 0
$bad = 0

foreach ($file in $files) {
    $total++
    Write-Host ("[{0}/{1}] 檢查中: {2} " -f $total, $files.Count, $file.Name) -NoNewline
    
    # 執行 ffprobe (只讀取影片容器結構與標頭，0.01 秒極速測試)
    # -show_format 與 -show_streams 會促使 ffprobe 讀取必要的 moov atom 或 mkv header
    & ffprobe -v error -show_format -show_streams $file.FullName 2>&1 | Out-Null
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[損壞] -> 移動至 FAIL" -ForegroundColor Red
        Move-Item -Path $file.FullName -Destination $FAIL -Force
        $bad++
    } else {
        Write-Host "[正常]" -ForegroundColor Green
    }
}

Write-Host "========================================" -ForegroundColor Cyan
Write-Host ("掃描完成！總計: {0} | 正常: {1} | 損壞: {2}" -f $total, ($total - $bad), $bad) -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
