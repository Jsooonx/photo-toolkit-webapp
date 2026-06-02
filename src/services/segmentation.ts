// Read SelfieSegmentation from global window since it is loaded via CDN script tag to prevent Vite bundle issues
interface SegmentationResults {
  image: CanvasImageSource;
  segmentationMask: CanvasImageSource;
}

interface SegmentationModel {
  setOptions: (options: { modelSelection: number }) => void;
  onResults: (callback: (results: SegmentationResults) => void) => void;
  send: (input: { image: HTMLImageElement }) => Promise<void>;
}

interface SelfieSegmentationConstructor {
  new (options: { locateFile: (file: string) => string }): SegmentationModel;
}

interface ColorSample {
  r: number;
  g: number;
  b: number;
  count: number;
}

const SelfieSegmentation = (window as unknown as Window & {
  SelfieSegmentation: SelfieSegmentationConstructor;
}).SelfieSegmentation;

let segmentationInstance: SegmentationModel | null = null;
let activeResolve: ((canvas: HTMLCanvasElement) => void) | null = null;
let activeReject: ((err: unknown) => void) | null = null;
let activeImage: HTMLImageElement | null = null;
let activeQualityMode: 'fast' | 'better' = 'better';

const clampByte = (value: number): number => Math.max(0, Math.min(255, Math.round(value)));

