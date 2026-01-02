"use client";

import { FolderComponentProps } from "@/lib/components/folder-manager/types/folder-manager";
import FileCard from "@/lib/components/file-card";
import { FolderOutlined } from "@mui/icons-material";

import styles from "./index.module.scss";

function FolderComponent({ folder, openFolderCallback }: FolderComponentProps) {
  return (
    <FileCard
      className={styles.folderComponent}
      name={folder.name}
      preview={""}
      fileType={"icon"}
      onClick={() => openFolderCallback(folder)}
      icon={<FolderOutlined sx={{ fontSize: 50 }} />}
    />
  )

}

export default FolderComponent;