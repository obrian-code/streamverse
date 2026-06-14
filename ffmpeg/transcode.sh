#!/bin/bash
set -euo pipefail

# ===================================================
# StreamVerse VOD Transcoder
# Transcodes input video to HLS with multiple qualities
# ===================================================

MEDIA_DIR="${MEDIA_DIR:-/media}"
SEGMENT_DURATION="${SEGMENT_DURATION:-4}"
HLS_LIST_SIZE="${HLS_LIST_SIZE:-0}"
THREADS="${THREADS:-auto}"

# Quality presets: [label] [width] [height] [bitrate] [maxrate] [bufsize]
QUALITY_PRESETS=(
    "1080p:1920:1080:5000k:7500k:10000k"
    "720p:1280:720:2800k:4200k:5600k"
    "480p:854:480:1400k:2100k:2800k"
    "360p:640:360:800k:1200k:1600k"
)

usage() {
    echo "Usage: $0 -i <input_file> -o <content_id> [options]"
    echo ""
    echo "Options:"
    echo "  -i FILE       Input video file (required)"
    echo "  -o ID         Content ID / output directory name (required)"
    echo "  -q PRESETS    Quality presets (comma separated: 1080p,720p,480p,360p) [default: all]"
    echo "  -s SECONDS    Segment duration [default: ${SEGMENT_DURATION}]"
    echo "  -t THREADS    Encoding threads [default: auto]"
    echo "  -d DIR        Media directory [default: ${MEDIA_DIR}]"
    echo "  -f            Force re-encode even if output exists"
    echo "  -h            Show this help"
    exit 1
}

log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $*"
}

error() {
    echo "[ERROR] $*" >&2
    exit 1
}

# Parse arguments
INPUT_FILE=""
CONTENT_ID=""
SELECTED_QUALITIES=""
FORCE=false

while getopts "i:o:q:s:t:d:fh" opt; do
    case $opt in
        i) INPUT_FILE="$OPTARG" ;;
        o) CONTENT_ID="$OPTARG" ;;
        q) SELECTED_QUALITIES="$OPTARG" ;;
        s) SEGMENT_DURATION="$OPTARG" ;;
        t) THREADS="$OPTARG" ;;
        d) MEDIA_DIR="$OPTARG" ;;
        f) FORCE=true ;;
        h) usage ;;
        *) usage ;;
    esac
done

# Validate required args
if [[ -z "$INPUT_FILE" || -z "$CONTENT_ID" ]]; then
    usage
fi

if [[ ! -f "$INPUT_FILE" ]]; then
    error "Input file not found: $INPUT_FILE"
fi

OUTPUT_DIR="${MEDIA_DIR}/${CONTENT_ID}"
mkdir -p "$OUTPUT_DIR"

# Build quality filter
QUALITY_FILTER=()
if [[ -n "$SELECTED_QUALITIES" ]]; then
    IFS=',' read -ra SELECTED <<< "$SELECTED_QUALITIES"
    for preset in "${QUALITY_PRESETS[@]}"; do
        label="${preset%%:*}"
        for sel in "${SELECTED[@]}"; do
            if [[ "$label" == "$sel" ]]; then
                QUALITY_FILTER+=("$preset")
            fi
        done
    done
else
    QUALITY_FILTER=("${QUALITY_PRESETS[@]}")
fi

