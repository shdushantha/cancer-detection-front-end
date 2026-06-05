import React, { useCallback, useRef, useState } from 'react';
import { Upload, ImageIcon, X } from 'lucide-react';

interface Props {
  file: File | null;
  preview: string | null;
  onFile: (file: File, preview: string) => void;
  onClear: () => void;
}

export const FileUpload: React.FC<Props> = ({ file, preview, onFile, onClear }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const processFile = (f: File) => {
    if (!f.type.startsWith('image/')) return;
    const reader = new FileReader();
    reader.onload = (e) => onFile(f, e.target?.result as string);
    reader.readAsDataURL(f);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) processFile(f);
  }, []);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) processFile(f);
  };

  if (preview && file) {
    return (
      <div className="upload-preview">
        <img src={preview} alt="Patient scan" className="upload-preview__img" />
        <div className="upload-preview__meta">
          <ImageIcon size={14} />
          <span>{file.name}</span>
          <span className="upload-preview__size">
            {(file.size / 1024).toFixed(1)} KB
          </span>
        </div>
        <button className="upload-preview__clear" onClick={onClear} title="Remove image">
          <X size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`upload-zone ${dragging ? 'dragging' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={onDrop}
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={onInputChange}
      />
      <div className="upload-zone__icon">
        <Upload size={28} strokeWidth={1.5} />
      </div>
      <p className="upload-zone__title">Drop patient image here</p>
      <p className="upload-zone__sub">or click to browse — PNG, JPG, JPEG</p>
      <div className="upload-zone__pulse" />
    </div>
  );
};