const smoothstep = (edge0: number, edge1: number, value: number): number => {
  const t = Math.max(0, Math.min(1, (value - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
};

const colorDistance = (
  r1: number,
  g1: number,
  b1: number,
  r2: number,
  g2: number,
  b2: number
): number => {
  const dr = r1 - r2;
  const dg = g1 - g2;
  const db = b1 - b2;

  return Math.sqrt(dr * dr * 0.5 + dg * dg * 0.8 + db * db * 0.45);
};

const isYellowBackgroundFringe = (r: number, g: number, b: number): boolean => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max - min;
  const yellowBias = (r + g) / 2 - b;

  return r > 130 && g > 105 && b < 135 && saturation > 45 && yellowBias > 45 && Math.abs(r - g) < 95;
};

const isLikelySubjectColor = (r: number, g: number, b: number): boolean => {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const saturation = max - min;
  const skin = r > 92 && g > 48 && b > 34 && r > b * 1.12 && r >= g * 0.92 && r - b > 24;
  const darkHair = max < 92 && saturation > 8;
  const brownHair = r > 42 && r < 155 && g > 24 && g < 128 && b < 112 && r >= g * 0.88 && g >= b * 0.72;

  return skin || darkHair || brownHair;
};

const boxBlurAlpha = (
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
): Uint8ClampedArray => {
  if (radius <= 0) return alpha;

  const blurred = new Uint8ClampedArray(alpha.length);
  const diameter = radius * 2 + 1;

  for (let y = 0; y < height; y++) {
    let sum = 0;

    for (let x = -radius; x <= radius; x++) {
      const sampleX = Math.max(0, Math.min(width - 1, x));
      sum += alpha[y * width + sampleX];
    }

    for (let x = 0; x < width; x++) {
      blurred[y * width + x] = Math.round(sum / diameter);

      const removeX = Math.max(0, x - radius);
      const addX = Math.min(width - 1, x + radius + 1);
      sum += alpha[y * width + addX] - alpha[y * width + removeX];
    }
  }

  const result = new Uint8ClampedArray(alpha.length);

  for (let x = 0; x < width; x++) {
    let sum = 0;

    for (let y = -radius; y <= radius; y++) {
      const sampleY = Math.max(0, Math.min(height - 1, y));
      sum += blurred[sampleY * width + x];
    }

    for (let y = 0; y < height; y++) {
      result[y * width + x] = Math.round(sum / diameter);

      const removeY = Math.max(0, y - radius);
      const addY = Math.min(height - 1, y + radius + 1);
      sum += blurred[addY * width + x] - blurred[removeY * width + x];
    }
  }

  return result;
};

const sampleLocalBackgroundColor = (
  original: Uint8ClampedArray,
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  radius: number
): ColorSample | null => {
  let r = 0;
  let g = 0;
  let b = 0;
  let count = 0;

  for (let dy = -radius; dy <= radius; dy++) {
    const ny = y + dy;
    if (ny < 0 || ny >= height) continue;

    for (let dx = -radius; dx <= radius; dx++) {
      const nx = x + dx;
      if (nx < 0 || nx >= width) continue;

      const neighbor = ny * width + nx;
      if (alpha[neighbor] > 16) continue;

      const neighborDataIdx = neighbor * 4;
      r += original[neighborDataIdx];
      g += original[neighborDataIdx + 1];
      b += original[neighborDataIdx + 2];
      count++;
    }
  }

  if (count < 4) {
    return null;
  }

  return { r: r / count, g: g / count, b: b / count, count };
};

const sampleCleanForegroundColor = (
  original: Uint8ClampedArray,
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  x: number,
  y: number,
  radius: number,
  background: ColorSample | null
): ColorSample | null => {
  let r = 0;
  let g = 0;
  let b = 0;
  let weightTotal = 0;
  let count = 0;

  for (let dy = -radius; dy <= radius; dy++) {
    const ny = y + dy;
    if (ny < 0 || ny >= height) continue;

    for (let dx = -radius; dx <= radius; dx++) {
      const nx = x + dx;
      if (nx < 0 || nx >= width) continue;

      const distance = Math.abs(dx) + Math.abs(dy);
      if (distance === 0) continue;

      const neighbor = ny * width + nx;
      const neighborAlpha = alpha[neighbor];
      if (neighborAlpha < 238) continue;

      const neighborDataIdx = neighbor * 4;
      const nr = original[neighborDataIdx];
      const ng = original[neighborDataIdx + 1];
      const nb = original[neighborDataIdx + 2];
      const looksLikeBackground = background
        ? colorDistance(nr, ng, nb, background.r, background.g, background.b) < 48
        : false;

      if (looksLikeBackground || isYellowBackgroundFringe(nr, ng, nb)) {
        continue;
      }

      const weight = (neighborAlpha / 255) / (1 + distance);
      r += nr * weight;
      g += ng * weight;
      b += nb * weight;
      weightTotal += weight;
      count++;
    }
  }

  if (weightTotal === 0 || count < 2) {
    return null;
  }

  return { r: r / weightTotal, g: g / weightTotal, b: b / weightTotal, count };
};

const erodeAlpha = (
  alpha: Uint8ClampedArray,
  width: number,
  height: number,
  radius: number
): Uint8ClampedArray => {
  const result = new Uint8ClampedArray(alpha.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let minAlpha = 255;

      for (let dy = -radius; dy <= radius; dy++) {
        const ny = y + dy;
        if (ny < 0 || ny >= height) continue;

        for (let dx = -radius; dx <= radius; dx++) {
          const nx = x + dx;
          if (nx < 0 || nx >= width) continue;

          minAlpha = Math.min(minAlpha, alpha[ny * width + nx]);
        }
      }

      result[y * width + x] = minAlpha;
    }
  }

  return result;
};

const refineSegmentationAlpha = (
  maskData: Uint8ClampedArray,
  width: number,
  height: number,
  qualityMode: 'fast' | 'better'
): Uint8ClampedArray => {
  const alpha = new Uint8ClampedArray(width * height);
  const lowCut = qualityMode === 'fast' ? 0.28 : 0.34;
  const highCut = qualityMode === 'fast' ? 0.72 : 0.7;

  for (let i = 0, p = 0; i < maskData.length; i += 4, p++) {
    const probability = Math.max(maskData[i], maskData[i + 1], maskData[i + 2], maskData[i + 3]) / 255;
    const matte = smoothstep(lowCut, highCut, probability);
    alpha[p] = probability >= highCut ? 255 : probability <= lowCut ? 0 : clampByte(matte * 255);
  }

  const cleaned = new Uint8ClampedArray(alpha);

  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      let solidNeighbors = 0;
      let clearNeighbors = 0;

      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const value = alpha[(y + dy) * width + x + dx];
          if (value > 180) solidNeighbors++;
          if (value < 24) clearNeighbors++;
        }
      }

      if (alpha[idx] < 96 && solidNeighbors >= 7) {
        cleaned[idx] = 255;
      } else if (alpha[idx] < 160 && clearNeighbors >= 6) {
        cleaned[idx] = 0;
      }
    }
  }

  const tucked = erodeAlpha(cleaned, width, height, 1);
  const softlyFeathered = boxBlurAlpha(tucked, width, height, 1);

  for (let i = 0; i < softlyFeathered.length; i++) {
    const value = softlyFeathered[i];
    if (value < 30) {
      softlyFeathered[i] = 0;
    } else if (value > 244) {
      softlyFeathered[i] = 255;
    } else {
      softlyFeathered[i] = clampByte((value - 24) * 1.12);
    }
  }

  return softlyFeathered;
};

