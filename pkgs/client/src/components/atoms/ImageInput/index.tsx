import React, { useRef, useState } from "react";

import "./ImageInput.css";

type ImageInputProps = {
  className?: string;
  name: string;
  label?: string;
  onFileChosen: (name: string, file: File) => void;
};

export const ImageInput: React.FC<ImageInputProps> = ({
  className,
  name,
  label,
  onFileChosen,
}) => {
  const [fileName, setFileName] = useState<string | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const inputEl = useRef<HTMLInputElement>(null);

  const handleClick = () => {
    inputEl.current?.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      setFileName(file.name as string);
      setFileSize(file.size as number);
      onFileChosen?.(name, file);
    }
  };

  return (
    <div className="image-input">
      {label && <label className="image-input-label">{label}</label>}
      <input
        ref={inputEl}
        className={`image-input-field ${className}`}
        type="file"
        onChange={handleChange}
      />
      {fileName && fileSize && (
        <dl>
          <dt>Filename:</dt>
          <dd>{fileName}</dd>
          <dt>File Size:</dt>
          <dd>{fileSize}</dd>
        </dl>
      )}
      <button type="button" onClick={handleClick}>
        Upload Image
      </button>
    </div>
  );
};
