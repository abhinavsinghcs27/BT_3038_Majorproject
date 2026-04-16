import { useCallback, useState, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { FiFileText, FiUploadCloud, FiX, FiImage } from "react-icons/fi";

function formatFileSize(size = 0) {
  if (!size) {
    return "0 KB";
  }

  const units = ["B", "KB", "MB", "GB"];
  let currentSize = size;
  let unitIndex = 0;

  while (currentSize >= 1024 && unitIndex < units.length - 1) {
    currentSize /= 1024;
    unitIndex += 1;
  }

  return `${currentSize.toFixed(currentSize > 10 || unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export default function ReportUpload({ fileMeta, onFileChange, currentReport, onChange }) {
  const resolvedMeta = fileMeta ?? currentReport ?? null;
  const resolvedCallback = onFileChange ?? onChange;
  const [previewUrl, setPreviewUrl] = useState(null);

  // Clean up object URLs to avoid memory leaks
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const nextFile = acceptedFiles[0];

      if (!nextFile) {
        return;
      }

      // Create a preview URL if it's an image
      if (nextFile.type.startsWith("image/")) {
        const url = URL.createObjectURL(nextFile);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }

      resolvedCallback({
        name: nextFile.name,
        size: nextFile.size,
        type: nextFile.type,
        lastModified: nextFile.lastModified,
      });
    },
    [resolvedCallback]
  );

  const handleRemove = (e) => {
    e.stopPropagation();
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    resolvedCallback(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    maxFiles: 1,
    accept: {
      "application/pdf": [".pdf"],
      "image/png": [".png"],
      "image/jpeg": [".jpg", ".jpeg"],
    },
  });

  return (
    <div className="glass-panel rounded-[1.75rem] p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">Clinical Report Upload</h3>
          <p className="mt-1 text-sm text-slate-500">
            Attach a PDF or image so the UI can reflect document-backed intelligence.
          </p>
        </div>

        <div className="rounded-2xl bg-cyan-100 p-3 text-cyan-700">
          <FiUploadCloud className="text-xl" />
        </div>
      </div>

      {!resolvedMeta ? (
        // Upload Dropzone State
        <div
          {...getRootProps()}
          className={`cursor-pointer rounded-[1.5rem] border border-dashed px-5 py-8 text-center transition ${
            isDragActive
              ? "border-cyan-400 bg-cyan-50"
              : "border-slate-300 bg-white hover:border-cyan-300 hover:bg-cyan-50/40"
          }`}
        >
          <input {...getInputProps()} />
          <p className="text-base font-medium text-slate-800">
            Drag & drop the latest report here
          </p>
          <p className="mt-2 text-sm text-slate-500">or tap to browse secure local files</p>

          <div className="mt-4 flex flex-wrap justify-center gap-2 text-xs text-slate-500">
            <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1">PDF reports</span>
            <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1">Lab images</span>
            <span className="rounded-full border border-slate-100 bg-slate-50 px-3 py-1">Radiographs</span>
          </div>
        </div>
      ) : (
        // File Preview State
        <div className="overflow-hidden rounded-[1.5rem] border border-emerald-200 bg-white">
          {/* Image Thumbnail Preview */}
          {(previewUrl || resolvedMeta.type?.startsWith("image/")) ? (
            <div className="relative h-48 w-full bg-slate-100">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Document preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-400">
                  <FiImage className="text-4xl" />
                </div>
              )}
            </div>
          ) : (
             /* PDF/Other Document Preview */
            <div className="flex h-32 w-full items-center justify-center bg-slate-50 text-slate-400">
               <FiFileText className="text-5xl opacity-50" />
            </div>
          )}
          
          {/* File Meta Footer */}
          <div className="flex items-center justify-between bg-emerald-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="rounded-xl bg-white p-2.5 text-emerald-600 shadow-sm">
                {resolvedMeta.type?.startsWith("image/") ? <FiImage /> : <FiFileText />}
              </div>
              <div className="truncate">
                <p className="w-[200px] truncate font-medium text-slate-900 sm:w-[300px]">{resolvedMeta.name}</p>
                <p className="text-xs text-slate-500">
                  {formatFileSize(resolvedMeta.size)} • {resolvedMeta.type || "Document"}
                </p>
              </div>
            </div>
            
            <button
              type="button"
              onClick={handleRemove}
              className="flex items-center justify-center rounded-full bg-white p-2 text-slate-400 shadow-sm transition hover:bg-rose-50 hover:text-rose-600"
              title="Remove file"
            >
              <FiX className="text-lg" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
