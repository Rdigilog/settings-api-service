export const CONFIG_KEYS = {
  // Server
  PORT: 'port',
  NODE_ENV: 'nodeEnv',

  // JWT
  JWT_SECRET: 'jwt.secret',
  JWT_EXPIRATION_TIME: 'jwt.expirationTime',

  // Database
  DATABASE_URL: 'database.url',
  DATABASE_REPLICA_URL: 'database.replicaUrl',
  AUTO_MIGRATE: 'database.autoMigrate',

  // Redis
  REDIS_URL: 'redis.url',

  // Mail
  MAIL_HOST: 'mail.host',
  MAIL_PORT: 'mail.port',
  MAIL_USER: 'mail.user',
  MAIL_PASS: 'mail.pass',

  // File Upload
  FILE_UPLOAD_PROVIDER: 'fileUpload.provider',

  // AWS S3
  AWS_ACCESS_KEY: 'AWS_ACCESS_KEY',
  AWS_SECRET_ACCESS_KEY: 'AWS_SECRET_ACCESS_KEY',
  AWS_S3_REGION: 'AWS_S3_REGION',
  AWS_S3_BUCKET: 'AWS_S3_BUCKET',
  AWS_S3_UPLOAD_FOLDER: 'AWS_S3_UPLOAD_FOLDER',

  // Cloudinary
  CLOUD_NAME: 'CLOUD_NAME',
  CLOUDINARY_API_KEY: 'CLOUDINARY_API_KEY',
  CLOUDINARY_API_SECRET: 'CLOUDINARY_API_SECRET',
  CLOUDINARY_BASEURL: 'CLOUDINARY_BASEURL',
  CLOUD_UPLOAD_PRESET: 'CLOUD_UPLOAD_PRESET',
} as const;
