"use client";

import FileCard from "@/app/lib/components/file-card";
import { FileComponentProps } from "../../../folder-manager/types/folder-manager";
import downloadFile from "@/app/lib/utils/download-file";
import { Button } from "@mui/material";

function FileComponent({ file }: FileComponentProps) {

  const fileType = file.type.split("/")[0];
  const preview = URL.createObjectURL(file);

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    downloadFile(file);
  }

  return (
    <FileCard
      name={file.name}
      preview={preview}
      fileType={fileType}
      actions={
        <Button variant="outlined" size="small" onClick={(e) => handleDownload(e)}>Download</Button>
      }
    />
  )

}

export default FileComponent;