const API_BASE = import.meta.env.PROD
  ? 'https://fitagent-production-480e.up.railway.app'
  : (import.meta.env.VITE_API_URL || 'http://localhost:8000');

export default API_BASE;
