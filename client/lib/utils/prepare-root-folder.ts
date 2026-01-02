import { IFolder } from "../components/folder-manager/types/folder-manager";

const prepareRootFolder = async (folderPath: string, rootFolder: IFolder, recursive: boolean = false) => {
  const files = await window.rendererAPI.getFilesFromFolder(folderPath, recursive);

  const rootFolderTemp: IFolder = {
    ...rootFolder,
  }

  for (const { name, parentFolderPath, fileFullPath } of files) {
    const relativeFolderPath = parentFolderPath.replace(folderPath, "");
    const folderNames= relativeFolderPath.split("/");
    const currentFolder = rootFolderTemp;
    
    if (relativeFolderPath === "") {
      rootFolderTemp.filePaths.push({ name, parentFolderPath, fileFullPath});
      continue;
    }

    for (const folderName of folderNames) {
      const foundedFolder = currentFolder.folders.find((folder) => folder.name === folderName)

      if (!foundedFolder) {
        currentFolder.folders.push({
          name: folderName,
          folders: [],
          filePaths: [{ name, parentFolderPath, fileFullPath }],
        })
      } else {
        foundedFolder.filePaths.push({ name, parentFolderPath, fileFullPath });
      }
    }
  }

  return rootFolderTemp;
}

export default prepareRootFolder;