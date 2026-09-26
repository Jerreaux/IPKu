export const API_BASE = import.meta.env.VITE_API_URL || 
  (window.location.hostname.includes('vercel.app') 
    ? 'http://localhost:3001' // Fallback to localhost for Vercel laptop testing if VITE_API_URL is missing
    : `http://${window.location.hostname}:3001`);
