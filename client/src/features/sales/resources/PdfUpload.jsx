// PdfUpload.js
import React from "react";
import { useDropzone } from "react-dropzone";

const PdfUpload = ({ onUpload }) => {
  const onDrop = (acceptedFiles) => {
    // Handle the uploaded file
    onUpload(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <p>Drag & drop a PDF file here, or click to select one</p>
    </div>
  );
};

export default PdfUpload;
