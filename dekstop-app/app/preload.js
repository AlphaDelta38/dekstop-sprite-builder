import { contextBridge, ipcRenderer, webUtils } from 'electron'

contextBridge.exposeInMainWorld('rendererAPI', {
	getPathForFile: (file) => {
    return webUtils.getPathForFile(file);
  }
});
