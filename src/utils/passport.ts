import type { PassportOptions } from '../types';

export const PASSPORT_PRESETS = {
  '2x3': { width: 236, height: 354, ratio: 2 / 3, label: '2 x 3 cm (DPI 300)' },
  '3x4': { width: 354, height: 472, ratio: 3 / 4, label: '3 x 4 cm (DPI 300)' },
  '4x6': { width: 472, height: 709, ratio: 4 / 6, label: '4 x 6 cm (DPI 300)' },
};

export const generatePassportPhoto = (
  originalImg: HTMLImageElement,
  segmentedCanvas: HTMLCanvasElement | null,
  options: PassportOptions,
  maskDetails?: { x: number; y: number; width: number; height: number }
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  
  if (!ctx) {
    throw new Error('Gagal menginisialisasi canvas 2D');
  }

  const preset = PASSPORT_PRESETS[options.size];
  canvas.width = preset.width;
  canvas.height = preset.height;

  // 1. Draw background color if it is not transparent
  if (options.backgroundColor !== 'transparent') {
    ctx.fillStyle = options.backgroundColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  } else {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  // Choose source image: use segmented cutout if background color is set, or original image if transparent/no cutout
  // But wait, if they change the background, we MUST draw the segmented cutout, otherwise the original background remains!
  const hasBgColor = options.backgroundColor !== 'transparent';
  const sourceImg: any = (hasBgColor && segmentedCanvas) ? segmentedCanvas : originalImg;

  // 2. Crop math
  let sx = 0, sy = 0, sWidth = originalImg.naturalWidth, sHeight = originalImg.naturalHeight;

  if (options.autoCenter && maskDetails && maskDetails.width > 0 && maskDetails.height > 0) {
    // Subject center X
    const cx = maskDetails.x + maskDetails.width / 2;
    // Subject top Y (top of the head)
    const headTop = maskDetails.y;

    // Determine crop dimensions based on the subject's height with a configurable margin
    // cropMargin is 0-50, default is 15. Greater margin means zoomed out (larger crop rectangle).
    const multiplier = 1.25 + (options.cropMargin / 50); // e.g. 15 -> 1.55
    const cropHeight = Math.min(originalImg.naturalHeight, maskDetails.height * multiplier);
    const cropWidth = cropHeight * preset.ratio;

    sx = cx - cropWidth / 2;
    // Place head top ~18% down from the crop box's top edge
    sy = headTop - (cropHeight * 0.18);

    sWidth = cropWidth;
    sHeight = cropHeight;

    // Handle out of bounds by clamping, or let canvas draw outside
    // Drawing outside is actually fine because it leaves the background color visible where the image is missing, 
    // which looks like proper studio padding if the photo was cropped too high!
  } else {
    // Default center crop matching aspect ratio
    const imgRatio = originalImg.naturalWidth / originalImg.naturalHeight;
    if (imgRatio > preset.ratio) {
      // Image is wider than preset, crop sides
      sHeight = originalImg.naturalHeight;
      sWidth = sHeight * preset.ratio;
      sx = (originalImg.naturalWidth - sWidth) / 2;
      sy = 0;
    } else {
      // Image is taller than preset, crop top/bottom
      sWidth = originalImg.naturalWidth;
      sHeight = sWidth / preset.ratio;
      sx = 0;
      sy = (originalImg.naturalHeight - sHeight) / 2;
    }
  }

  // Draw the image onto target canvas
  ctx.drawImage(
    sourceImg,
    sx, sy, sWidth, sHeight, // Source crop
    0, 0, canvas.width, canvas.height // Destination fit
  );

  return canvas;
};
export default generatePassportPhoto;
