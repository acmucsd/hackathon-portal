import { config } from 'dotenv';

config();

const env = process.env.NODE_ENV || 'development';
const isDevelopment = env !== 'production';

export const Config = {
  port: Number(process.env.PORT) || 3000,

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
};
