# Deploy helper for Hostinger (PowerShell)
# Usage: edit the variables below and run this script to zip and (optionally) SCP upload the site.

$distPath = Join-Path -Path $PSScriptRoot -ChildPath "..\dist\morpho-crm-web\browser"
$zipPath = Join-Path -Path $PSScriptRoot -ChildPath "..\site.zip"

# Create zip
if (Test-Path $zipPath) { Remove-Item $zipPath }
Compress-Archive -Path (Join-Path $distPath "*") -DestinationPath $zipPath -Force
Write-Host "Created $zipPath"

# Uncomment and fill these values to upload via SCP (requires SSH access)
# $remoteUser = 'username'
# $remoteHost = 'your.host.ip.or.domain'
# $remotePath = '/home/username/public_html/'
# scp $zipPath "$remoteUser@$remoteHost:$remotePath"
# After uploading, ssh into host and unzip:
# ssh $remoteUser@$remoteHost
# cd /home/username/public_html
# unzip site.zip

Write-Host "Zip done. Use File Manager (Hostinger) or FTP to upload and extract 'site.zip' in public_html." 

# run in powershell: powershell -NoProfile -ExecutionPolicy Bypass -File .\scripts\deploy-hostinger.ps1