// src/config/app-config.ts
import packageJson from '../../package.json' assert { type: 'json' };

export const AppConfig = {
  APP_NAME: packageJson.name,
  APP_VERSION: packageJson.version,
  APP_ENV: import.meta.env.MODE ?? 'development',
  // API_URL: import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api'
 API_URL: import.meta.env.VITE_API_URL ?? 'https://servidor-ryib.onrender.com/api'
 
};
