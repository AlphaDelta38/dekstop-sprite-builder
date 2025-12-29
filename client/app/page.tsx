'use client';

import { Box } from "@mui/material";
import { useFileController } from "./lib/contexts/file-controller/index.";
import { mergeFiles, MIMEType } from "./lib/utils";
import { FilesState } from "./lib/contexts/file-controller/types";
import isSpineSkeleton from "./lib/utils/spine-skeleton-validator";
import PixiView from "./features/pixi-view";
import useOnlyClientRender from "./lib/hooks/use-only-client-render";
import FileDropzone from "./lib/components/files-dropzone";


export default function Home() {
  const { setFiles, files, filesIsReady } = useFileController();
  const hasMounted = useOnlyClientRender();


  const onDelete = (file: File) => {
    setFiles((prev: FilesState) => ({
      ...prev,
      images: prev.images.filter((f: File) => f.name !== file.name),
      jsons: prev.jsons.filter((f: File) => f.name !== file.name),
      atlases: prev.atlases.filter((f: File) => f.name !== file.name),
    }));
  }

  const onDrop = async (acceptedFiles: File[]) => {
    const atlases: File[] = acceptedFiles.filter((file) => file.name.endsWith(".atlas") && !files.atlases.some((f: File) => f.name === file.name));

    if (files.atlases.length > 0) {
      atlases.push(...files.atlases);
    }

    const mergedAtlas = await mergeFiles(
      atlases, 
      "index.atlas",
       MIMEType.TEXT_PLAIN
    );

    const allowedImages: File[] = [];
    const allowedJson: File[] = [];

    for (const file of acceptedFiles) {
      if (file.type === "application/json" && !files.jsons.some((f: File) => f.name === file.name)) {
        const fileContent = await file.text();
        if (isSpineSkeleton(fileContent)) {
          allowedJson.push(file);
        }
      } else if (file.type.startsWith("image/") && !files.images.some((f: File) => f.name === file.name)) {
        allowedImages.push(file);
      }
    }

    setFiles(prev => ({
      ...prev,
      images: [...prev.images, ...allowedImages],
      jsons: [...prev.jsons, ...allowedJson],
      atlases: atlases,
      indexAtlas: mergedAtlas.size > 0 ? mergedAtlas : null,
    }))
  }

  const extensions = {   
    "image/*": [],
    "application/json": [".json"],
    "text/plain": [".atlas"] 
  }

  if (!hasMounted) return null;
  
  return (
    <Box width={'100%'} height={'100%'} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexDirection: 'column'}}>
      <FileDropzone onDrop={onDrop} onDelete={onDelete} allowsFileExtensions={extensions} files={files.images}  />
      <Box width={'70%'} height={'80%'} sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
        <PixiView />
      </Box>
    </Box>
  );
}
