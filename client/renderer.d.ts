export interface IElectronAPI {
  invoke: (channel: string, data: any) => Promise<any>;
  getPathForFile: (file: File) => string;
}

declare global {
  interface Window {
    rendererAPI: IElectronAPI;
  }
}