#!/usr/bin/env pwsh
<#
.SYNOPSIS
    StreamVerse VOD Transcoder (PowerShell)
.DESCRIPTION
    Transcodes input video to HLS with multiple quality levels (1080p, 720p, 480p, 360p)
.PARAMETER InputFile
    Path to the input video file
.PARAMETER ContentId
    Content ID / output directory name
.PARAMETER Qualities
    Quality presets to encode (comma separated: 1080p,720p,480p,360p)
.PARAMETER SegmentDuration
    HLS segment duration in seconds (default: 4)
.PARAMETER MediaDir
    Media output directory (default: /media)
.PARAMETER Force
    Force re-encode even if output exists
.EXAMPLE
    .\transcode.ps1 -InputFile "movie.mp4" -ContentId "movie-123" -Qualities "1080p,720p,480p"
#>

param(
    [Parameter(Mandatory = $true)]
    [string]$InputFile,

    [Parameter(Mandatory = $true)]
    [string]$ContentId,

    [Parameter(Mandatory = $false)]
    [string]$Qualities = "1080p,720p,480p,360p",

    [Parameter(Mandatory = $false)]
    [int]$SegmentDuration = 4,

    [Parameter(Mandatory = $false)]
    [string]$MediaDir = "/media",

    [Parameter(Mandatory = $false)]
    [switch]$Force
)

$ErrorActionPreference = "Stop"

$qualityPresets = @(
    @{ Label = "1080p"; Width = 1920; Height = 1080; Bitrate = "5000k"; Maxrate = "7500k"; Bufsize = "10000k" }
    @{ Label = "720p";  Width = 1280; Height = 720;  Bitrate = "2800k"; Maxrate = "4200k"; Bufsize = "5600k" }
    @{ Label = "480p";  Width = 854;  Height = 480;  Bitrate = "1400k"; Maxrate = "2100k"; Bufsize = "2800k" }
    @{ Label = "360p";  Width = 640;  Height = 360;  Bitrate = "800k";  Maxrate = "1200k"; Bufsize = "1600k" }
)

function Write-Log {
    param([string]$Message)
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host "[$timestamp] $Message"
}

function Invoke-FFmpeg {
    param([string[]]$Arguments)
    $proc = Start-Process -FilePath "ffmpeg" -ArgumentList $Arguments -Wait -PassThru -NoNewWindow
    if ($proc.ExitCode -ne 0) {
        throw "FFmpeg exited with code $($proc.ExitCode)"
    }
}

# Validate input
if (-not (Test-Path $InputFile)) {
    throw "Input file not found: $InputFile"
}

# Verify ffmpeg is available
$ffmpegPath = Get-Command "ffmpeg" -ErrorAction SilentlyContinue
if (-not $ffmpegPath) {
    throw "FFmpeg not found in PATH. Please install FFmpeg."
}

$outputDir = Join-Path $MediaDir $ContentId
New-Item -ItemType Directory -Path $outputDir -Force | Out-Null

# Filter selected qualities
$selectedLabels = $Qualities.Split(',') | ForEach-Object { $_.Trim() }
$activePresets = $qualityPresets | Where-Object { $_.Label -in $selectedLabels }

if ($activePresets.Count -eq 0) {
    throw "No valid quality presets selected. Choose from: 1080p,720p,480p,360p"
}

Write-Log "Starting transcoding for content: $ContentId"
Write-Log "Input: $InputFile"
Write-Log "Qualities: $($activePresets.Label -join ', ')"
Write-Log "Segment duration: ${SegmentDuration}s"

# Get input info
$probeJson = & ffprobe -v quiet -print_format json -show_format -show_streams $InputFile | ConvertFrom-Json
$videoStream = $probeJson.streams | Where-Object { $_.codec_type -eq "video" } | Select-Object -First 1
$inputFps = if ($videoStream.r_frame_rate) { $videoStream.r_frame_rate } else { "30/1" }

Write-Log "Input codec: $($videoStream.codec_name), FPS: $inputFps"

$variantPlaylistItems = [System.Collections.ArrayList]::new()

