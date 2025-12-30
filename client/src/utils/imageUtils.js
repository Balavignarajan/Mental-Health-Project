/**
 * Normalize image URL to ensure it's a valid absolute URL
 * @param {string} imageUrl - The image URL from the database
 * @param {string|any} fallbackImage - Fallback image to use if imageUrl is invalid (can be Vite asset reference)
 * @returns {string|any} - Normalized image URL or fallback
 */
export const getImageUrl = (imageUrl, fallbackImage = null) => {
  // If no imageUrl provided, return fallback as-is (don't transform Vite asset references)
  if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim() === '') {
    return fallbackImage;
  }

  const trimmedUrl = imageUrl.trim();

  // If it's already a full URL (starts with http:// or https://), use it as-is
  if (trimmedUrl.startsWith('http://') || trimmedUrl.startsWith('https://')) {
    return trimmedUrl;
  }

  // Get the server base URL (remove /api from API base URL)
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';
  const serverBaseUrl = apiBaseUrl.replace('/api', '').replace(/\/$/, ''); // Remove trailing slash if present

  // If it's a relative URL starting with /uploads/ or just /, convert to absolute
  // But don't convert paths that look like Vite assets (starting with /src/ or /assets/)
  if (trimmedUrl.startsWith('/uploads/')) {
    return `${serverBaseUrl}${trimmedUrl}`;
  }
  
  // If it starts with / but not /uploads/, it might be a Vite asset or other server path
  // Only convert if it's clearly a server upload path, otherwise return as-is
  if (trimmedUrl.startsWith('/')) {
    // Don't transform Vite asset paths
    if (trimmedUrl.startsWith('/src/') || trimmedUrl.startsWith('/assets/') || trimmedUrl.startsWith('/node_modules/')) {
      return trimmedUrl;
    }
    return `${serverBaseUrl}${trimmedUrl}`;
  }

  // Otherwise, treat it as just a filename and prepend /uploads/
  return `${serverBaseUrl}/uploads/${trimmedUrl}`;
};

