#!/bin/bash
set -euo pipefail

# ===================================================
# StreamVerse Live Transcoder
# RTMP/RTSP input -> HLS + DASH adaptive streaming
# ===================================================

MEDIA_DIR="${MEDIA_DIR:-/media/live}"
SEGMENT_DURATION="${SEGMENT_DURATION:-4}"
HLS_LIST_SIZE="${HLS_LIST_SIZE:-10}"
THREADS="${THREADS:-auto}"

# Quality presets: [label] [width] [height] [bitrate] [maxrate] [bufsize] [fps]
LIVE_QUALITIES=(
    "1080p:1920:1080:5000k:7500k:10000k:30"
    "720p:1280:720:2800k:4200k:5600k:30"
    "480p:854:480:1400k:2100k:2800k:30"
    "360p:640:360:800k:1200k:1600k:30"
)

usage() {
    echo "Usage: $0 -i <input_url> -o <stream_key> [options]"
    echo ""
    echo "Options:"
    echo "  -i URL        Input stream URL (RTMP/RTSP/HLS) (required)"
    echo "  -o KEY        Stream key / output name (required)"
    echo "  -m MODE       Output mode: hls, dash, both [default: hls]"
    echo "  -q PRESETS    Quality presets (comma separated: 1080p,720p,480p,360p) [default: all]"
    echo "  -s SECONDS    Segment duration [default: ${SEGMENT_DURATION}]"
    echo "  -l SIZE       HLS list size [default: ${HLS_LIST_SIZE}]"
    echo "  -t THREADS    Encoding threads [default: auto]"
    echo "  -d DIR        Media directory [default: ${MEDIA_DIR}]"
    echo "  -r RESOLUTION Single output resolution (disable multi-variant)"
    echo "  -b BITRATE    Single output bitrate (use with -r)"
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

cleanup() {
    log "Shutting down transcoder..."
    if [[ -n "${FFMPEG_PID:-}" ]]; then
        kill "$FFMPEG_PID" 2>/dev/null || true
        wait "$FFMPEG_PID" 2>/dev/null || true
    fi
    log "Transcoder stopped"
    exit 0
}

trap cleanup SIGINT SIGTERM SIGQUIT

# Parse arguments
INPUT_URL=""
STREAM_KEY=""
OUTPUT_MODE="hls"
SELECTED_QUALITIES=""
SINGLE_RES=""
SINGLE_BITRATE=""

while getopts "i:o:m:q:s:l:t:d:r:b:h" opt; do
    case $opt in
        i) INPUT_URL="$OPTARG" ;;
        o) STREAM_KEY="$OPTARG" ;;
        m) OUTPUT_MODE="$OPTARG" ;;
        q) SELECTED_QUALITIES="$OPTARG" ;;
        s) SEGMENT_DURATION="$OPTARG" ;;
        l) HLS_LIST_SIZE="$OPTARG" ;;
        t) THREADS="$OPTARG" ;;
        d) MEDIA_DIR="$OPTARG" ;;
        r) SINGLE_RES="$OPTARG" ;;
        b) SINGLE_BITRATE="$OPTARG" ;;
        h) usage ;;
        *) usage ;;
    esac
done

if [[ -z "$INPUT_URL" || -z "$STREAM_KEY" ]]; then
    usage
fi

OUTPUT_DIR="${MEDIA_DIR}/${STREAM_KEY}"
mkdir -p "$OUTPUT_DIR"

OUTPUT_MODE=$(echo "$OUTPUT_MODE" | tr '[:upper:]' '[:lower:]')
if [[ "$OUTPUT_MODE" != "hls" && "$OUTPUT_MODE" != "dash" && "$OUTPUT_MODE" != "both" ]]; then
    error "Invalid output mode: $OUTPUT_MODE (use: hls, dash, both)"
fi

# Build quality filter
QUALITY_FILTER=()
if [[ -n "$SELECTED_QUALITIES" ]]; then
    IFS=',' read -ra SELECTED <<< "$SELECTED_QUALITIES"
    for preset in "${LIVE_QUALITIES[@]}"; do
        label="${preset%%:*}"
        for sel in "${SELECTED[@]}"; do
            if [[ "$label" == "$sel" ]]; then
                QUALITY_FILTER+=("$preset")
            fi
        done
    done
elif [[ -n "$SINGLE_RES" && -n "$SINGLE_BITRATE" ]]; then
    # Single quality mode
    QUALITY_FILTER=("custom:0:${SINGLE_RES}:${SINGLE_BITRATE}:${SINGLE_BITRATE}:${SINGLE_BITRATE}:30")
