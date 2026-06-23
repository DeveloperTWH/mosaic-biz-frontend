import type { ReactNode } from "react";
import { Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

type VendorUploadZoneProps = {
  id: string;
  label: string;
  helperText?: string;
  accept?: string;
  multiple?: boolean;
  uploading?: boolean;
  uploadProgress?: number;
  error?: string;
  preview?: ReactNode;
  emptyHint?: string;
  onFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
};

export default function VendorUploadZone({
  id,
  label,
  helperText,
  accept,
  multiple,
  uploading,
  uploadProgress,
  error,
  preview,
  emptyHint = "Drag and drop or click to browse",
  onFileChange,
  className,
}: VendorUploadZoneProps) {
  return (
    <div className={cn("vendor-upload-zone", className)}>
      <label htmlFor={id} className="vendor-upload-zone-label">
        {label}
      </label>
      {helperText ? <p className="vendor-upload-zone-helper">{helperText}</p> : null}

      {preview ? (
        <div className="vendor-upload-zone-preview">{preview}</div>
      ) : (
        <label htmlFor={id} className="vendor-upload-zone-drop">
          <input
            id={id}
            type="file"
            className="sr-only"
            accept={accept}
            multiple={multiple}
            onChange={onFileChange}
            disabled={uploading}
          />
          {uploading ? (
            <Loader2 className="h-8 w-8 animate-spin text-dashboard-gold" aria-hidden />
          ) : (
            <Upload className="h-8 w-8 text-dashboard-muted" aria-hidden />
          )}
          <span className="vendor-upload-zone-drop-title">
            {uploading ? "Uploading…" : "Choose file"}
          </span>
          <span className="vendor-upload-zone-drop-hint">{emptyHint}</span>
          {typeof uploadProgress === "number" && uploadProgress > 0 && uploadProgress < 100 ? (
            <span className="text-xs text-dashboard-muted">{uploadProgress}%</span>
          ) : null}
        </label>
      )}

      {error ? <p className="vendor-upload-zone-error">{error}</p> : null}
    </div>
  );
}
