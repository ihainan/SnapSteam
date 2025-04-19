$steamPath = "C:\Program Files (x86)\Steam"
$userId = "118555538"
$gameId = "2407270"
$screenshotsPath = Join-Path $steamPath "userdata\$userId\760\remote\$gameId\screenshots"
$vdfPath = Join-Path $steamPath "userdata\$userId\760\remote\$gameId\screenshots.vdf"

# 获取所有截图文件
$screenshots = Get-ChildItem -Path $screenshotsPath -Filter "*.jpg"

# 创建新的 VDF 内容
$vdfContent = '"screenshots"`n{'

foreach ($screenshot in $screenshots) {
    $id = $screenshot.Name.Split('_')[0]
    $timestamp = [int64]((Get-Date $screenshot.LastWriteTime) - (Get-Date "1970-01-01")).TotalSeconds
    
    $vdfContent += "`n`t`"$id`"`n`t{"
    $vdfContent += "`n`t`t`"type`"`t`t`"1`""
    $vdfContent += "`n`t`t`"filename`"`t`t`"$($screenshot.Name)`""
    $vdfContent += "`n`t`t`"thumbnail`"`t`t`"$($screenshot.Name)`""
    $vdfContent += "`n`t`t`"vrfilename`"`t`t`"`""
    $vdfContent += "`n`t`t`"imported`"`t`t`"1`""
    $vdfContent += "`n`t`t`"width`"`t`t`"1920`""
    $vdfContent += "`n`t`t`"height`"`t`t`"1080`""
    $vdfContent += "`n`t`t`"gameid`"`t`t`"$gameId`""
    $vdfContent += "`n`t`t`"creation`"`t`t`"$timestamp`""
    $vdfContent += "`n`t`t`"caption`"`t`t`"`""
    $vdfContent += "`n`t`t`"Permissions`"`t`t`"2`""
    $vdfContent += "`n`t`t`"hscreenshot`"`t`t`"0`""
    $vdfContent += "`n`t}"
}

$vdfContent += "`n}"

# 写入新的 VDF 文件
Set-Content -Path $vdfPath -Value $vdfContent

Write-Host "screenshots.vdf 文件已成功修复！" 