'use client';

import { useDropzone } from "react-dropzone";
import { Box, Typography, Button } from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

import styles from './index.module.scss';


interface FileDropzoneProps {
  allowsFileExtensions: Record<string, string[]>;
  onDelete: (file: File) => void;
  onDrop: (acceptedFiles: File[]) => void;
  files?: File[];
}

function FileDropzone({ onDrop, allowsFileExtensions, onDelete, files }: FileDropzoneProps) {

  const { getRootProps, getInputProps, isDragActive, acceptedFiles } = useDropzone({
    accept: allowsFileExtensions,
    multiple: true,
    onDrop: (acceptedFiles: File[]) => {
      onDrop(acceptedFiles);
    },
  });
  
  return (
    <Box {...getRootProps()} className={styles.dropzone}>
      <input {...getInputProps()} />

      <CloudUpload sx={{ fontSize: 48, color: "#42a5f5" }} />

      <Typography variant="h6" mt={2}>
        {isDragActive
          ? "Отпусти файлы сюда"
          : "Перетащи файлы или нажми для выбора"}
      </Typography>
      
      <Button variant="contained" sx={{ mt: 2 }}>
        Выбрать файлы
      </Button>

      {(files ?? acceptedFiles).length > 0 && (
        <Box mt={2} className={styles.filesList}>
          {(files ?? acceptedFiles).map((file) => (
            <Box key={file.name} className={styles.fileItem}>
              <Typography key={file.name} variant="body2">
                {file.name} — {Math.round(file.size / 1024)} KB
              </Typography>
              <Button variant="contained" color="error" onClick={(e) => {e.stopPropagation(); onDelete(file)}}>Delete</Button>
            </Box>
          ))}

        </Box>
      )}

    </Box>
  );
}

export default FileDropzone;