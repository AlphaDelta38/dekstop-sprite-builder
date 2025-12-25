"use client";

import Accordian from "@/app/lib/components/accordian";
import FolderHeader from "../components/folder-header";
import downloadFolder from "../../folder-manager/utils/download-folder";
import { memo, useEffect, useState } from "react";
import { IFolder } from "../../folder-manager/types/folder-manager";
import useFolderManager from "@/app/lib/hooks/folder-manager.hook";
import FolderManager from "../../folder-manager";
import FolderComponent from "../components/folder-component";
import FileComponent from "../components/file-component";
import { useCacheController } from "@/app/lib/contexts/cache-controller";
import { useFileController } from "@/app/lib/contexts/file-controller/index.";
import { CacheKey } from "@/app/lib/contexts/cache-controller/types";
import extractAnimationsFromJson from "../utils/extract-animations-from-json";
import bakeSpineAnimation from "../utils/bake-spine-animation";
import * as PIXI from 'pixi.js';
import multiBakeSpineAnimations from "../utils/multi-bake-spine-animations";

function Sequences({ renderKey }: { renderKey: number }) {
  const { props: folderManagerProps, handleBackFolder, handleForwardFolder, fullPath, changeFolderTo } = useFolderManager();
  const { getCache, setCache } = useCacheController();
  const { files } = useFileController();

  const [rootFolder, setRootFolder] = useState<IFolder>({
    name: "Sequences",
    files: [],
    folders: [],
  });
  
  const renderSequencesHandler = async () => {
    const spineSkeletons = getCache<CacheKey.SPRITE_SPINE_DATA>(CacheKey.SPRITE_SPINE_DATA);

    if (!spineSkeletons) return;

    const app = new PIXI.Application();
    const resultFiles = await multiBakeSpineAnimations({ app, jsons: files.jsons, spineSkeletons });
    
    const newRootFolder: IFolder = {
      name: "Sequences",
      files: [],
      folders: [],
    }

    for (const [key, value] of Object.entries(resultFiles)) {
      newRootFolder.folders.push({
        name: key.replace(".json", ""),
        files: [],
        folders: [],
      })

      for (const [animation, animationFiles] of Object.entries(value)) {
        newRootFolder.folders[newRootFolder.folders.length - 1].folders.push({
          name: animation,
          files: animationFiles,
          folders: [],
        });
      }

    }

    setCache<CacheKey.SEQUENCES_DATA>(CacheKey.SEQUENCES_DATA, resultFiles);
    setRootFolder({...newRootFolder});
    app.destroy(true);
  }

  useEffect(() => {
    if (!files.indexAtlas) return;

    renderSequencesHandler();
  }, [renderKey]);

  return (
    <Accordian title={ 
      <FolderHeader 
        title="Sequences" 
        onDownload={() => downloadFolder(rootFolder)} 
        onBack={handleBackFolder} 
        onForward={handleForwardFolder} 
        fullPath={fullPath}  
        changeFolderTo={changeFolderTo} 
      /> 
    }>
      <FolderManager rootFolder={rootFolder} FolderComponent={FolderComponent} FileComponent={FileComponent} {...folderManagerProps} renderFile={false} />
    </Accordian>
  )
}

export default memo(Sequences);