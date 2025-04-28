import dotenv from 'dotenv';
dotenv.config();

const BASE_SERVER_URL_DEV = process.env.BASE_SERVER_URL_DEV || 'http://localhost:';
const PORT = process.env.PORT || '8765';

export const BASE_URL: string = `${BASE_SERVER_URL_DEV}${PORT}`;