const applyCleanMatteToImage = (
  image: CanvasImageSource,
  alpha: Uint8ClampedArray,
  width: number,
  height: number
): HTMLCanvasElement => {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Gagal mendapatkan konteks kanvas 2D');
  }

  ctx.drawImage(image, 0, 0, width, height);
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  const original = new Uint8ClampedArray(data);
  const transparentMap = new Uint8ClampedArray(alpha.length);

  for (let i = 0; i < alpha.length; i++) {
    transparentMap[i] = alpha[i] < 32 ? 255 : 0;
  }

  const transparentProximity = boxBlurAlpha(transparentMap, width, height, 5);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const pixel = y * width + x;
      const dataIdx = pixel * 4;
      const sourceR = original[dataIdx];
      const sourceG = original[dataIdx + 1];
      const sourceB = original[dataIdx + 2];
      const nearCutoutEdge = alpha[pixel] < 250 || (alpha[pixel] > 0 && transparentProximity[pixel] > 0);
      const localBackground = nearCutoutEdge
        ? sampleLocalBackgroundColor(original, alpha, width, height, x, y, 9)
        : null;
      const backgroundDistance = localBackground
        ? colorDistance(sourceR, sourceG, sourceB, localBackground.r, localBackground.g, localBackground.b)
        : Number.POSITIVE_INFINITY;
      const yellowFringe = nearCutoutEdge
        && isYellowBackgroundFringe(sourceR, sourceG, sourceB)
        && (!localBackground || backgroundDistance < 92);
      const adaptiveBackgroundFringe = nearCutoutEdge
        && localBackground !== null
        && backgroundDistance < (alpha[pixel] > 228 ? 36 : 54)
        && !isLikelySubjectColor(sourceR, sourceG, sourceB);
      const backgroundFringe = yellowFringe || adaptiveBackgroundFringe;
      const a = backgroundFringe
        ? backgroundDistance < 30 || yellowFringe
          ? 0
          : Math.min(alpha[pixel], 88)
        : alpha[pixel];

      if (a === 0) {
        data[dataIdx] = 0;
        data[dataIdx + 1] = 0;
        data[dataIdx + 2] = 0;
        data[dataIdx + 3] = 0;
        continue;
      }

      data[dataIdx + 3] = a;

      if (a < 248 || backgroundFringe) {
        const replacement = sampleCleanForegroundColor(
          original,
          alpha,
          width,
          height,
          x,
          y,
          backgroundFringe ? 10 : 7,
          localBackground
        );

        if (replacement) {
          const mix = backgroundFringe ? 1 : a < 180 ? 0.94 : 0.68;
          data[dataIdx] = clampByte(data[dataIdx] * (1 - mix) + replacement.r * mix);
          data[dataIdx + 1] = clampByte(data[dataIdx + 1] * (1 - mix) + replacement.g * mix);
          data[dataIdx + 2] = clampByte(data[dataIdx + 2] * (1 - mix) + replacement.b * mix);
        } else if (backgroundFringe) {
          data[dataIdx] = 0;
          data[dataIdx + 1] = 0;
          data[dataIdx + 2] = 0;
          data[dataIdx + 3] = 0;
        }
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas;
};

const getSegmentationInstance = (): SegmentationModel => {
  if (!segmentationInstance) {
    segmentationInstance = new SelfieSegmentation({
      locateFile: (file: string) => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation/${file}`,
    });

    segmentationInstance.setOptions({
      modelSelection: 0, // Default to general
    });

    segmentationInstance.onResults((results) => {
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
        const width = canvas.width;
        const height = canvas.height;

        const alpha = refineSegmentationAlpha(maskData, width, height, activeQualityMode);

        for (let i = 0, p = 0; i < maskData.length; i += 4, p++) {
          const value = alpha[p];
          maskData[i] = value;
          maskData[i + 1] = value;
          maskData[i + 2] = value;
          maskData[i + 3] = value;
        }

        rawMaskCtx.putImageData(maskImgData, 0, 0);
        const cleanCanvas = applyCleanMatteToImage(results.image, alpha, width, height);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(cleanCanvas, 0, 0);

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
      activeQualityMode = qualityMode;
      
      model.send({ image: img }).catch((err: unknown) => {
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
