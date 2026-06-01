import React, { useRef } from 'react';
import { useImageStore } from '../store/imageStore';
import { getTranslation, formatBytes } from '../constants/translations';
import { Trash2, Plus, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export const FileQueue: React.FC = () => {
  const { 
    files, 
    selectedFileId, 
    theme, 
    settings, 
    setSelectedFileId, 
    removeFile, 
    clearFiles,
    addFiles
  } = useImageStore();

  const t = getTranslation(settings.language);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddMoreFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const validFiles: File[] = [];
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        if (file.type.startsWith('image/')) {
          validFiles.push(file);
        }
      }
      if (validFiles.length > 0) {
        await addFiles(validFiles);
        toast.success(`${validFiles.length} files added to queue.`);
      } else {
        toast.error('File is not a valid image.');
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header queue */}
      <div className="flex items-center justify-between mb-4">
        <h3 className={`font-outfit font-bold text-sm uppercase tracking-wider ${
          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
        }`}>
          {t.dashboard.queueTitle} ({files.length})
        </h3>
        
        {files.length > 0 && (
          <button
            onClick={clearFiles}
            className="flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t.dashboard.clearAll}</span>
          </button>
        )}
      </div>

      {/* Files list scroll container */}
      <div className="flex-1 overflow-y-auto min-h-0 space-y-2 pr-1 max-h-[380px] md:max-h-[500px]">
        {files.map((file) => {
          const isSelected = file.id === selectedFileId;
          return (
            <div
              key={file.id}
              onClick={() => setSelectedFileId(file.id)}
              className={`p-3 rounded-xl border flex gap-3 items-center cursor-pointer transition-all ${
                isSelected
                  ? theme === 'dark'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-purple-500 bg-purple-500/5'
                  : theme === 'dark'
                    ? 'border-white/5 hover:border-white/10 bg-[#12131a]/40 hover:bg-[#12131a]/60'
                    : 'border-black/5 hover:border-black/10 bg-white hover:bg-white/80'
              }`}
            >
              {/* Thumbnail */}
              <div className={`w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-black/10 border ${
                theme === 'dark' ? 'border-white/5' : 'border-black/5'
              }`}>
                <img 
                  src={file.originalUrl} 
                  alt={file.name} 
                  className="w-full h-full object-cover"
                />
              </div>

              {/* File Info */}
              <div className="flex-1 min-w-0">
                <p className={`text-xs sm:text-sm font-semibold truncate ${
                  theme === 'dark' ? 'text-white' : 'text-gray-900'
                }`}>
                  {file.name}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className={`text-[10px] sm:text-xs font-medium font-mono ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    {formatBytes(file.size)}
                  </span>
                  
                  {/* Status label */}
                  {file.status === 'idle' && (
                    <span className="text-[10px] text-gray-500 font-semibold">{t.dashboard.before}</span>
                  )}
                  {file.status === 'processing' && (
                    <span className="flex items-center gap-0.5 text-[10px] text-purple-400 font-semibold">
                      <Loader2 className="w-3 h-3 animate-spin" />
                      <span>{t.dashboard.processing}</span>
                    </span>
                  )}
                  {file.status === 'done' && (
                    <span className="flex items-center gap-0.5 text-[10px] text-emerald-500 font-bold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>{t.dashboard.processed}</span>
                    </span>
                  )}
                  {file.status === 'error' && (
                    <span className="flex items-center gap-0.5 text-[10px] text-rose-500 font-bold" title={file.errorMessage}>
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>Err</span>
                    </span>
                  )}
                </div>

                {/* Progress bar */}
                {file.status === 'processing' && (
                  <div className="w-full bg-purple-950/20 rounded-full h-1 mt-1.5 overflow-hidden">
                    <div 
                      className="bg-purple-500 h-1 rounded-full transition-all duration-300"
                      style={{ width: `${file.progress}%` }}
                    />
                  </div>
                )}
              </div>

              {/* Action Delete */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(file.id);
                }}
                className={`p-1.5 rounded-lg opacity-60 hover:opacity-100 hover:text-rose-500 cursor-pointer transition-colors ${
                  theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Add more button */}
      <div className="mt-4">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleAddMoreFiles}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className={`w-full flex items-center justify-center gap-2 p-3 text-xs font-bold rounded-xl border border-dashed cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] ${
            theme === 'dark'
              ? 'border-white/10 hover:border-purple-500/40 hover:bg-purple-500/5 text-gray-300'
              : 'border-black/10 hover:border-purple-500/40 hover:bg-purple-500/5 text-gray-700'
          }`}
        >
          <Plus className="w-4 h-4 text-purple-500" />
          <span>Add More Images</span>
        </button>
      </div>
    </div>
  );
};
export default FileQueue;
