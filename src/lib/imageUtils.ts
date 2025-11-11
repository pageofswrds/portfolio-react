// Utility for handling large image data to avoid webpack serialization issues
export function createImageDataUrl(buffer: Buffer, mimeType: string = 'image/jpeg'): string {
  const base64 = buffer.toString('base64');
  return `data:${mimeType};base64,${base64}`;
}

export function decodeImageDataUrl(dataUrl: string): { buffer: Buffer; mimeType: string } {
  const [header, data] = dataUrl.split(',');
  const mimeType = header.match(/data:([^;]+)/)?.[1] || 'image/jpeg';
  const buffer = Buffer.from(data, 'base64');
  return { buffer, mimeType };
}

// For storing image data in a more webpack-cache-friendly way
export function optimizeImageForBuild(imageUrl: string): string {
  // If it's already an external URL, return as-is
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // For data URLs or base64, you might want to:
  // 1. Extract and store them externally
  // 2. Use a hash-based approach
  // 3. Convert to external URLs

  return imageUrl;
}

// Check if an image should skip Vercel's Image Optimization
export function shouldSkipOptimization(src: string): boolean {
  if (!src) return false;

  // Skip optimization for S3 images and other external storage
  return (
    src.includes('s3.us-west-1.amazonaws.com') ||
    src.includes('amazonaws.com') ||
    src.includes('vercel-storage.com')
  );
}
