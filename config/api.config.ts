// API Configuration
// Ganti dengan IP address server backend Anda

export const API_CONFIG = {
  // Development - ganti dengan IP computer yang menjalankan backend
  BASE_URL: "http://192.168.1.28:3000",

  // Atau gunakan IP address untuk testing di device fisik
  // BASE_URL: 'http://localhost:3000', // Ganti dengan IP Anda

  // Production
  // BASE_URL: 'https://your-production-url.com',

  // Timeouts
  TIMEOUT: 10000,

  // WebSocket
  WS_RECONNECT_DELAY: 1000,
  WS_MAX_RECONNECT_ATTEMPTS: 5,
};

export default API_CONFIG;
