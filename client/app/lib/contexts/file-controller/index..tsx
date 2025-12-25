'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { FileControllerModel, FilesState } from "./types";
import { parseAtlas } from "../../utils";

const FileControllerContext = createContext<FileControllerModel | null>(null)


function FileControllerProvider({ children }: { children: React.ReactNode }) {
  const [filesIsReady, setFilesIsReady] = useState(true);
  const [allowedSheets, setAllowedSheets] = useState<string[]>([]);

  const [files, setFiles] = useState<FilesState>({
    images: [],
    jsons: [],
    atlases: [],
    indexAtlas: null,
  });

  const allowedSheetsHandler = async () => {
    if (!files.indexAtlas) return;

    const atlasText = await files.indexAtlas.text();
    const parsedAtlas = parseAtlas(atlasText);

    setAllowedSheets(parsedAtlas.map((sheet) => sheet.sheetName));
    setFilesIsReady(true);
  };

  useEffect(() => {
    if (!files.indexAtlas) return;
    
    setFilesIsReady(false);
    allowedSheetsHandler();
  }, [files.indexAtlas?.size]);

  useEffect(() => {
    if (!allowedSheets.length) return;

    setFiles((prev) => ({
      ...prev,
      images: prev.images.filter((image) => allowedSheets.includes(image.name)),
    }));

  }, [allowedSheets, files.images.length]);


  const values = {
    files,
    filesIsReady,
    setFiles,
  }

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