import React, { useState, useEffect } from 'react';
import { useImageStore } from '../store/imageStore';
import { getTranslation, formatBytes, getSavingPercentage } from '../constants/translations';
import { seoContent } from '../constants/seoContent';
import { UploadZone } from '../components/UploadZone';
import { FileQueue } from '../components/FileQueue';
import { ImageSlider } from '../components/ImageSlider';
import { ToolConfigurator } from '../components/ToolConfigurator';
import { 
  loadImage, 
  resizeImage, 
  convertCanvasToBlob, 
  compressCanvas 
} from '../utils/imageProcessors';
import { generatePassportPhoto } from '../utils/passport';
import { runBgSegmentation, getSegmentationMaskDetails } from '../services/segmentation';
import { downloadBlob, downloadFilesAsZip } from '../utils/zip';
import { toast } from 'sonner';
import { 
  Download, 
  FolderDown, 
  ImageIcon, 
  RefreshCw,
  Info
} from 'lucide-react';
import { ManualMaskEditor } from '../components/ManualMaskEditor';
import { motion, AnimatePresence } from 'framer-motion';

// Import template assets for background changer
import officeBgAsset from '../assets/office_bg.png';
import corporateBgAsset from '../assets/corporate_bg.png';

export const Dashboard: React.FC = () => {
  const { 
    files, 
    selectedFileId, 
    activeTool, 
    theme, 
    settings,
    resizeOptions,
    convertOptions,
    compressOptions,
    passportOptions,
    bgRemoverOptions,
    updateFile,
    updateFileProgress
  } = useImageStore();

  const t = getTranslation(settings.language);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  // Sync metadata for SEO dynamically
  useEffect(() => {
    const lang = settings.language;
    const currentSeo = seoContent[lang]?.[activeTool];
    if (currentSeo) {
      document.title = currentSeo.title;
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) {
        metaDescription.setAttribute('content', currentSeo.metaDesc);
      }

      const ogTitle = document.querySelector('meta[property="og:title"]');
      if (ogTitle) ogTitle.setAttribute('content', currentSeo.title);
      
      const ogDesc = document.querySelector('meta[property="og:description"]');
      if (ogDesc) ogDesc.setAttribute('content', currentSeo.metaDesc);

      const twTitle = document.querySelector('meta[property="twitter:title"]');
      if (twTitle) twTitle.setAttribute('content', currentSeo.title);

      const twDesc = document.querySelector('meta[property="twitter:description"]');
      if (twDesc) twDesc.setAttribute('content', currentSeo.metaDesc);
    }
  }, [activeTool, settings.language]);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleSaveManualMask = async (maskDataUrl: string) => {
    if (!selectedFileId) return;
    updateFile(selectedFileId, { manualMaskDataUrl: maskDataUrl });
    setIsManualEditing(false);

    setIsProcessing(true);
    await processSingleFile(selectedFileId);
    setIsProcessing(false);
  };

  // Find currently selected file details
  const selectedFile = files.find(f => f.id === selectedFileId);

  // Main runner to process a SINGLE file
  const processSingleFile = async (fileId: string): Promise<{ blob: Blob; filename: string } | null> => {
    const fileItem = files.find(f => f.id === fileId);
    if (!fileItem) return null;

    updateFile(fileId, { status: 'processing', progress: 10 });

    try {
      // 1. Load image onto canvas
      const img = await loadImage(fileItem.originalUrl);
      updateFileProgress(fileId, 30);

      let outputCanvas: HTMLCanvasElement;
      let outputBlob: Blob;
      let outputExt = 'png';

      // 2. Select operation
      switch (activeTool) {
        case 'resize': {
          outputCanvas = resizeImage(img, resizeOptions);
          updateFileProgress(fileId, 70);
          outputExt = convertOptions.format;
          outputBlob = await convertCanvasToBlob(outputCanvas, convertOptions.format);
          break;
        }

        case 'convert': {
          // Draw standard canvas
          outputCanvas = document.createElement('canvas');
          outputCanvas.width = img.naturalWidth;
          outputCanvas.height = img.naturalHeight;
          const ctx = outputCanvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          updateFileProgress(fileId, 70);
          outputExt = convertOptions.format;
          outputBlob = await convertCanvasToBlob(outputCanvas, convertOptions.format);
          break;
        }

        case 'compress': {
          // Draw standard canvas
          outputCanvas = document.createElement('canvas');
          outputCanvas.width = img.naturalWidth;
          outputCanvas.height = img.naturalHeight;
          const ctx = outputCanvas.getContext('2d');
          ctx?.drawImage(img, 0, 0);

          updateFileProgress(fileId, 60);
          outputBlob = await compressCanvas(outputCanvas, compressOptions.quality, fileItem.type);
          
          // Extension matches compressed type
          outputExt = outputBlob.type.split('/')[1] === 'jpeg' ? 'jpg' : outputBlob.type.split('/')[1];
          break;
        }

        case 'passport': {
          let segCanvas: HTMLCanvasElement | null = null;
          let maskDetails;

          if (passportOptions.autoCenter) {
            updateFileProgress(fileId, 45);
            if (fileItem.manualMaskDataUrl) {
              const maskImg = await loadImage(fileItem.manualMaskDataUrl);
              segCanvas = document.createElement('canvas');
              segCanvas.width = img.naturalWidth;
              segCanvas.height = img.naturalHeight;
              const sCtx = segCanvas.getContext('2d');
              if (sCtx) {
                sCtx.drawImage(img, 0, 0);
                sCtx.globalCompositeOperation = 'destination-in';
                sCtx.drawImage(maskImg, 0, 0, segCanvas.width, segCanvas.height);
                sCtx.globalCompositeOperation = 'source-over';
              }
            } else {
              segCanvas = await runBgSegmentation(img, passportOptions.qualityMode);
            }
            maskDetails = getSegmentationMaskDetails(segCanvas);
          }

          updateFileProgress(fileId, 70);
          outputCanvas = generatePassportPhoto(img, segCanvas, passportOptions, maskDetails);
          outputExt = 'jpg'; // standard photo export format
          outputBlob = await convertCanvasToBlob(outputCanvas, 'jpg', 0.95);
          break;
        }

        case 'bg-remover': {
          updateFileProgress(fileId, 45);
          let foregroundCanvas: HTMLCanvasElement;

          if (fileItem.manualMaskDataUrl) {
            const maskImg = await loadImage(fileItem.manualMaskDataUrl);
            foregroundCanvas = document.createElement('canvas');
            foregroundCanvas.width = img.naturalWidth;
            foregroundCanvas.height = img.naturalHeight;
            const sCtx = foregroundCanvas.getContext('2d');
            if (sCtx) {
              sCtx.drawImage(img, 0, 0);
              sCtx.globalCompositeOperation = 'destination-in';
              sCtx.drawImage(maskImg, 0, 0, foregroundCanvas.width, foregroundCanvas.height);
              sCtx.globalCompositeOperation = 'source-over';
            }
          } else {
            foregroundCanvas = await runBgSegmentation(img, bgRemoverOptions.qualityMode);
          }
          updateFileProgress(fileId, 70);

          // Create base canvas
          outputCanvas = document.createElement('canvas');
          outputCanvas.width = img.naturalWidth;
          outputCanvas.height = img.naturalHeight;
          const ctx = outputCanvas.getContext('2d');

          if (!ctx) {
            throw new Error('Failed to load 2D canvas context');
          }

          const bgPref = bgRemoverOptions.backgroundColor;

          // 1. Draw backgrounds
          if (bgPref === 'transparent') {
            ctx.clearRect(0, 0, outputCanvas.width, outputCanvas.height);
            outputExt = 'png'; // transparent must be PNG
          } else if (bgPref === 'studio-white') {
            const grad = ctx.createRadialGradient(
              outputCanvas.width / 2, outputCanvas.height / 2, 10,
              outputCanvas.width / 2, outputCanvas.height / 2, outputCanvas.height
            );
            grad.addColorStop(0, '#ffffff');
            grad.addColorStop(1, '#cbd5e1'); // light slate
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
            outputExt = 'jpg';
          } else if (bgPref === 'studio-gray') {
            const grad = ctx.createRadialGradient(
              outputCanvas.width / 2, outputCanvas.height / 2, 10,
              outputCanvas.width / 2, outputCanvas.height / 2, outputCanvas.height
            );
            grad.addColorStop(0, '#94a3b8');
            grad.addColorStop(1, '#334155'); // slate gray
            ctx.fillStyle = grad;
            ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
            outputExt = 'jpg';
          } else if (bgPref === 'office' || bgPref === 'corporate') {
            const assetPath = bgPref === 'office' ? officeBgAsset : corporateBgAsset;
            try {
              const bgImgElement = await loadImage(assetPath);
              ctx.drawImage(bgImgElement, 0, 0, outputCanvas.width, outputCanvas.height);
            } catch {
              // Fallback solid fill if load fails
              ctx.fillStyle = '#1e293b';
              ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
            }
            outputExt = 'jpg';
          } else {
            // Solid color
            ctx.fillStyle = bgPref;
            ctx.fillRect(0, 0, outputCanvas.width, outputCanvas.height);
            outputExt = 'jpg';
          }

          // 2. Draw foreground subject on top
          ctx.drawImage(foregroundCanvas, 0, 0);
          outputBlob = await convertCanvasToBlob(outputCanvas, outputExt === 'png' ? 'png' : 'jpg', 0.9);
          break;
        }

        default:
          throw new Error('Unsupported active tool operation.');
      }

      // 3. Save output files info
      const processedUrl = URL.createObjectURL(outputBlob);
      updateFile(fileId, {
        processedUrl,
        processedSize: outputBlob.size,
        processedWidth: outputCanvas.width,
        processedHeight: outputCanvas.height,
        status: 'done',
        progress: 100
      });

      return { blob: outputBlob, filename: `${fileItem.name.substring(0, fileItem.name.lastIndexOf('.'))}_edited.${outputExt}` };
    } catch (err: any) {
      updateFile(fileId, { status: 'error', errorMessage: err.message || 'Processing failed' });
      toast.error(`Error processing ${fileItem.name}: ${err.message || err}`);
      return null;
    }
  };

  // Process selected file or multiple depending on scope
  const handleProcess = async () => {
    if (files.length === 0) {
      toast.error('No images uploaded yet.');
      return;
    }

    setIsProcessing(true);
    const results: { blob: Blob; filename: string }[] = [];

    // Prompt user choice or process all by default (batch feature)
    // If there is only 1 file, process that. If multiple, process all sequentially
    const processPromises = files.map(f => async () => {
      const res = await processSingleFile(f.id);
      if (res) results.push(res);
    });

    toast.info(`Processing ${files.length} images client-side...`);

    // Run promises sequentially to maintain performance, especially for AI background segmentations
    for (const processFn of processPromises) {
      await processFn();
    }

    setIsProcessing(false);
    toast.success('Processing completed!');
  };

  const handleDownloadSelected = () => {
    if (!selectedFile || selectedFile.status !== 'done' || !selectedFile.processedUrl) {
      toast.error('Please process the image first.');
      return;
    }

    // Extract file extensions
    const originalName = selectedFile.name;
    const dotIndex = originalName.lastIndexOf('.');
    const baseName = dotIndex !== -1 ? originalName.substring(0, dotIndex) : originalName;
    
    // We can infer extension from the size or options. Or standard WebP/PNG/JPG based on tool
    let ext = 'png';
    if (activeTool === 'passport') ext = 'jpg';
    else if (activeTool === 'resize' || activeTool === 'convert') ext = convertOptions.format;
    else if (activeTool === 'compress') ext = selectedFile.type === 'image/jpeg' ? 'jpg' : 'webp';

    const filename = `${baseName}_edited.${ext}`;
    
    // Fetch blob from URL to trigger download
    fetch(selectedFile.processedUrl)
      .then(res => res.blob())
      .then(blob => {
        downloadBlob(blob, filename);
        toast.success('Image downloaded successfully!');
      })
      .catch(() => toast.error('Failed to download image.'));
  };

  const handleDownloadZipAll = async () => {
    const processedFiles = files.filter(f => f.status === 'done' && f.processedUrl);
    if (processedFiles.length === 0) {
      toast.error('No processed images available.');
      return;
    }

    toast.loading('Preparing ZIP compression...');
    const fileBlobs: { blob: Blob; filename: string }[] = [];

    try {
      const fetchPromises = processedFiles.map(async (file) => {
        const res = await fetch(file.processedUrl!);
        const blob = await res.blob();
        
        let ext = 'png';
        if (activeTool === 'passport') ext = 'jpg';
        else if (activeTool === 'resize' || activeTool === 'convert') ext = convertOptions.format;
        else if (activeTool === 'compress') ext = file.type === 'image/jpeg' ? 'jpg' : 'webp';

        const dotIndex = file.name.lastIndexOf('.');
        const baseName = dotIndex !== -1 ? file.name.substring(0, dotIndex) : file.name;
        
        return { blob, filename: `${baseName}_edited.${ext}` };
      });

      const resolved = await Promise.all(fetchPromises);
      fileBlobs.push(...resolved);

      await downloadFilesAsZip(fileBlobs);
      toast.dismiss();
      toast.success('ZIP downloaded successfully!');
    } catch {
      toast.dismiss();
      toast.error('Failed to download ZIP file.');
    }
  };

  // Count done files
  const completedCount = files.filter(f => f.status === 'done').length;
  const currentSeo = seoContent[settings.language]?.[activeTool];

  return (
    <div className="flex-1 flex flex-col w-full">
      {/* 1. Dynamic SEO Header */}
      {currentSeo && (
        <div className="w-full max-w-7xl mx-auto px-6 pt-8 pb-2">
          <div className="flex items-center gap-2 mb-2 text-[#a97b56] font-bold text-xs uppercase tracking-wider">
            <span className="w-6 h-[1.5px] bg-[#a97b56]/50" />
            <span>{activeTool === 'bg-remover' ? 'AI Tool' : 'Online Tool'}</span>
          </div>
          <h1 className={`font-outfit text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>
            {currentSeo.h1}
          </h1>
          <p className={`text-sm max-w-4xl leading-relaxed ${
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          }`}>
            {currentSeo.intro}
          </p>
        </div>
      )}

      {/* 2. Editor Layout Grid */}
      <div className="w-full max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row gap-6 min-h-[550px] md:h-[620px]">
      
      {/* LEFT SIDEBAR: Upload list & dropzones */}
      <div className={`w-full md:w-80 flex flex-col p-5 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-[#0f1015] border-white/5 shadow-2xl' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        {files.length === 0 ? (
          <div className="flex-1 flex items-center justify-center">
            <UploadZone />
          </div>
        ) : (
          <FileQueue />
        )}
      </div>

      {/* 2. CENTER PANEL: Visual editor preview sliders */}
      <div className={`flex-1 flex flex-col rounded-2xl border relative overflow-hidden transition-all ${
        theme === 'dark' ? 'bg-[#0f1015] border-white/5 shadow-2xl' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        {files.length === 0 ? (
          /* Empty state */
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className={`p-4 rounded-full mb-4 flex items-center justify-center ${
              theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
            }`}>
              <ImageIcon className="w-8 h-8 text-purple-500/60" />
            </div>
            <h4 className="font-outfit font-bold text-base mb-1">{t.dashboard.noFiles}</h4>
            <p className="text-xs text-gray-500 max-w-xs">{t.description}</p>
          </div>
        ) : selectedFile ? (
          /* Selected File Previews */
          <div className="flex-1 flex flex-col h-full min-h-0">
            {isManualEditing && selectedFile.processedUrl ? (
              <ManualMaskEditor
                originalUrl={selectedFile.originalUrl}
                processedUrl={selectedFile.processedUrl}
                onSave={handleSaveManualMask}
                onCancel={() => setIsManualEditing(false)}
              />
            ) : (
              <>
                {/* Top comparison stats info */}
                {selectedFile.status === 'done' && selectedFile.processedUrl && (
                  <div className={`px-4 py-3 border-b flex justify-between items-center text-xs font-semibold ${
                    theme === 'dark' ? 'border-white/5 bg-[#12131a]/40 text-gray-300' : 'border-gray-200 bg-gray-50 text-gray-600'
                  }`}>
                    <div className="flex gap-4">
                      <div>
                        <span>{t.dashboard.originalSize}: </span>
                        <span className="font-mono text-gray-400">{formatBytes(selectedFile.size)}</span>
                        <span className="text-[10px] text-gray-500 font-mono"> ({selectedFile.width}×{selectedFile.height}px)</span>
                      </div>
                      <div>
                        <span>{t.dashboard.newSize}: </span>
                        <span className="font-mono text-purple-400">{formatBytes(selectedFile.processedSize || 0)}</span>
                        <span className="text-[10px] text-purple-500 font-mono"> ({selectedFile.processedWidth}×{selectedFile.processedHeight}px)</span>
                      </div>
                    </div>

                    {selectedFile.size > (selectedFile.processedSize || 0) && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded text-[10px] font-bold">
                        {t.dashboard.saved} {getSavingPercentage(selectedFile.size, selectedFile.processedSize || 0)}%
                      </div>
                    )}
                  </div>
                )}

                {/* The Image Slider Panel */}
                <div className="flex-1 min-h-0 flex items-center justify-center">
                  {selectedFile.processedUrl ? (
                    <ImageSlider 
                      originalUrl={selectedFile.originalUrl} 
                      processedUrl={selectedFile.processedUrl} 
                      name={selectedFile.name}
                    />
                  ) : (
                    /* Still original preview before conversion */
                    <div className="relative w-full h-full flex flex-col items-center justify-center p-6 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] dark:bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px]">
                      <div className="relative max-w-full aspect-[4/3] max-h-[350px] sm:max-h-[420px] rounded-xl overflow-hidden border border-white/5 bg-[#0f1015] flex items-center justify-center shadow-lg">
                        <img 
                          src={selectedFile.originalUrl} 
                          alt="Original input"
                          className="max-w-full max-h-full object-contain"
                        />
                        
                        {selectedFile.status === 'processing' && (
                          <div className="absolute inset-0 bg-black/75 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
                            <RefreshCw className="w-8 h-8 text-purple-500 animate-spin" />
                            <span className="text-xs font-semibold text-gray-300">{t.dashboard.processing}</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="mt-4 flex items-center gap-1.5 text-xs text-gray-500">
                        <Info className="w-3.5 h-3.5" />
                        <span>Click "Process Image" on the right to see the edited results.</span>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {/* Bottom Actions Download panel */}
            {!isManualEditing && (
              <div className={`px-5 py-4 border-t flex justify-end gap-3 ${
                theme === 'dark' ? 'border-white/5 bg-[#0a0b0f]/20' : 'border-gray-200 bg-gray-50/50'
              }`}>
                {/* Batch zip download button */}
                {completedCount > 1 && (
                  <button
                    onClick={handleDownloadZipAll}
                    className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
                      theme === 'dark'
                        ? 'bg-purple-900/40 text-purple-400 hover:bg-purple-900/60 border border-purple-500/20'
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <FolderDown className="w-4 h-4" />
                    <span>{t.dashboard.downloadZipBtn}</span>
                  </button>
                )}

                {/* Edit Mask button if tool is bg-remover or passport and status is done */}
                {selectedFile.status === 'done' && selectedFile.processedUrl && (activeTool === 'bg-remover' || activeTool === 'passport') && (
                  <button
                    onClick={() => setIsManualEditing(true)}
                    className={`flex items-center gap-1.5 px-4.5 py-2.5 text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
                      theme === 'dark'
                        ? 'bg-purple-900/40 text-purple-400 hover:bg-purple-900/60 border border-purple-500/20'
                        : 'bg-purple-50 text-purple-600 hover:bg-purple-100 border border-purple-200'
                    }`}
                  >
                    <RefreshCw className="w-4 h-4" />
                    <span>Manual Cleanup</span>
                  </button>
                )}

                {/* Selected download button */}
                {selectedFile.status === 'done' && selectedFile.processedUrl && (
                  <button
                    onClick={handleDownloadSelected}
                    className={`flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
                      theme === 'dark'
                        ? 'bg-white text-black hover:bg-gray-100 shadow-white/5'
                        : 'bg-black text-white hover:bg-gray-900 shadow-black/10'
                    }`}
                  >
                    <Download className="w-4 h-4" />
                    <span>{t.dashboard.downloadBtn}</span>
                  </button>
                )}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {/* 3. RIGHT PANEL: Active tool options config sidebar */}
      <div className={`w-full md:w-80 flex flex-col p-5 rounded-2xl border transition-all ${
        theme === 'dark' ? 'bg-[#0f1015] border-white/5 shadow-2xl' : 'bg-white border-gray-200 shadow-sm'
      }`}>
        <ToolConfigurator onProcess={handleProcess} isProcessing={isProcessing} />
      </div>
      </div>

      {/* Tool-Specific FAQ Section for SEO */}
      {currentSeo && currentSeo.faqs && (
        <div className={`w-full border-t py-24 px-6 md:px-12 transition-colors ${
          theme === 'dark' ? 'bg-[#0a0b0f] border-white/5' : 'bg-white border-gray-200'
        }`}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-500 uppercase block mb-3">
                FAQ
              </span>
              <h2 className={`font-outfit text-3xl md:text-5xl font-extrabold tracking-tight ${
                theme === 'dark' ? 'text-white' : 'text-gray-900'
              }`}>
                {settings.language === 'id' ? 'Semua yang perlu Anda ketahui' : 'Everything you need to know'}
              </h2>
            </div>

            <div className="flex flex-col border-t border-gray-200 dark:border-white/10">
              {currentSeo.faqs.map((faq: { q: string; a: string }, index: number) => (
                <div 
                  key={index}
                  className="border-b border-gray-200 dark:border-white/10"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className={`w-full py-6 flex items-center justify-between text-left transition-colors cursor-pointer ${
                      theme === 'dark' ? 'text-white hover:text-purple-400' : 'text-gray-900 hover:text-purple-600'
                    }`}
                  >
                    <span className="font-outfit text-base md:text-lg font-medium leading-snug">{faq.q}</span>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors flex-shrink-0 ml-4 ${
                      theme === 'dark' ? 'bg-white/5 text-white' : 'bg-gray-100 text-gray-800'
                    }`}>
                      <motion.div
                        animate={{ rotate: openFaq === index ? 45 : 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                        className="w-4 h-4 relative flex items-center justify-center"
                      >
                        <span className="absolute w-3.5 h-[1.5px] bg-current rounded-full" />
                        <span className="absolute w-[1.5px] h-3.5 bg-current rounded-full" />
                      </motion.div>
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className={`pb-6 text-sm sm:text-base leading-relaxed ${
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          <div className="pr-12 text-sm">{faq.a}</div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Compact Footer */}
      <footer className={`py-3.5 border-t transition-colors text-xs w-full flex-none ${
        theme === 'dark' 
          ? 'bg-[#06070a] border-white/5 text-gray-400' 
          : 'bg-white border-gray-200 text-gray-500'
      }`}>
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="flex flex-wrap items-center justify-center gap-1 sm:gap-2">
            <span>© {new Date().getFullYear()} <strong>{t.title}</strong>.</span>
            <span className="hidden sm:inline text-gray-400 dark:text-gray-600">|</span>
            <span>Created by <a href="https://github.com/Jsooonx" target="_blank" rel="noopener noreferrer" className={`font-semibold hover:underline ${theme === 'dark' ? 'text-gray-300 hover:text-purple-400' : 'text-gray-700 hover:text-purple-600'}`}>Jsooonx</a></span>
          </div>
          <p className="opacity-85">100% Client-Side Privacy Protection</p>
        </div>
      </footer>
    </div>
  );
};
export default Dashboard;
