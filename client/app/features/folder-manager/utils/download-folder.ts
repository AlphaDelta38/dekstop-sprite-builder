import zipFiles from "@/app/lib/utils/zip-files";
import { IFolder } from "../types/folder-manager";
import downloadBlob from "@/app/lib/utils/download-blob";

type FileMap = Record<string, File>;

function flattenFolderStructure(
  folder: IFolder,
  parentPath: string = "",
  isRoot: boolean = false
): FileMap {
  const map: FileMap = {};

  const currentPath = isRoot
    ? parentPath
    : parentPath
    ? `${parentPath}/${folder.name}`
    : folder.name;

  folder.files?.forEach((file) => {
    const fullPath = `${currentPath}/${file.name}`;
    map[fullPath] = file;
  });

  folder.folders?.forEach((subfolder) => {
    const nestedMap = flattenFolderStructure(subfolder, currentPath);
    Object.assign(map, nestedMap);
  });

  return map;
}


async function downloadFolder(folder: IFolder) {
  const fileMap = flattenFolderStructure(folder, "", true);

  const zipBlob = await zipFiles(fileMap);
  downloadBlob(zipBlob, `${folder.name}.zip`);
}

export default downloadFolder;
