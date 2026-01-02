import Accordian from "@/lib/components/accordian";
import FolderHeader from "./folder-header";
import FileComponent from "@/lib/widgets/folder-viewer/components/file";
import FolderComponent from "@/lib/widgets/folder-viewer/components/folder";
import FolderManager from "@/lib/components/folder-manager";
import useFolderManager from "@/lib/hooks/folder-manager.hook";
import { useEffect, useState } from "react";
import { IFolder } from "@/lib/components/folder-manager/types/folder-manager";
import prepareRootFolder from "@/lib/utils/prepare-root-folder";

function FolderViewer({ folderPath }: { folderPath: string }) {
  const { handleBackFolder, handleForwardFolder, changeFolderTo, fullPath, props } = useFolderManager();
  const [rootFolder, setRootFolder] = useState<IFolder>({
    name: "Root",
    folders: [],
    filePaths: [],
  })

  const handlePrepareRootFolder = async () => {
    const newRootFolder = await prepareRootFolder(folderPath, rootFolder, true);
    setRootFolder({
      name: newRootFolder.name,
      folders: newRootFolder.folders,
      filePaths: newRootFolder.filePaths,
    });
  }

  useEffect(() => {
    handlePrepareRootFolder();
  }, [folderPath])


  return (
    <Accordian title={ 
      <FolderHeader 
        title="Files" 
        onBack={handleBackFolder} 
        onForward={handleForwardFolder} 
        fullPath={fullPath}  
        changeFolderTo={changeFolderTo} 
      /> 
    }>
      <FolderManager 
        rootFolder={rootFolder} 
        FolderComponent={FolderComponent} 
        FileComponent={FileComponent}
        {...props}
        />
    </Accordian>
  )
}

export default FolderViewer;
