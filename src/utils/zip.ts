import JSZip from 'jszip';

/**
 * Triggers a browser download for a raw Blob
 */
export const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  
  // Clean up
  document.body.removeChild(a);
  setTimeout(() => {
    URL.revokeObjectURL(url);
  }, 100);
};

/**
 * Compiles a list of processed files into a single ZIP archive and downloads it
 */
export const downloadFilesAsZip = async (
  filesList: { blob: Blob; filename: string }[],
  zipName = 'phototoolkit-export.zip'
): Promise<void> => {
  if (filesList.length === 0) return;
  
  const zip = new JSZip();
  
  // Track filename duplicates to avoid overwriting inside the ZIP
  const nameCounts: Record<string, number> = {};
  
  filesList.forEach((file) => {
    let name = file.filename;
    if (nameCounts[name] !== undefined) {
      nameCounts[name]++;
      const dotIndex = name.lastIndexOf('.');
      if (dotIndex !== -1) {
        name = `${name.substring(0, dotIndex)} (${nameCounts[name]})${name.substring(dotIndex)}`;
      } else {
        name = `${name} (${nameCounts[name]})`;
      }
    } else {
      nameCounts[name] = 0;
    }
    
    zip.file(name, file.blob);
  });
  
  const zipBlob = await zip.generateAsync({ type: 'blob' });
  downloadBlob(zipBlob, zipName);
};
