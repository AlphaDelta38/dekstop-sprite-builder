"use client";

import FileCard from "@/lib/components/file-card";
import { FileComponentProps } from "../../../../components/folder-manager/types/folder-manager";
import { checkOnImage } from "@/lib/utils";
import { useMemo } from "react";



function FileComponent({ file }: FileComponentProps) {
  
  const fileType = useMemo(() => {
    if (checkOnImage(file.name)) {
      return "image";
    }
    
    return "icon";
  }, [file.fileFullPath]);

  const mediaPath = useMemo(() => {
    let normalizedPath = file.fileFullPath.replace(/\\/g, '/');

    if (!normalizedPath.startsWith('/')) {
      normalizedPath = `/${normalizedPath}`;
    }

    return `media://${encodeURI(normalizedPath)}`
  }, [file.fileFullPath]);


  return (
    <FileCard
      name={file.name}
      preview={mediaPath}
      fileType={fileType}
    />
  )

}

export default FileComponent;