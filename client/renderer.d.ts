export interface IElectronAPI {
  invoke: (channel: string, data: any) => Promise<any>;
  getPathForFile: (file: File) => string;
  getFilesFromFolder: (folderPath: string, recursive: boolean) => Promise<{ name: string, parentFolderPath: string, fileFullPath: string }[]>;
}

declare global {
  interface Window {
    rendererAPI: IElectronAPI;
  }
}