// ✅ SECURITY FIX: Use environment variables instead of hardcoded URLs
// This prevents API URL from being exposed in source code
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// Helper function to build image URLs from backend static folder
export const getImageUrl = (imagePath) => {
  // Absolute URL: return as-is
  if (imagePath?.startsWith('http://') || imagePath?.startsWith('https://')) {
    return imagePath;
  }
  // If server emitted '/images/...' or bare filename, route through API endpoint
  const name = imagePath?.replace(/^\/images\//, '') || '';
  return `${API_BASE_URL}/api/images/${name}`;
};

// Example static images available in your backend
export const STATIC_IMAGES = {
  BLACK_HOODIE: getImageUrl('Black_hoodie.png'),
  CLASSIC_CAP: getImageUrl('Classic_cap.png'),
  GREY_SWEATPANTS: getImageUrl('Grey_sweatpants.png'),
  CORETHREADS_SHOES: getImageUrl('corethreads_shoes.png'),
};