if [[ ${#QUALITY_FILTER[@]} -eq 0 ]]; then
    error "No valid quality presets selected"
fi

log "Starting transcoding for content: ${CONTENT_ID}"
log "Input: ${INPUT_FILE}"
log "Output: ${OUTPUT_DIR}"
log "Qualities: ${QUALITY_FILTER[*]}"
log "Segment duration: ${SEGMENT_DURATION}s"

# Get input video info
INPUT_INFO=$(ffprobe -v quiet -print_format json -show_format -show_streams "$INPUT_FILE")
INPUT_CODEC=$(echo "$INPUT_INFO" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['streams'][0]['codec_name'])" 2>/dev/null || echo "unknown")
INPUT_FPS=$(echo "$INPUT_INFO" | python3 -c "import sys,json; d=json.load(sys.stdin); print(d['streams'][0].get('r_frame_rate','30/1'))" 2>/dev/null || echo "30/1")
AUDIO_CODEC=$(echo "$INPUT_INFO" | python3 -c "import sys,json; d=json.load(sys.stdin); print(next(s['codec_name'] for s in d['streams'] if s['codec_type']=='audio'))" 2>/dev/null || echo "aac")

log "Input codec: ${INPUT_CODEC}, FPS: ${INPUT_FPS}"

# Generate variant stream map
STREAM_MAP=""
VARIANT_PLAYLIST=""

for preset in "${QUALITY_FILTER[@]}"; do
    IFS=':' read -r label width height bitrate maxrate bufsize <<< "$preset"

    QUALITY_DIR="${OUTPUT_DIR}/${label}"
    mkdir -p "$QUALITY_DIR"

    PLAYLIST_URL="${label}/index.m3u8"

    if [[ -f "${QUALITY_DIR}/index.m3u8" ]] && [[ "$FORCE" == false ]]; then
        log "Skipping ${label} - output already exists (use -f to force)"
        VARIANT_PLAYLIST+="#EXT-X-STREAM-INF:BANDWIDTH=${bitrate%k}000,RESOLUTION=${width}x${height},CODECS=\"avc1.64001f,mp4a.40.2\"\n${PLAYLIST_URL}\n"
        continue
    fi

    log "Encoding ${label} (${width}x${height} @ ${bitrate})..."

    ENCODE_START=$(date +%s)

    ffmpeg -y \
        -i "$INPUT_FILE" \
        -threads "$THREADS" \
        -map 0:v:0 -map 0:a:0? \
        -c:v libx264 \
        -preset medium \
        -profile:v main \
        -pix_fmt yuv420p \
        -crf 23 \
        -vf "scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2,fps=${INPUT_FPS}" \
        -b:v "$bitrate" \
        -maxrate "$maxrate" \
        -bufsize "$bufsize" \
        -c:a aac \
        -b:a 128k \
        -ar 48000 \
        -ac 2 \
        -f hls \
        -hls_time "$SEGMENT_DURATION" \
        -hls_list_size "$HLS_LIST_SIZE" \
        -hls_segment_filename "${QUALITY_DIR}/segment_%03d.ts" \
        -hls_playlist_type vod \
        -hls_flags independent_segments+program_date_time \
        -start_number 0 \
        "${QUALITY_DIR}/index.m3u8"

    ENCODE_END=$(date +%s)
    DURATION=$((ENCODE_END - ENCODE_START))
    log "Completed ${label} encoding in ${DURATION}s"

    VARIANT_PLAYLIST+="#EXT-X-STREAM-INF:BANDWIDTH=${bitrate%k}000,RESOLUTION=${width}x${height},CODECS=\"avc1.64001f,mp4a.40.2\"\n${PLAYLIST_URL}\n"
done

# Generate master playlist
log "Generating master playlist..."
MASTER_PLAYLIST="#EXTM3U\n#EXT-X-VERSION:6\n#-- StreamVerse VOD Master Playlist --\n#-- Content ID: ${CONTENT_ID} --\n${VARIANT_PLAYLIST}"

echo -e "$MASTER_PLAYLIST" > "${OUTPUT_DIR}/index.m3u8"

# Generate thumbnail
log "Generating thumbnail..."
ffmpeg -y \
    -i "$INPUT_FILE" \
    -vframes 1 \
    -vf "scale=640:-1" \
    -q:v 2 \
    "${OUTPUT_DIR}/thumbnail.jpg" 2>/dev/null || log "Thumbnail generation skipped"

log "Transcoding complete for content: ${CONTENT_ID}"
log "Output: ${OUTPUT_DIR}/index.m3u8"

# Print summary
echo ""
echo "====================================="
echo "TRANSCODE SUMMARY"
echo "====================================="
echo "Content ID:     ${CONTENT_ID}"
echo "Input:          ${INPUT_FILE}"
echo "Qualities:      ${#QUALITY_FILTER[@]} variants"
echo "Segment size:   ${SEGMENT_DURATION}s"
echo "Output:         ${OUTPUT_DIR}"
echo "====================================="
