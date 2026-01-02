import { contextBridge, webUtils } from 'electron'
import fs from 'fs/promises';
import path from 'path';

contextBridge.exposeInMainWorld('rendererAPI', {
	getPathForFile: (file) => {
    return webUtils.getPathForFile(file);
  },
  getFilesFromFolder: async (folderPath, recursive = false) => {
    const entries = await fs.readdir(folderPath, { 
      recursive: recursive, 
      withFileTypes: true 
    });

    const filePaths = [];

    for (const entry of entries) {
      if (entry.isFile()) {
        filePaths.push({
          name: entry.name,
          parentFolderPath: entry.path,
          fileFullPath: path.join(folderPath, entry.name),
        });
      }
    }

    return filePaths;
  }



});
