import type { ResizeOptions } from '../types';

/**
 * Helper to load an image element from an Object URL
 */
export const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = (e) => reject(new Error('Gagal memuat gambar: ' + e));
    img.src = url;
  });
};

/**
 * Resizes an image onto a Canvas based on ResizeOptions
 */
export const resizeImage = (
  img: HTMLImageElement,
  options: ResizeOptions
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Gagal menginisialisasi canvas 2D');
  }

  let targetWidth = img.naturalWidth;
  let targetHeight = img.naturalHeight;

  if (options.mode === 'percentage') {
    const scale = options.percentage / 100;
    targetWidth = Math.round(img.naturalWidth * scale);
    targetHeight = Math.round(img.naturalHeight * scale);
  } else {
    // Custom width and height
    targetWidth = options.width;
    targetHeight = options.height;

    if (options.lockAspectRatio) {
      const originalRatio = img.naturalWidth / img.naturalHeight;

      if (options.width !== img.naturalWidth && options.height === img.naturalHeight) {
        // Width changed, update height
        targetHeight = Math.round(targetWidth / originalRatio);
      } else if (options.height !== img.naturalHeight && options.width === img.naturalWidth) {
        // Height changed, update width
        targetWidth = Math.round(targetHeight * originalRatio);
      } else {
        // Both custom, lock based on width change first
        targetHeight = Math.round(targetWidth / originalRatio);
      }
    }
  }

  // Ensure width/height are at least 1px
  canvas.width = Math.max(1, targetWidth);
  canvas.height = Math.max(1, targetHeight);

  // Clear and draw
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

  return canvas;
};

/**
 * Converts a Canvas to a specific MIME format and returns a Blob
 */
export const convertCanvasToBlob = (
  canvas: HTMLCanvasElement,
  format: 'jpg' | 'png' | 'webp',
  quality = 0.92
): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    let mimeType = 'image/png';
    if (format === 'jpg') mimeType = 'image/jpeg';
    if (format === 'webp') mimeType = 'image/webp';

    canvas.toBlob(
      (blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Gagal mengekspor kanvas ke blob'));
        }
      },
      mimeType,
      mimeType === 'image/png' ? undefined : quality
    );
  });
};

/**
 * Quick compress operation
 */
export const compressCanvas = async (
  canvas: HTMLCanvasElement,
  qualityPercentage: number,
  originalType: string
): Promise<Blob> => {
  // Compress as jpeg if it is jpeg/png/webp
  // quality is between 1-100, convert to 0-1
  const q = qualityPercentage / 100;
  
  // Decide target format for compression
  // If original is png, compress to jpeg or webp because png is lossless and doesn't support quality adjustments in canvas.toBlob.
  // We can compress png as WebP (supported) or JPEG. Let's match original type unless png. If png, use webp or jpeg.
  let format: 'jpg' | 'webp' | 'png' = 'webp';
  if (originalType === 'image/jpeg' || originalType === 'image/jpg') {
    format = 'jpg';
  } else if (originalType === 'image/webp') {
    format = 'webp';
  }

  return convertCanvasToBlob(canvas, format, q);
};
