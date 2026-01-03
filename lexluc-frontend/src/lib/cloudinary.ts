/**
 * Cloudinary integration for image uploads and delivery
 */

const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

if (!CLOUDINARY_CLOUD_NAME) {
  console.warn(
    'Missing NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME environment variable. Image uploads will not work.'
  );
}

/**
 * Upload an image to Cloudinary via backend
 * IMPORTANT: All uploads go through the backend to avoid CORS issues and rate limiting
 * @param file - The file to upload
 * @param type - Upload type: 'service', 'tour', 'blog', or 'image'
 * @returns Promise with the secure URL of the uploaded image
 */
export async function uploadToCloudinary(
  file: File,
  type: 'service' | 'tour' | 'blog' | 'image' = 'image'
): Promise<string> {
  const formData = new FormData();
  formData.append('file', file);

  const token = typeof window !== 'undefined' ? localStorage.getItem('authToken') : '';

  try {
    const response = await fetch(`${API_URL}/uploads/${type}`, {
      method: 'POST',
      body: formData,
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.message || 'Upload failed');
    }

    const data = await response.json();
    return data.data.secure_url;
  } catch (error) {
    console.error('Image upload error:', error);
    throw error;
  }
}

/**
 * Optimize image URL for web delivery
 * @param url - The Cloudinary URL
 * @param width - Desired width
 * @param height - Desired height
 * @param quality - Quality (1-100)
 * @returns Optimized URL
 */
export function optimizeImageUrl(
  url: string,
  width?: number,
  height?: number,
  quality: number = 80
): string {
  if (!url) return '';

  // If it's not a Cloudinary URL, return as-is
  if (!url.includes('cloudinary.com')) {
    return url;
  }

  // Extract the base URL and version
  const parts = url.split('/upload/');
  if (parts.length !== 2) return url;

  const baseUrl = parts[0];
  const path = parts[1];

  // Build transformation parameters
  const transformations = [];
  
  if (width || height) {
    const dim = [];
    if (width) dim.push(`w_${width}`);
    if (height) dim.push(`h_${height}`);
    transformations.push(dim.join(','));
  }

  if (quality) {
    transformations.push(`q_${quality}`);
  }

  // Add auto format for best compression
  transformations.push('f_auto');

  const transform = transformations.length > 0 ? `/${transformations.join('/')}` : '';
  return `${baseUrl}/upload${transform}/${path}`;
}

/**
 * Delete an image from Cloudinary
 * @param publicId - The public ID of the image to delete
 */
export async function deleteFromCloudinary(publicId: string): Promise<void> {
  // This would typically be done from the backend for security
  // Frontend deletion is not recommended as it requires API key exposure
  console.warn('Image deletion should be handled from the backend');
}

/**
 * Get image thumbnail URL
 */
export function getThumbnailUrl(url: string, width: number = 150): string {
  return optimizeImageUrl(url, width, width, 60);
}
