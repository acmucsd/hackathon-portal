const BYTES_PER_KILOBYTE = 1024;

const env = process.env.NODE_ENV || 'development';
const isDevelopment = env !== 'production';

export const Config = {
  port: Number(process.env.PORT) || 4000,

  isDevelopment,

  database: {
    host: process.env.RDS_HOST,
    port: Number(process.env.RDS_PORT),
    name: process.env.RDS_DATABASE,
    user: process.env.RDS_USER,
    pass: process.env.RDS_PASSWORD,
  },

  firebase: {
    apiKey: process.env.API_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET,
    messagingSenderId: process.env.MESSAGING_SENDER_ID,
    appId: process.env.APP_ID,
    measurementId: process.env.MEASUREMENT_ID,
  },

  s3: {
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY_ID!,
      secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
    },
    bucket: process.env.S3_BUCKET,
  },

  file: {
    MAX_RESUME_FILE_SIZE:
      Number(process.env.MAX_RESUME_FILE_SIZE) * BYTES_PER_KILOBYTE,
    RESUME_UPLOAD_PATH:
      process.env.BASE_UPLOAD_PATH! + process.env.RESUME_UPLOAD_PATH!,
  },
};
