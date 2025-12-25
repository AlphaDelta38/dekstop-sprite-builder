"use client";

import Accordian from "@/app/lib/components/accordian";
import FolderHeader from "../components/folder-header";
import FolderManager from "../../folder-manager";
import downloadFolder from "../../folder-manager/utils/download-folder";
import useFolderManager from "@/app/lib/hooks/folder-manager.hook";
import { useEffect, useState } from "react";
import { IFolder } from "../../folder-manager/types/folder-manager";
import { useCacheController } from "@/app/lib/contexts/cache-controller";
import { useFileController } from "@/app/lib/contexts/file-controller/index.";
import FolderComponent from "../components/folder-component";
import FileComponent from "../components/file-component";
import multiBakeSpineAnimations from "../utils/multi-bake-spine-animations";
import * as PIXI from 'pixi.js';
import { CacheKey } from "@/app/lib/contexts/cache-controller/types";
import convertFramesToMov from "../utils/convert-frames-to-mov";
import { FFmpeg } from "@ffmpeg/ffmpeg";

function Animations({ renderKey, ffmpeg }: { renderKey: number, ffmpeg: FFmpeg | null }) {
  const { props: folderManagerProps, handleBackFolder, handleForwardFolder, fullPath, changeFolderTo } = useFolderManager();
  const { files } = useFileController();
  const { getCache } = useCacheController();

  const [rootFolder, setRootFolder] = useState<IFolder>({
    name: "Animations",
    files: [],
    folders: [],
  });


  const renderAnimationsHandler = async () => {
    if (!ffmpeg) return;

    const spineSkeletons = getCache<CacheKey.SPRITE_SPINE_DATA>(CacheKey.SPRITE_SPINE_DATA);
    let resultFiles = getCache<CacheKey.SEQUENCES_DATA>(CacheKey.SEQUENCES_DATA);

    if (!spineSkeletons) return;

    const app = new PIXI.Application();

    if (!resultFiles) {
      resultFiles = await multiBakeSpineAnimations({ app, jsons: files.jsons, spineSkeletons });
    }
    
    const newRootFolder: IFolder = {
      ...rootFolder,
    }

    for (const [key, value] of Object.entries(resultFiles)) {
      newRootFolder.folders.push({
        name: key.replace(".json", ""),
        files: [],
        folders: [],
      })

      for (const [animation, animationFiles] of Object.entries(value)) {
        console.log(animationFiles, "animationFiles", animation);
        const movAnimationFile = await convertFramesToMov(ffmpeg, animationFiles, 60, animation);
        console.log(movAnimationFile, "movAnimationFile");
        if (movAnimationFile) {
          newRootFolder.folders[newRootFolder.folders.length - 1].files.push(movAnimationFile);
        }
      }

    }

    setRootFolder({...newRootFolder});
    app.destroy(true);
  }

  useEffect(() => {
    console.log(ffmpeg, "ffmpeg");
    renderAnimationsHandler();
  }, [renderKey, ffmpeg]);


  return (
    <Accordian title={ 
      <FolderHeader 
        title="Animations" 
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
}

export default Animations;