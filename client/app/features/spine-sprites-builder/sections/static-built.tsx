"use client";

import Accordian from "@/app/lib/components/accordian";
import FolderHeader from "../components/folder-header";
import { IFolder } from "../../folder-manager/types/folder-manager";

import FolderManager from "../../folder-manager";
import FolderComponent from "../components/folder-component";
import FileComponent from "../components/file-component";
import useFolderManager from "@/app/lib/hooks/folder-manager.hook";
import * as PIXI from 'pixi.js';
import { memo, useEffect, useState } from "react";
import { useFileController } from "@/app/lib/contexts/file-controller/index.";
import { useCacheController } from "@/app/lib/contexts/cache-controller";
import { CacheKey } from "@/app/lib/contexts/cache-controller/types";
  
function StaticBuilt({ renderKey }: { renderKey: number }) {
  const { getCache } = useCacheController();
  const { files } = useFileController();
  const { props: folderManagerProps, handleBackFolder, handleForwardFolder, fullPath, changeFolderTo } = useFolderManager();

  const [rootFolder, setRootFolder] = useState<IFolder>({
    name: "Static Built",
    files: [],
    folders: [],
  });

  const buildStaticSpritesHandler = async () => {
    if (!files.indexAtlas) return;

    const app = new PIXI.Application();
    
    const newRootFolder: IFolder = {
      ...rootFolder,
    }

    for (const json of files.jsons) {
      const spine = getCache<CacheKey.SPRITE_SPINE_DATA>(CacheKey.SPRITE_SPINE_DATA);


      if (!spine) {
        continue;
      }

      const canvas = app.renderer.extract.canvas(spine[json.name]);

      const file = await new Promise<File | null>((resolve) => {
        if (!canvas?.toBlob) {
          resolve(null);
          return;
        }

        canvas.toBlob((blob) => {
          if (!blob) {
            resolve(null);
            return;
          }

          resolve(new File([blob], json.name.replace(".json", ".png"), { type: 'image/png' }));
        });
      });

      if (file) {
        newRootFolder.files.push(file);
      }
    }

    app.destroy(true);
    setRootFolder(newRootFolder);
  }

  useEffect(()=>{
    buildStaticSpritesHandler();
  }, [renderKey]);

  return (
    <Accordian title={ 
      <FolderHeader 
        title="Static Built" 
        onDownload={() => {}} 
        onBack={handleBackFolder} 
        onForward={handleForwardFolder} 
        fullPath={fullPath} 
        changeFolderTo={changeFolderTo} 
      /> 
    }>
      <FolderManager rootFolder={rootFolder} FolderComponent={FolderComponent} FileComponent={FileComponent} {...folderManagerProps} />
    </Accordian>
  )
}

export default memo(StaticBuilt);