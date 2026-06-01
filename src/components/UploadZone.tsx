import React, { useRef, useState } from 'react';
import { useImageStore } from '../store/imageStore';
import { getTranslation } from '../constants/translations';
import { Upload } from 'lucide-react';
import { toast } from 'sonner';

export const UploadZone: React.FC = () => {
  const { theme, settings, addFiles } = useImageStore();
  const t = getTranslation(settings.language);
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const processFilesList = async (filesList: FileList) => {
    const validFiles: File[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      if (file.type.startsWith('image/')) {
        validFiles.push(file);
      } else {
        toast.error(`File "${file.name}" is not a valid image and was ignored.`);
      }
    }

    if (validFiles.length > 0) {
      toast.promise(addFiles(validFiles), {
        loading: 'Uploading and analyzing images...',
        success: `${validFiles.length} images uploaded successfully!`,
        error: 'Failed to upload some images.',
      });
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFilesList(e.dataTransfer.files);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFilesList(e.target.files);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
      className={`relative w-full h-72 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center p-6 text-center transition-all duration-300 ${
        isDragActive
          ? 'border-purple-500 bg-purple-500/5 scale-[1.01]'
          : theme === 'dark'
            ? 'border-white/10 bg-[#12131a]/20 hover:border-white/20'
            : 'border-black/10 bg-white hover:border-black/20'
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />

      <div className={`p-4 rounded-full mb-4 flex items-center justify-center transition-colors ${
        theme === 'dark' ? 'bg-white/5' : 'bg-black/5'
      }`}>
        <Upload className="w-8 h-8 text-purple-500" />
      </div>

      <h3 className={`font-outfit text-lg font-bold mb-1.5 ${
        theme === 'dark' ? 'text-white' : 'text-gray-900'
      }`}>
        {t.dashboard.dropzoneTitle}
      </h3>
      <p className={`text-xs md:text-sm mb-6 max-w-xs ${
        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
      }`}>
        {t.dashboard.dropzoneSubtitle}
      </p>

      <button
        onClick={onButtonClick}
        className={`px-5 py-2.5 text-sm font-semibold rounded-full shadow-md cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
          theme === 'dark'
            ? 'bg-white text-black hover:bg-gray-100'
            : 'bg-black text-white hover:bg-gray-900'
        }`}
      >
        {t.dashboard.uploadBtn}
      </button>

      {/* Decorative corners */}
      <div className="absolute top-4 left-4 w-4 h-4 border-t-2 border-l-2 border-purple-500/30 rounded-tl" />
      <div className="absolute top-4 right-4 w-4 h-4 border-t-2 border-r-2 border-purple-500/30 rounded-tr" />
      <div className="absolute bottom-4 left-4 w-4 h-4 border-b-2 border-l-2 border-purple-500/30 rounded-bl" />
      <div className="absolute bottom-4 right-4 w-4 h-4 border-b-2 border-r-2 border-purple-500/30 rounded-br" />
    </div>
  );
};
export default UploadZone;
