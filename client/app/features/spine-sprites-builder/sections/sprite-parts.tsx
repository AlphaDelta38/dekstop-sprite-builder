"use client";

import Accordian from "@/app/lib/components/accordian";
import FolderHeader from "../components/folder-header";
import FolderManager from "../../folder-manager";
import FolderComponent from "../components/folder-component";
import FileComponent from "../components/file-component";
import { memo, useEffect, useState } from "react";
import { useFileController } from "@/app/lib/contexts/file-controller/index.";
import { IFolder } from "../../folder-manager/types/folder-manager";
import { parseAtlas } from "@/app/lib/utils";
import { sheetsToSprites } from "../utils/sheets-to-sprites";
import * as PIXI from 'pixi.js';
import useFolderManager from "@/app/lib/hooks/folder-manager.hook";
import downloadFolder from "../../folder-manager/utils/download-folder";

interface SpritePartsProps {
  renderKey: number;
}

function SpriteParts({ renderKey }: SpritePartsProps) {
  const { files } = useFileController();
  const { props: folderManagerProps, handleBackFolder, handleForwardFolder, fullPath, changeFolderTo } = useFolderManager();
  
  const [rootFolder, setRootFolder] = useState<IFolder>({
    name: "Sprite Parts",
    files: [],
    folders: [],
  });

  const parseAtlasHandler = async () => {
    if (!files.indexAtlas || !files.images) return;

    const atlasText = await files.indexAtlas.text();
    const parsedAtlas = parseAtlas(atlasText);

    const app = new PIXI.Application()

    const neededImages = parsedAtlas.map((sheet) => sheet.sheetName);
    const textures: Record<string, PIXI.BaseTexture> = {};

    for (const image of files.images) {
      if (!neededImages.includes(image.name)) continue;

      const blobUrl = URL.createObjectURL(image);
      const asset = PIXI.Texture.from(blobUrl);

      textures[image.name] = asset.baseTexture;
    }

    const sprites = await sheetsToSprites(app, parsedAtlas, textures);

    const newRootFolder: IFolder = {
      ...rootFolder,
    }

    for (const [key, file] of Object.entries(sprites)) {
      const folderPaths = key.split("/").slice(0, -1);

      let currentFolder: IFolder = newRootFolder;

      for (const path of folderPaths) {
        let folder = currentFolder.folders.find((folder) => folder.name === path);

        if (!folder) {
          folder = { name: path, files: [], folders: [] };
          currentFolder.folders.push(folder);
        }

        currentFolder = folder;
      }

      
      if (currentFolder.files.some((f) => f.name === file.name)) continue;

      currentFolder.files.push(file);
    }
  
    app.destroy(true);
    setRootFolder(newRootFolder);
  }

  useEffect(()=>{
    parseAtlasHandler();
  }, [renderKey]);

  return (
    <Accordian title={ 
      <FolderHeader 
        title="Sprite Parts" 
        onDownload={() => downloadFolder(rootFolder)} 
        onBack={handleBackFolder} 
        onForward={handleForwardFolder} 
        fullPath={fullPath}  
        changeFolderTo={changeFolderTo} 
      /> 
    }>
      <FolderManager rootFolder={rootFolder} FolderComponent={FolderComponent} FileComponent={FileComponent} {...folderManagerProps} />
    </Accordian>
  )
};

export default memo(SpriteParts);