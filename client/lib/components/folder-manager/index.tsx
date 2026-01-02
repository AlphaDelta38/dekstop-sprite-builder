"use client";

import { Box } from "@mui/material";
import { FolderComponent, FileComponent, IFolder, PathState } from "./types/folder-manager";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import styles from "./index.module.scss";

interface FolderManagerProps {
  rootFolder: IFolder;
  FolderComponent: FolderComponent;
  FileComponent: FileComponent;
  setPathStateCallback?: (setPathState: Dispatch<SetStateAction<PathState>>) => void;
  onPathChange?: (fullPath: string) => void;
  renderFile?: boolean;
}

function FolderManager({ rootFolder, FolderComponent, FileComponent, setPathStateCallback, onPathChange, renderFile = true }: FolderManagerProps) {
  const [currentFolder, setCurrentFolder] = useState<IFolder>({...rootFolder});
  const [pathState, setPathState] = useState<PathState>({
    fullPath: rootFolder.name,
    prevFolder: rootFolder.name,
  });

  useEffect(()=>{
    onPathChange?.(pathState.fullPath);

    const paths = pathState.fullPath.split("/")
    
    let currentFolder = rootFolder;

    for (const folderName of paths) {
      currentFolder = currentFolder.folders.find((folder) => folder.name === folderName) ?? currentFolder;
    }

    setCurrentFolder(currentFolder);
  }, [pathState])

  useEffect(()=>{
    if (setPathStateCallback) {
      setPathStateCallback(setPathState);
    }
  }, [])

  const openFolderCallback = (folder: IFolder) => {
    const newFullPath = pathState.fullPath !== "" ? pathState.fullPath + "/" + folder.name : folder.name;

    setCurrentFolder(folder);

    setPathState({
      ...pathState,
      fullPath: newFullPath,
      prevFolder: folder.name,
    });
  }

  useEffect(()=>{
    setCurrentFolder({...rootFolder});
  }, [rootFolder])

  return (
    <Box className={styles.container}>

      {currentFolder.folders.map((folder)=>
        <FolderComponent key={folder.name + folder.filePaths.length + folder.folders.length} folder={folder} openFolderCallback={() => openFolderCallback(folder)} />
      )}

      {renderFile && currentFolder.filePaths.map((filePath)=>
        <FileComponent key={filePath.fileFullPath + filePath.name} file={filePath} />
      )}

    </Box>
  )
}

export default FolderManager;

