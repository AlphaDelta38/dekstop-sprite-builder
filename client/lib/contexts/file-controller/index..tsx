'use client';

import { createContext, useContext, useMemo, useState } from "react";
import { FileControllerModel, FilesState } from "./types";

const FileControllerContext = createContext<FileControllerModel | null>(null)

function FileControllerProvider({ children }: { children: React.ReactNode }) {
  const [files, setFiles] = useState<FilesState>({
    texturePaths: [],
    skeletonPaths: [],
    atlasPath: "",
  });

  const values = useMemo(()=>{
    return {
      files,
      setFiles,
    }
  }, [files])

  return (
    <FileControllerContext.Provider value={values}>
      {children}
    </FileControllerContext.Provider>
  )

}

export function useFileController() {
  const context: FileControllerModel | null = useContext(FileControllerContext);

  if (!context) {
    throw new Error("useFileController must be used within FileControllerProvider");
  }

  return context;
}


export default FileControllerProvider;