else
    QUALITY_FILTER=("${LIVE_QUALITIES[@]}")
fi

log "Starting live transcoding for stream: ${STREAM_KEY}"
log "Input: ${INPUT_URL}"
log "Output mode: ${OUTPUT_MODE}"
log "Qualities: ${#QUALITY_FILTER[@]} variants"
log "Output: ${OUTPUT_DIR}"

# Build FFmpeg filter complex for multi-quality scaling
FILTER_COMPLEX=""
STREAM_MAP=""
VARIANT_PLAYLIST=""

if [[ ${#QUALITY_FILTER[@]} -le 1 ]]; then
    # Single quality - simpler pipeline
    IFS=':' read -r label width height bitrate maxrate bufsize fps <<< "${QUALITY_FILTER[0]}"

    if [[ "$OUTPUT_MODE" == "hls" || "$OUTPUT_MODE" == "both" ]]; then
        HLS_OUTPUT_DIR="${OUTPUT_DIR}/hls"
        mkdir -p "$HLS_OUTPUT_DIR"

        log "Starting single-quality HLS transcoding..."

        ffmpeg -y \
            -threads "$THREADS" \
            -i "$INPUT_URL" \
            -reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 30 \
            -c:v libx264 \
            -preset ultrafast \
            -tune zerolatency \
            -profile:v main \
            -pix_fmt yuv420p \
            -vf "scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2" \
            -b:v "$bitrate" \
            -maxrate "$maxrate" \
            -bufsize "$bufsize" \
            -r "$fps" \
            -g "$((fps * 2))" \
            -keyint_min "$((fps * 2))" \
            -sc_threshold 0 \
            -c:a aac \
            -b:a 128k \
            -ar 48000 \
            -ac 2 \
            -f hls \
            -hls_time "$SEGMENT_DURATION" \
            -hls_list_size "$HLS_LIST_SIZE" \
            -hls_flags delete_segments+independent_segments+program_date_time+append_list \
            -hls_segment_filename "${HLS_OUTPUT_DIR}/segment_%09d.ts" \
            -hls_base_url "" \
            -start_number 0 \
            "${HLS_OUTPUT_DIR}/index.m3u8" &
    fi

    if [[ "$OUTPUT_MODE" == "dash" || "$OUTPUT_MODE" == "both" ]]; then
        DASH_OUTPUT_DIR="${OUTPUT_DIR}/dash"
        mkdir -p "$DASH_OUTPUT_DIR"

        log "Starting single-quality DASH transcoding..."

        ffmpeg -y \
            -threads "$THREADS" \
            -i "$INPUT_URL" \
            -reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 30 \
            -c:v libx264 \
            -preset ultrafast \
            -tune zerolatency \
            -profile:v main \
            -pix_fmt yuv420p \
            -vf "scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2" \
            -b:v "$bitrate" \
            -maxrate "$maxrate" \
            -bufsize "$bufsize" \
            -r "$fps" \
            -g "$((fps * 2))" \
            -keyint_min "$((fps * 2))" \
            -sc_threshold 0 \
            -c:a aac \
            -b:a 128k \
            -ar 48000 \
            -ac 2 \
            -f dash \
            -seg_duration "$SEGMENT_DURATION" \
            -window_size "$HLS_LIST_SIZE" \
            -extra_window_size 10 \
            -use_template 1 \
            -use_timeline 1 \
            -adaptation_sets "id=0,streams=v id=1,streams=a" \
            -index_correction 1 \
            -streaming 1 \
            -utc_timing_url "https://time.akamai.com?iso" \
            "${DASH_OUTPUT_DIR}/manifest.mpd" &
    fi

    FFMPEG_PID=$!
    log "Transcoder PID: ${FFMPEG_PID}"
    wait $FFMPEG_PID

else
    # Multi-quality transcoding
    log "Building multi-variant transcoding pipeline..."

    VARIANTS=""
    MAP_ARGS=""
    FILTER_INPUT="[0:v]"
    FILTER_SPLIT="split=${#QUALITY_FILTER[@]}"
    FILTER_OUTPUTS=""

    # Build split filter
    for i in "${!QUALITY_FILTER[@]}"; do
        if [[ $i -eq 0 ]]; then
            FILTER_SPLIT="${FILTER_INPUT}${FILTER_SPLIT}[v${i}]"
        else
            # Add scale for each variant
            IFS=':' read -r label width height bitrate maxrate bufsize fps <<< "${QUALITY_FILTER[$i]}"
            if [[ $i -gt 1 ]]; then
                FILTER_SPLIT+=";[v0]split=${#QUALITY_FILTER[@]}[v0]"
                for j in $(seq 1 $(( ${#QUALITY_FILTER[@]} - 1 ))); do
                    FILTER_SPLIT+="[v${j}]"
                done
            fi
        fi

        IFS=':' read -r label width height bitrate maxrate bufsize fps <<< "${QUALITY_FILTER[$i]}"
        FILTER_OUTPUTS+="[v${i}]scale=w=${width}:h=${height}:force_original_aspect_ratio=decrease,pad=${width}:${height}:(ow-iw)/2:(oh-ih)/2[v${i}out];"
    done

    FILTER_COMPLEX="${FILTER_SPLIT};${FILTER_OUTPUTS}"

    # Build HLS variant outputs
    if [[ "$OUTPUT_MODE" == "hls" || "$OUTPUT_MODE" == "both" ]]; then
        log "Starting multi-variant HLS transcoding..."

        ffmpeg -y \
            -threads "$THREADS" \
            -i "$INPUT_URL" \
            -reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 30 \
            -filter_complex "$FILTER_COMPLEX" \
            -map 0:a:0 \
            -c:a aac -b:a 128k -ar 48000 -ac 2 \
            $(for i in "${!QUALITY_FILTER[@]}"; do
                IFS=':' read -r label width height bitrate maxrate bufsize fps <<< "${QUALITY_FILTER[$i]}"
                echo -n "-map [v${i}out] -c:v:${i} libx264 -preset:v:${i} ultrafast "
                echo -n "-tune:v:${i} zerolatency -profile:v:${i} main -pix_fmt:v:${i} yuv420p "
                echo -n "-b:v:${i} ${bitrate} -maxrate:v:${i} ${maxrate} -bufsize:v:${i} ${bufsize} "
                echo -n "-r:v:${i} ${fps} -g:v:${i} $((fps * 2)) -keyint_min:v:${i} $((fps * 2)) -sc_threshold:v:${i} 0 "
            done) \
            -f hls \
            -hls_time "$SEGMENT_DURATION" \
            -hls_list_size "$HLS_LIST_SIZE" \
            -hls_flags delete_segments+independent_segments+program_date_time+append_list \
            -hls_segment_filename "${OUTPUT_DIR}/hls/${STREAM_KEY}_%v_segment_%09d.ts" \
            -master_pl_name "index.m3u8" \
            -var_stream_map "$(for i in "${!QUALITY_FILTER[@]}"; do
                IFS=':' read -r label width height bitrate maxrate bufsize fps <<< "${QUALITY_FILTER[$i]}"
                echo -n "v:${i},a:0,name:${label} "
            done)" \
            "${OUTPUT_DIR}/hls/${STREAM_KEY}_%v.m3u8" &
    fi

    if [[ "$OUTPUT_MODE" == "dash" || "$OUTPUT_MODE" == "both" ]]; then
        log "Starting multi-variant DASH transcoding..."

        ffmpeg -y \
            -threads "$THREADS" \
            -i "$INPUT_URL" \
            -reconnect 1 -reconnect_at_eof 1 -reconnect_streamed 1 -reconnect_delay_max 30 \
            -filter_complex "$FILTER_COMPLEX" \
            -map 0:a:0 \
            -c:a aac -b:a 128k -ar 48000 -ac 2 \
            $(for i in "${!QUALITY_FILTER[@]}"; do
                IFS=':' read -r label width height bitrate maxrate bufsize fps <<< "${QUALITY_FILTER[$i]}"
                echo -n "-map [v${i}out] -c:v:${i} libx264 -preset:v:${i} ultrafast "
                echo -n "-tune:v:${i} zerolatency -profile:v:${i} main -pix_fmt:v:${i} yuv420p "
                echo -n "-b:v:${i} ${bitrate} -maxrate:v:${i} ${maxrate} -bufsize:v:${i} ${bufsize} "
                echo -n "-r:v:${i} ${fps} -g:v:${i} $((fps * 2)) -keyint_min:v:${i} $((fps * 2)) -sc_threshold:v:${i} 0 "
            done) \
            -f dash \
            -seg_duration "$SEGMENT_DURATION" \
            -window_size "$HLS_LIST_SIZE" \
            -extra_window_size 10 \
            -use_template 1 \
            -use_timeline 1 \
            -adaptation_sets "id=0,streams=v id=1,streams=a" \
            -index_correction 1 \
            -streaming 1 \
            -utc_timing_url "https://time.akamai.com?iso" \
            "${OUTPUT_DIR}/dash/manifest.mpd" &
    fi

    FFMPEG_PID=$!
    log "Transcoder PID: ${FFMPEG_PID}"
    wait $FFMPEG_PID
fi

cleanup
