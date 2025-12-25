"use client";

import { FolderComponentProps } from "@/app/features/folder-manager/types/folder-manager";
import FileCard from "@/app/lib/components/file-card";
import { FolderOutlined } from "@mui/icons-material";

import styles from "./index.module.scss";
import { Button } from "@mui/material";
import downloadFolder from "@/app/features/folder-manager/utils/download-folder";

function FolderComponent({ folder, openFolderCallback }: FolderComponentProps) {

  const handleDownload = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    downloadFolder(folder);
  }

  return (
    <FileCard
      className={styles.folderComponent}
      name={folder.name}
      preview={""}
      fileType={"icon"}
      actions={
        <Button variant="outlined" size="small" onClick={(e) => handleDownload(e)}>Download</Button>
      }
      onClick={() => openFolderCallback(folder)}
      icon={<FolderOutlined sx={{ fontSize: 50 }} />}
    />
  )

}

export default FolderComponent;