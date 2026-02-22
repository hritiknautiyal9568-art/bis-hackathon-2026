"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, FileText, Image, X, Loader2 } from "lucide-react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  onTextInput?: (text: string) => void;
  accept?: Record<string, string[]>;
  label?: string;
  description?: string;
  showTextInput?: boolean;
  loading?: boolean;
}

export default function FileUpload({
  onFileSelect,
  onTextInput,
  accept = {
    "image/*": [".png", ".jpg", ".jpeg", ".webp"],
    "application/pdf": [".pdf"],
    "text/plain": [".txt"],
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
  },
  label = "Upload Product Information",
  description = "Drag & drop product specs, datasheets, images, or labels",
  showTextInput = true,
  loading = false,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [textValue, setTextValue] = useState("");
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        onFileSelect(file);

        if (file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        } else {
          setPreviewUrl(null);
        }
      }
    },
    [onFileSelect]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: loading,
  });

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-gray-700">{label}</label>

      {/* Dropzone */}
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-[#003580] bg-blue-50"
            : selectedFile
            ? "border-green-400 bg-green-50"
            : "border-gray-300 hover:border-[#003580] hover:bg-blue-50/50"
        } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <input {...getInputProps()} />

        {loading ? (
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="h-10 w-10 text-[#003580] animate-spin" />
            <p className="text-sm text-gray-600">Analyzing your product...</p>
          </div>
        ) : selectedFile ? (
          <div className="flex flex-col items-center gap-3">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Preview"
                className="h-24 w-24 object-cover rounded-lg border"
              />
            ) : (
              <FileText className="h-10 w-10 text-green-600" />
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                clearFile();
              }}
              className="absolute top-3 right-3 p-1 rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-full">
              <Upload className="h-8 w-8 text-[#003580]" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">{description}</p>
              <p className="text-xs text-gray-500 mt-1">
                Supports: Images, PDFs, Text files (Max 10MB)
              </p>
            </div>
            <div className="flex gap-4 mt-2">
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Image className="h-3 w-3" /> Images
              </span>
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <FileText className="h-3 w-3" /> Documents
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Text Input */}
      {showTextInput && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="flex-1 border-t border-gray-200" />
            <span className="text-xs text-gray-400 font-medium">OR</span>
            <div className="flex-1 border-t border-gray-200" />
          </div>
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder="Paste product specifications, datasheet content, or describe your product in detail...&#10;&#10;Example: Electric water heater, 25L capacity, 2000W heating element, stainless steel inner tank, BEE 5-star rated, for domestic use..."
            className="w-full h-36 px-4 py-3 rounded-xl border border-gray-300 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#003580] focus:border-transparent resize-none"
            disabled={loading}
          />
          {onTextInput && textValue.trim() && (
            <button
              onClick={() => onTextInput(textValue)}
              disabled={loading || !textValue.trim()}
              className="mt-2 px-6 py-2.5 bg-[#003580] text-white rounded-lg text-sm font-medium hover:bg-[#002a66] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Analyze Text Description
            </button>
          )}
        </div>
      )}
    </div>
  );
}
