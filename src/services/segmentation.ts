// Read SelfieSegmentation from global window since it is loaded via CDN script tag to prevent Vite bundle issues
const SelfieSegmentation = (window as any).SelfieSegmentation;

let segmentationInstance: any = null;
let activeResolve: ((canvas: HTMLCanvasElement) => void) | null = null;
let activeReject: ((err: any) => void) | null = null;
let activeImage: HTMLImageElement | null = null;

const getSegmentationInstance = (): any => {
  if (!segmentationInstance) {
    segmentationInstance = new SelfieSegmentation({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    segmentationInstance.setOptions({
      modelSelection: 0, // Default to general
    });

    segmentationInstance.onResults((results: any) => {
      if (!activeResolve || !activeImage) return;

      try {
        const canvas = document.createElement('canvas');
        canvas.width = activeImage.naturalWidth;
        canvas.height = activeImage.naturalHeight;
        const ctx = canvas.getContext('2d');

        if (!ctx) {
          activeReject?.(new Error('Gagal mendapatkan konteks kanvas 2D'));
          return;
        }

        // Create an offscreen canvas to process the raw segmentation mask
        const rawMaskCanvas = document.createElement('canvas');
        rawMaskCanvas.width = canvas.width;
        rawMaskCanvas.height = canvas.height;
        const rawMaskCtx = rawMaskCanvas.getContext('2d');

        if (!rawMaskCtx) {
          activeReject?.(new Error('Gagal mendapatkan konteks kanvas mask'));
          return;
        }

        // Draw the raw segmentation mask
        rawMaskCtx.drawImage(results.segmentationMask, 0, 0, canvas.width, canvas.height);

        // Get mask pixel data to refine boundaries (hair details + shirt edges)
        const maskImgData = rawMaskCtx.getImageData(0, 0, canvas.width, canvas.height);
        const maskData = maskImgData.data;

        // Apply thresholding & midtone boosting
        for (let i = 0; i < maskData.length; i += 4) {
          // Read probability from all color/alpha channels to be cross-platform compatible
          const p = Math.max(maskData[i], maskData[i+1], maskData[i+2], maskData[i+3]) / 255;

          let newP;
          if (p < 0.12) {
            newP = 0; // Cut off low-confidence background bleed (cleans up hair edges)
          } else if (p > 0.6) {
            newP = 255; // Solidify foreground (restores clothing and solid hair parts)
          } else {
            // Concave curve to boost midtone probabilities (prevents shirt from being cut off)
            const t = (p - 0.12) / 0.48;
            newP = Math.round(Math.pow(t, 0.6) * 255);
          }

          maskData[i] = newP;
          maskData[i+1] = newP;
          maskData[i+2] = newP;
          maskData[i+3] = newP;
        }

        // Apply Morphological closing/opening approximation to clean up mask noise
        const width = canvas.width;
        const height = canvas.height;
        
        // 1. Closing pass (fill small holes/noise inside subject)
        for (let y = 2; y < height - 2; y += 2) {
          for (let x = 2; x < width - 2; x += 2) {
            const idx = (y * width + x) * 4;
            if (maskData[idx] === 0) {
              let solidNeighbors = 0;
              // Check 5x5 neighborhood with stride 2 for efficiency on large images
              for (let dy = -2; dy <= 2; dy += 2) {
                for (let dx = -2; dx <= 2; dx += 2) {
                  const nIdx = ((y + dy) * width + (x + dx)) * 4;
                  if (maskData[nIdx] > 128) solidNeighbors++;
                }
              }
              if (solidNeighbors >= 5) {
                // Fill pixel
                for (let fy = 0; fy < 2; fy++) {
                  for (let fx = 0; fx < 2; fx++) {
                    const fidx = ((y + fy) * width + (x + fx)) * 4;
                    if (fidx < maskData.length) {
                      maskData[fidx] = 255;
                      maskData[fidx+1] = 255;
                      maskData[fidx+2] = 255;
                      maskData[fidx+3] = 255;
                    }
                  }
                }
              }
            }
          }
        }

        rawMaskCtx.putImageData(maskImgData, 0, 0);

        // Draw original image
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);

        // Apply segmentation mask
        ctx.globalCompositeOperation = 'destination-in';

        // Apply 3px blur filter to feather the mask edges (perfect 2-5px soft edge feathering)
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');
        if (tempCtx) {
          tempCtx.filter = 'blur(3px)';
          tempCtx.drawImage(rawMaskCanvas, 0, 0);
          ctx.drawImage(tempCanvas, 0, 0);
        } else {
          ctx.drawImage(rawMaskCanvas, 0, 0);
        }

        // Reset composite operation to default
        ctx.globalCompositeOperation = 'source-over';

        activeResolve(canvas);
      } catch (err) {
        activeReject?.(err);
      } finally {
        activeResolve = null;
        activeReject = null;
        activeImage = null;
      }
    });
  }
  return segmentationInstance;
};

// Queue variable to run segmentation sequentially and avoid concurrency collision on singleton
let processingQueue = Promise.resolve();

const runBgSegmentationSingle = (img: HTMLImageElement, qualityMode: 'fast' | 'better' = 'better'): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    try {
      const model = getSegmentationInstance();
      // Set the dynamic quality mode: 1 is landscape (fast), 0 is general (better)
      model.setOptions({
        modelSelection: qualityMode === 'fast' ? 1 : 0
      });
      activeResolve = resolve;
      activeReject = reject;
      activeImage = img;
      
      model.send({ image: img }).catch((err: any) => {
        reject(err);
        activeResolve = null;
        activeReject = null;
        activeImage = null;
      });
    } catch (err) {
      reject(err);
    }
  });
};

/**
 * Runs background segmentation on an HTMLImageElement and returns a canvas with isolated subject
 */
export const runBgSegmentation = (img: HTMLImageElement, qualityMode: 'fast' | 'better' = 'better'): Promise<HTMLCanvasElement> => {
  return new Promise((resolve, reject) => {
    processingQueue = processingQueue.then(async () => {
      try {
        const res = await runBgSegmentationSingle(img, qualityMode);
        resolve(res);
      } catch (err) {
        reject(err);
      }
    });
  });
};

/**
 * Returns raw transparent canvas mask along with bounding box info of the person
 */
export const getSegmentationMaskDetails = (
  maskCanvas: HTMLCanvasElement
): { x: number; y: number; width: number; height: number } => {
  const ctx = maskCanvas.getContext('2d');
  if (!ctx) {
    return { x: 0, y: 0, width: maskCanvas.width, height: maskCanvas.height };
  }

  const imgData = ctx.getImageData(0, 0, maskCanvas.width, maskCanvas.height);
  const data = imgData.data;

  let minX = maskCanvas.width;
  let maxX = 0;
  let minY = maskCanvas.height;
  let maxY = 0;
  let found = false;

  // Scan alpha channel to find bounding box of non-transparent subject pixels
  for (let y = 0; y < maskCanvas.height; y++) {
    for (let x = 0; x < maskCanvas.width; x++) {
      const index = (y * maskCanvas.width + x) * 4;
      const alpha = data[index + 3];

      if (alpha > 30) { // threshold for subject presence
        if (x < minX) minX = x;
        if (x > maxX) maxX = x;
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
        found = true;
      }
    }
  }

  if (!found) {
    return { x: 0, y: 0, width: maskCanvas.width, height: maskCanvas.height };
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
};