foreach ($preset in $activePresets) {
    $qualityDir = Join-Path $outputDir $preset.Label
    New-Item -ItemType Directory -Path $qualityDir -Force | Out-Null

    $playlistPath = Join-Path $qualityDir "index.m3u8"
    $playlistUrl = "$($preset.Label)/index.m3u8"

    if ((Test-Path $playlistPath) -and (-not $Force)) {
        Write-Log "Skipping $($preset.Label) - output already exists (use -Force to re-encode)"
        $null = $variantPlaylistItems.Add(@{
            Url = $playlistUrl
            Bandwidth = [int]($preset.Bitrate -replace 'k', '') * 1000
            Width = $preset.Width
            Height = $preset.Height
        })
        continue
    }

    Write-Log "Encoding $($preset.Label) ($($preset.Width)x$($preset.Height) @ $($preset.Bitrate))..."
    $encodeStart = Get-Date

    $segmentPattern = "$qualityDir/segment_%03d.ts"

    Invoke-FFmpeg @(
        "-y"
        "-i", "$InputFile"
        "-map", "0:v:0"
        "-map", "0:a:0?"
        "-c:v", "libx264"
        "-preset", "medium"
        "-profile:v", "main"
        "-pix_fmt", "yuv420p"
        "-crf", "23"
        "-vf", "scale=w=$($preset.Width):h=$($preset.Height):force_original_aspect_ratio=decrease,pad=$($preset.Width):$($preset.Height):(ow-iw)/2:(oh-ih)/2,fps=$inputFps"
        "-b:v", $preset.Bitrate
        "-maxrate", $preset.Maxrate
        "-bufsize", $preset.Bufsize
        "-c:a", "aac"
        "-b:a", "128k"
        "-ar", "48000"
        "-ac", "2"
        "-f", "hls"
        "-hls_time", $SegmentDuration
        "-hls_list_size", "0"
        "-hls_segment_filename", $segmentPattern
        "-hls_playlist_type", "vod"
        "-hls_flags", "independent_segments+program_date_time"
        "-start_number", "0"
        "$playlistPath"
    )

    $encodeDuration = [math]::Round(((Get-Date) - $encodeStart).TotalSeconds, 0)
    Write-Log "Completed $($preset.Label) encoding in ${encodeDuration}s"

    $null = $variantPlaylistItems.Add(@{
        Url = $playlistUrl
        Bandwidth = [int]($preset.Bitrate -replace 'k', '') * 1000
        Width = $preset.Width
        Height = $preset.Height
    })
}

# Generate master playlist
Write-Log "Generating master playlist..."
$masterPath = Join-Path $outputDir "index.m3u8"
$masterContent = @"
#EXTM3U
#EXT-X-VERSION:6
#-- StreamVerse VOD Master Playlist --
#-- Content ID: $ContentId --
"@

foreach ($item in $variantPlaylistItems) {
    $masterContent += "`n#EXT-X-STREAM-INF:BANDWIDTH=$($item.Bandwidth),RESOLUTION=$($item.Width)x$($item.Height),CODECS=`"avc1.64001f,mp4a.40.2`"`n$($item.Url)"
}

$masterContent | Out-File -FilePath $masterPath -Encoding ASCII

# Generate thumbnail
Write-Log "Generating thumbnail..."
$thumbPath = Join-Path $outputDir "thumbnail.jpg"
try {
    Invoke-FFmpeg @("-y", "-i", "$InputFile", "-vframes", "1", "-vf", "scale=640:-1", "-q:v", "2", "$thumbPath")
} catch {
    Write-Log "Thumbnail generation skipped: $_"
}

Write-Log "Transcoding complete for content: $ContentId"
Write-Log "Output: $masterPath"

Write-Host "`n====================================="
Write-Host "TRANSCODE SUMMARY"
Write-Host "====================================="
Write-Host "Content ID:     $ContentId"
Write-Host "Input:          $InputFile"
Write-Host "Qualities:      $($activePresets.Count) variants"
Write-Host "Segment size:   ${SegmentDuration}s"
Write-Host "Output:         $outputDir"
Write-Host "====================================="
