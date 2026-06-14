export default () => ({
  app: {
    port: parseInt(process.env.APP_PORT, 10) || 3000,
    name: process.env.APP_NAME || 'StreamVerse',
    env: process.env.NODE_ENV || 'development',
  },
  database: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE || 'streamverse',
  },
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT, 10) || 6379,
    password: process.env.REDIS_PASSWORD,
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    accessExpiration: process.env.JWT_ACCESS_EXPIRATION || '15m',
    refreshExpiration: process.env.JWT_REFRESH_EXPIRATION || '7d',
  },
  streaming: {
    serverUrl: process.env.STREAMING_SERVER_URL || 'http://localhost:3000',
    hlsSegmentDuration: parseInt(process.env.HLS_SEGMENT_DURATION, 10) || 6,
    hlsPlaylistSize: parseInt(process.env.HLS_PLAYLIST_SIZE, 10) || 10,
  },
  upload: {
    dest: process.env.UPLOAD_DEST || './uploads',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 10485760,
  },
  throttle: {
    ttl: parseInt(process.env.THROTTLE_TTL, 10) || 60,
    limit: parseInt(process.env.THROTTLE_LIMIT, 10) || 100,
  },
});
